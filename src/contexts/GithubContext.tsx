import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { fetchBnbRepos, fetchRepoStats, fetchRepoCommits, fetchConsolidatedStats } from '../services/githubService';
import { Repository, RepoStats, Commit, ConsolidatedStats } from '../types';

interface GithubContextType {
  repositories: Repository[];
  loading: boolean;
  error: string | null;
  selectedRepo: Repository | null;
  repoStats: RepoStats | null;
  repoCommits: Commit[];
  fetchingDetails: boolean;
  selectRepository: (repo: Repository | null) => void;
  refreshData: () => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
  consolidatedStats: ConsolidatedStats | null;
  fetchingConsolidated: boolean;
}

const GithubContext = createContext<GithubContextType | undefined>(undefined);

export const GithubProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [repoStats, setRepoStats] = useState<RepoStats | null>(null);
  const [repoCommits, setRepoCommits] = useState<Commit[]>([]);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [consolidatedStats, setConsolidatedStats] = useState<ConsolidatedStats | null>(null);
  const [fetchingConsolidated, setFetchingConsolidated] = useState(false);

  const loadRepositories = async () => {
    setLoading(true);
    setError(null);
    try {
      const repos = await fetchBnbRepos();
      setRepositories(repos);
      
      // Load consolidated stats after repositories are loaded
      loadConsolidatedStats(repos);
    } catch (err: any) {
      console.error('Repository fetch error:', err);
      
      // Only show error toast in production, use sample data in development
      if (process.env.NODE_ENV === 'production') {
        const errorMessage = err.message || 'Failed to fetch repositories';
        setError(errorMessage);
        toast.error('Unable to load repositories. Please try again later.');
      } else {
        // In development, just use sample data without showing errors
        console.log('Using sample repository data for development');
        const sampleRepos = getSampleRepositories();
        setRepositories(sampleRepos);
        
        // Load sample consolidated stats
        setConsolidatedStats(getSampleConsolidatedStats());
      }
    } finally {
      setLoading(false);
    }
  };

  const loadConsolidatedStats = async (repos: Repository[]) => {
    setFetchingConsolidated(true);
    try {
      const stats = await fetchConsolidatedStats(repos, timeRange);
      setConsolidatedStats(stats);
    } catch (err: any) {
      console.error('Consolidated stats fetch error:', err);
      
      // Only show error toast in production, use sample data in development
      if (process.env.NODE_ENV === 'production') {
        toast.error('Unable to load consolidated statistics. Please try again later.');
      } else {
        // In development, just use sample data without showing errors
        console.log('Using sample consolidated stats for development');
        setConsolidatedStats(getSampleConsolidatedStats());
      }
    } finally {
      setFetchingConsolidated(false);
    }
  };

  useEffect(() => {
    loadRepositories();
  }, []);

  useEffect(() => {
    if (repositories.length > 0) {
      loadConsolidatedStats(repositories);
    }
  }, [timeRange, repositories.length]);

  const selectRepository = async (repo: Repository | null) => {
    setSelectedRepo(repo);
    
    if (!repo) {
      setRepoStats(null);
      setRepoCommits([]);
      return;
    }
    
    setFetchingDetails(true);
    
    try {
      const [stats, commits] = await Promise.all([
        fetchRepoStats(repo.full_name, timeRange),
        fetchRepoCommits(repo.full_name, timeRange)
      ]);
      
      setRepoStats(stats);
      setRepoCommits(commits);
    } catch (err: any) {
      console.error('Repository details fetch error:', err);
      
      // Only show error toast in production, use sample data in development
      if (process.env.NODE_ENV === 'production') {
        toast.error('Unable to load repository details. Please try again later.');
      } else {
        // In development, just use sample data without showing errors
        console.log('Using sample repository details for development');
        setRepoStats(getSampleRepoStats());
        setRepoCommits(getSampleCommits());
      }
    } finally {
      setFetchingDetails(false);
    }
  };

  const refreshData = () => {
    loadRepositories();
    if (selectedRepo) {
      selectRepository(selectedRepo);
    }
  };

  useEffect(() => {
    if (selectedRepo) {
      selectRepository(selectedRepo);
    }
  }, [timeRange]);

  return (
    <GithubContext.Provider value={{
      repositories,
      loading,
      error,
      selectedRepo,
      repoStats,
      repoCommits,
      fetchingDetails,
      selectRepository,
      refreshData,
      timeRange,
      setTimeRange,
      consolidatedStats,
      fetchingConsolidated
    }}>
      {children}
    </GithubContext.Provider>
  );
};

export const useGithub = () => {
  const context = useContext(GithubContext);
  if (context === undefined) {
    throw new Error('useGithub must be used within a GithubProvider');
  }
  return context;
};

// Sample data for development when API fails
function getSampleRepositories(): Repository[] {
  return [
    {
      id: 1,
      name: 'bnb-chain',
      full_name: 'bnbchain/bnb-chain',
      description: 'Official BNB Chain repository',
      html_url: 'https://github.com/bnbchain/bnb-chain',
      stargazers_count: 1250,
      forks_count: 320,
      open_issues_count: 45,
      updated_at: new Date().toISOString(),
      language: 'Go',
      owner: {
        login: 'bnbchain',
        avatar_url: 'https://avatars.githubusercontent.com/u/39760209?v=4',
      },
    },
    {
      id: 2,
      name: 'bsc',
      full_name: 'bnbchain/bsc',
      description: 'A BNB Smart Chain client based on the go-ethereum fork',
      html_url: 'https://github.com/bnbchain/bsc',
      stargazers_count: 2100,
      forks_count: 890,
      open_issues_count: 67,
      updated_at: new Date().toISOString(),
      language: 'Go',
      owner: {
        login: 'bnbchain',
        avatar_url: 'https://avatars.githubusercontent.com/u/39760209?v=4',
      },
    },
    {
      id: 3,
      name: 'tss-lib',
      full_name: 'bnbchain/tss-lib',
      description: 'Threshold Signature Scheme implementation',
      html_url: 'https://github.com/bnbchain/tss-lib',
      stargazers_count: 780,
      forks_count: 210,
      open_issues_count: 23,
      updated_at: new Date().toISOString(),
      language: 'Go',
      owner: {
        login: 'bnbchain',
        avatar_url: 'https://avatars.githubusercontent.com/u/39760209?v=4',
      },
    }
  ];
}

function getSampleRepoStats(): RepoStats {
  return {
    contributors: [
      {
        login: 'developer1',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
        contributions: 127,
        html_url: 'https://github.com/developer1',
      },
      {
        login: 'developer2',
        avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
        contributions: 95,
        html_url: 'https://github.com/developer2',
      },
      {
        login: 'developer3',
        avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4',
        contributions: 64,
        html_url: 'https://github.com/developer3',
      },
    ],
    commitActivity: [
      { total: 17, week: 1646006400, days: [2, 3, 1, 4, 2, 3, 2] },
      { total: 22, week: 1646611200, days: [3, 5, 2, 4, 3, 2, 3] },
      { total: 14, week: 1647216000, days: [1, 2, 3, 2, 1, 3, 2] },
      { total: 28, week: 1647820800, days: [4, 5, 3, 6, 4, 3, 3] },
    ],
    pullRequests: {
      open: 12,
      closed: 48,
    },
    issues: {
      open: 23,
      closed: 76,
    },
  };
}

function getSampleCommits(): Commit[] {
  return [
    {
      sha: 'abc123',
      message: 'Fix critical security vulnerability in transaction processing',
      author: {
        name: 'Developer One',
        email: 'dev1@example.com',
        date: new Date(Date.now() - 86400000).toISOString(),
      },
      committer: {
        name: 'Developer One',
        email: 'dev1@example.com',
        date: new Date(Date.now() - 86400000).toISOString(),
      },
      html_url: 'https://github.com/bnbchain/bsc/commit/abc123',
      avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
    },
    {
      sha: 'def456',
      message: 'Improve performance of block validation by 30%',
      author: {
        name: 'Developer Two',
        email: 'dev2@example.com',
        date: new Date(Date.now() - 172800000).toISOString(),
      },
      committer: {
        name: 'Developer Two',
        email: 'dev2@example.com',
        date: new Date(Date.now() - 172800000).toISOString(),
      },
      html_url: 'https://github.com/bnbchain/bsc/commit/def456',
      avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
    },
    {
      sha: 'ghi789',
      message: 'Add new API endpoints for token statistics',
      author: {
        name: 'Developer Three',
        email: 'dev3@example.com',
        date: new Date(Date.now() - 259200000).toISOString(),
      },
      committer: {
        name: 'Developer Three',
        email: 'dev3@example.com',
        date: new Date(Date.now() - 259200000).toISOString(),
      },
      html_url: 'https://github.com/bnbchain/bsc/commit/ghi789',
      avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4',
    },
  ];
}

function getSampleConsolidatedStats(): ConsolidatedStats {
  return {
    totalRepos: 25,
    totalStars: 5280,
    totalForks: 1850,
    totalCommits: 4320,
    pullRequests: {
      open: 87,
      closed: 342,
    },
    issues: {
      open: 156,
      closed: 523,
    },
    commitActivity: [
      { total: 45, week: 1646006400, days: [0, 0, 0, 0, 0, 0, 0] },
      { total: 62, week: 1646611200, days: [0, 0, 0, 0, 0, 0, 0] },
      { total: 38, week: 1647216000, days: [0, 0, 0, 0, 0, 0, 0] },
      { total: 71, week: 1647820800, days: [0, 0, 0, 0, 0, 0, 0] },
      { total: 53, week: 1648425600, days: [0, 0, 0, 0, 0, 0, 0] },
      { total: 67, week: 1649030400, days: [0, 0, 0, 0, 0, 0, 0] },
      { total: 49, week: 1649635200, days: [0, 0, 0, 0, 0, 0, 0] },
      { total: 58, week: 1650240000, days: [0, 0, 0, 0, 0, 0, 0] },
    ],
    topContributors: [
      {
        login: 'bnb-developer1',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
        contributions: 327,
        html_url: 'https://github.com/bnb-developer1',
      },
      {
        login: 'bnb-developer2',
        avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
        contributions: 285,
        html_url: 'https://github.com/bnb-developer2',
      },
      {
        login: 'bnb-developer3',
        avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4',
        contributions: 214,
        html_url: 'https://github.com/bnb-developer3',
      },
      {
        login: 'bnb-developer4',
        avatar_url: 'https://avatars.githubusercontent.com/u/4?v=4',
        contributions: 189,
        html_url: 'https://github.com/bnb-developer4',
      },
      {
        login: 'bnb-developer5',
        avatar_url: 'https://avatars.githubusercontent.com/u/5?v=4',
        contributions: 156,
        html_url: 'https://github.com/bnb-developer5',
      },
    ],
  };
}
