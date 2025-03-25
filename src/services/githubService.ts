import { Repository, RepoStats, Commit, Contributor, ConsolidatedStats } from '../types';

// Configure headers for unauthenticated requests
const getHeaders = () => {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3+json',
  };
  
  console.log('Using unauthenticated GitHub API requests (limited rate)');
  return headers;
};

export async function fetchBnbRepos(): Promise<Repository[]> {
  try {
    // Fetch repositories from multiple sources to ensure we get all BNB Chain repos
    const [bnbChainTopicRepos, bnbchainOrgRepos, binanceChainOrgRepos] = await Promise.all([
      fetchReposByQuery('topic:bnb-chain'),
      fetchReposByQuery('org:bnbchain'),
      fetchReposByQuery('org:binance-chain')
    ]);
    
    // Combine all repositories and remove duplicates based on id
    const allRepos = [...bnbChainTopicRepos, ...bnbchainOrgRepos, ...binanceChainOrgRepos];
    const uniqueRepos = Array.from(
      new Map(allRepos.map(repo => [repo.id, repo])).values()
    );
    
    // Sort by stars (most popular first)
    return uniqueRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
}

async function fetchReposByQuery(query: string): Promise<Repository[]> {
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${query}&sort=updated&per_page=100`,
      { headers: getHeaders() }
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('GitHub API error:', response.status, errorData.message || 'Unknown error');
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.items.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      open_issues_count: repo.open_issues_count,
      updated_at: repo.updated_at,
      language: repo.language,
      owner: {
        login: repo.owner.login,
        avatar_url: repo.owner.avatar_url,
      },
    }));
  } catch (error) {
    console.error(`Error fetching repos with query ${query}:`, error);
    return []; // Return empty array instead of throwing to allow other queries to succeed
  }
}

export async function fetchRepoStats(repoFullName: string, timeRange: string): Promise<RepoStats> {
  try {
    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '1d':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }
    
    const startDateStr = startDate.toISOString().split('T')[0];
    
    // Fetch contributors
    const contributorsResponse = await fetch(
      `https://api.github.com/repos/${repoFullName}/contributors?per_page=10`,
      { headers: getHeaders() }
    );
    
    if (!contributorsResponse.ok) {
      throw new Error(`GitHub API error: ${contributorsResponse.status}`);
    }
    
    const contributorsData = await contributorsResponse.json();
    const contributors: Contributor[] = contributorsData.map((contributor: any) => ({
      login: contributor.login,
      avatar_url: contributor.avatar_url,
      contributions: contributor.contributions,
      html_url: contributor.html_url,
    }));
    
    // Fetch commit activity
    const commitsResponse = await fetch(
      `https://api.github.com/repos/${repoFullName}/stats/commit_activity`,
      { headers: getHeaders() }
    );
    
    if (!commitsResponse.ok) {
      throw new Error(`GitHub API error: ${commitsResponse.status}`);
    }
    
    const commitsData = await commitsResponse.json();
    
    // Fetch pull requests
    const pullRequestsResponse = await fetch(
      `https://api.github.com/repos/${repoFullName}/pulls?state=all&per_page=100&since=${startDateStr}`,
      { headers: getHeaders() }
    );
    
    if (!pullRequestsResponse.ok) {
      throw new Error(`GitHub API error: ${pullRequestsResponse.status}`);
    }
    
    const pullRequestsData = await pullRequestsResponse.json();
    const openPRs = pullRequestsData.filter((pr: any) => pr.state === 'open').length;
    const closedPRs = pullRequestsData.filter((pr: any) => pr.state === 'closed').length;
    
    // Fetch issues
    const issuesResponse = await fetch(
      `https://api.github.com/repos/${repoFullName}/issues?state=all&per_page=100&since=${startDateStr}`,
      { headers: getHeaders() }
    );
    
    if (!issuesResponse.ok) {
      throw new Error(`GitHub API error: ${issuesResponse.status}`);
    }
    
    const issuesData = await issuesResponse.json();
    const openIssues = issuesData.filter((issue: any) => issue.state === 'open' && !issue.pull_request).length;
    const closedIssues = issuesData.filter((issue: any) => issue.state === 'closed' && !issue.pull_request).length;
    
    return {
      contributors,
      commitActivity: commitsData,
      pullRequests: {
        open: openPRs,
        closed: closedPRs,
      },
      issues: {
        open: openIssues,
        closed: closedIssues,
      },
    };
  } catch (error) {
    console.error(`Error fetching stats:`, error);
    throw error;
  }
}

export async function fetchRepoCommits(repoFullName: string, timeRange: string): Promise<Commit[]> {
  try {
    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '1d':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }
    
    const startDateStr = startDate.toISOString();
    
    const response = await fetch(
      `https://api.github.com/repos/${repoFullName}/commits?since=${startDateStr}&per_page=100`,
      { headers: getHeaders() }
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.map((commit: any) => ({
      sha: commit.sha,
      message: commit.commit.message,
      author: {
        name: commit.commit.author.name,
        email: commit.commit.author.email,
        date: commit.commit.author.date,
      },
      committer: {
        name: commit.commit.committer.name,
        email: commit.commit.committer.email,
        date: commit.commit.committer.date,
      },
      html_url: commit.html_url,
      avatar_url: commit.author?.avatar_url || '',
    }));
  } catch (error) {
    console.error(`Error fetching commits:`, error);
    throw error;
  }
}

export async function fetchConsolidatedStats(repositories: Repository[], timeRange: string): Promise<ConsolidatedStats> {
  try {
    // Take top 10 repositories by stars for performance reasons
    const topRepos = repositories.slice(0, 10);
    
    // Calculate date range
    const endDate = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '1d':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }
    
    const startDateStr = startDate.toISOString().split('T')[0];
    
    // Fetch data for each repository in parallel
    const repoDataPromises = topRepos.map(async (repo) => {
      try {
        // Fetch contributors
        const contributorsResponse = await fetch(
          `https://api.github.com/repos/${repo.full_name}/contributors?per_page=10`,
          { headers: getHeaders() }
        );
        
        const contributors = contributorsResponse.ok 
          ? await contributorsResponse.json() 
          : [];
        
        // Fetch commit activity
        const commitsResponse = await fetch(
          `https://api.github.com/repos/${repo.full_name}/stats/commit_activity`,
          { headers: getHeaders() }
        );
        
        const commitActivity = commitsResponse.ok 
          ? await commitsResponse.json() 
          : [];
        
        // Fetch pull requests
        const pullRequestsResponse = await fetch(
          `https://api.github.com/repos/${repo.full_name}/pulls?state=all&per_page=100&since=${startDateStr}`,
          { headers: getHeaders() }
        );
        
        const pullRequests = pullRequestsResponse.ok 
          ? await pullRequestsResponse.json() 
          : [];
        
        // Fetch issues
        const issuesResponse = await fetch(
          `https://api.github.com/repos/${repo.full_name}/issues?state=all&per_page=100&since=${startDateStr}`,
          { headers: getHeaders() }
        );
        
        const issues = issuesResponse.ok 
          ? await issuesResponse.json() 
          : [];
        
        return {
          repoName: repo.name,
          repoFullName: repo.full_name,
          contributors,
          commitActivity,
          pullRequests,
          issues,
        };
      } catch (error) {
        console.error(`Error fetching data for ${repo.full_name}:`, error);
        return {
          repoName: repo.name,
          repoFullName: repo.full_name,
          contributors: [],
          commitActivity: [],
          pullRequests: [],
          issues: [],
        };
      }
    });
    
    const reposData = await Promise.all(repoDataPromises);
    
    // Aggregate data
    let totalCommits = 0;
    let totalOpenPRs = 0;
    let totalClosedPRs = 0;
    let totalOpenIssues = 0;
    let totalClosedIssues = 0;
    
    // For commit activity chart
    const weeklyCommitActivity: Record<number, number> = {};
    
    // For top contributors
    const contributorsMap: Record<string, { login: string; avatar_url: string; contributions: number; html_url: string }> = {};
    
    reposData.forEach(repoData => {
      // Count commits from commit activity
      if (Array.isArray(repoData.commitActivity)) {
        repoData.commitActivity.forEach(week => {
          totalCommits += week.total || 0;
          
          // Aggregate weekly data for chart
          if (!weeklyCommitActivity[week.week]) {
            weeklyCommitActivity[week.week] = 0;
          }
          weeklyCommitActivity[week.week] += week.total || 0;
        });
      }
      
      // Count PRs
      if (Array.isArray(repoData.pullRequests)) {
        totalOpenPRs += repoData.pullRequests.filter(pr => pr.state === 'open').length;
        totalClosedPRs += repoData.pullRequests.filter(pr => pr.state === 'closed').length;
      }
      
      // Count issues
      if (Array.isArray(repoData.issues)) {
        totalOpenIssues += repoData.issues.filter(issue => issue.state === 'open' && !issue.pull_request).length;
        totalClosedIssues += repoData.issues.filter(issue => issue.state === 'closed' && !issue.pull_request).length;
      }
      
      // Aggregate contributors
      if (Array.isArray(repoData.contributors)) {
        repoData.contributors.forEach(contributor => {
          if (!contributorsMap[contributor.login]) {
            contributorsMap[contributor.login] = {
              login: contributor.login,
              avatar_url: contributor.avatar_url,
              contributions: 0,
              html_url: contributor.html_url,
            };
          }
          contributorsMap[contributor.login].contributions += contributor.contributions || 0;
        });
      }
    });
    
    // Convert weekly commit activity to array format expected by chart
    const commitActivityArray = Object.entries(weeklyCommitActivity)
      .map(([week, total]) => ({
        week: parseInt(week),
        total,
        days: [0, 0, 0, 0, 0, 0, 0], // We don't have daily breakdown in consolidated view
      }))
      .sort((a, b) => a.week - b.week);
    
    // Get top 10 contributors
    const topContributors = Object.values(contributorsMap)
      .sort((a, b) => b.contributions - a.contributions)
      .slice(0, 10);
    
    return {
      totalRepos: repositories.length,
      totalStars: repositories.reduce((sum, repo) => sum + repo.stargazers_count, 0),
      totalForks: repositories.reduce((sum, repo) => sum + repo.forks_count, 0),
      totalCommits,
      pullRequests: {
        open: totalOpenPRs,
        closed: totalClosedPRs,
      },
      issues: {
        open: totalOpenIssues,
        closed: totalClosedIssues,
      },
      commitActivity: commitActivityArray,
      topContributors,
    };
  } catch (error) {
    console.error('Error fetching consolidated stats:', error);
    throw error;
  }
}
