export interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  language: string | null;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

export interface CommitActivity {
  total: number;
  week: number;
  days: number[];
}

export interface RepoStats {
  contributors: Contributor[];
  commitActivity: CommitActivity[];
  pullRequests: {
    open: number;
    closed: number;
  };
  issues: {
    open: number;
    closed: number;
  };
}

export interface Commit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  committer: {
    name: string;
    email: string;
    date: string;
  };
  html_url: string;
  avatar_url: string;
}

export interface ConsolidatedStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  pullRequests: {
    open: number;
    closed: number;
  };
  issues: {
    open: number;
    closed: number;
  };
  commitActivity: CommitActivity[];
  topContributors: Contributor[];
}
