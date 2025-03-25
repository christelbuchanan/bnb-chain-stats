import React from 'react';
import { ArrowLeft, Star, GitFork, AlertCircle, Code, ExternalLink } from 'lucide-react';
import { useGithub } from '../contexts/GithubContext';
import TimeRangeSelector from './TimeRangeSelector';
import CommitHistory from './CommitHistory';
import ContributorsList from './ContributorsList';
import ActivityChart from './ActivityChart';

const RepoDetails: React.FC = () => {
  const { 
    selectedRepo, 
    repoStats, 
    repoCommits, 
    fetchingDetails, 
    selectRepository,
    timeRange,
    setTimeRange,
    consolidatedStats,
    fetchingConsolidated
  } = useGithub();
  
  // Show consolidated view when no repo is selected
  const showConsolidatedView = !selectedRepo;
  
  const handleBack = () => {
    selectRepository(null);
  };
  
  if (showConsolidatedView) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">BNB Chain Ecosystem Overview</h2>
          <TimeRangeSelector 
            timeRange={timeRange} 
            onChange={setTimeRange} 
          />
        </div>
        
        {fetchingConsolidated ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bnb-yellow"></div>
          </div>
        ) : consolidatedStats ? (
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Repositories</h3>
                <p className="text-2xl font-bold mt-1">{consolidatedStats.totalRepos}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Stars</h3>
                <div className="flex items-center mt-1">
                  <Star className="h-5 w-5 text-bnb-yellow mr-1" />
                  <p className="text-2xl font-bold">{consolidatedStats.totalStars.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Forks</h3>
                <div className="flex items-center mt-1">
                  <GitFork className="h-5 w-5 text-bnb-yellow mr-1" />
                  <p className="text-2xl font-bold">{consolidatedStats.totalForks.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-gray-500">Total Commits</h3>
                <p className="text-2xl font-bold mt-1">{consolidatedStats.totalCommits.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-base font-medium mb-4">Pull Requests</h3>
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500">{consolidatedStats.pullRequests.open}</div>
                    <div className="text-sm text-gray-500">Open</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-500">{consolidatedStats.pullRequests.closed}</div>
                    <div className="text-sm text-gray-500">Closed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-bnb-yellow">
                      {consolidatedStats.pullRequests.open + consolidatedStats.pullRequests.closed}
                    </div>
                    <div className="text-sm text-gray-500">Total</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-base font-medium mb-4">Issues</h3>
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-500">{consolidatedStats.issues.open}</div>
                    <div className="text-sm text-gray-500">Open</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-500">{consolidatedStats.issues.closed}</div>
                    <div className="text-sm text-gray-500">Closed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-bnb-yellow">
                      {consolidatedStats.issues.open + consolidatedStats.issues.closed}
                    </div>
                    <div className="text-sm text-gray-500">Total</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-base font-medium mb-4">Commit Activity</h3>
                <div className="h-64">
                  <ActivityChart commitActivity={consolidatedStats.commitActivity} />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-base font-medium mb-4">Top Contributors</h3>
                <ContributorsList contributors={consolidatedStats.topContributors} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            No data available
          </div>
        )}
      </div>
    );
  }
  
  if (!selectedRepo) {
    return null;
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={handleBack}
            className="mr-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Back to repository list"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">{selectedRepo.name}</h2>
          <a 
            href={selectedRepo.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-2 text-gray-500 hover:text-gray-700"
            aria-label="Open repository on GitHub"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
        <TimeRangeSelector 
          timeRange={timeRange} 
          onChange={setTimeRange} 
        />
      </div>
      
      {fetchingDetails ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bnb-yellow"></div>
        </div>
      ) : repoStats ? (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <Star className="h-6 w-6 text-bnb-yellow mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Stars</h3>
                <p className="text-xl font-bold">{selectedRepo.stargazers_count.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <GitFork className="h-6 w-6 text-bnb-yellow mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Forks</h3>
                <p className="text-xl font-bold">{selectedRepo.forks_count.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex items-center">
              <AlertCircle className="h-6 w-6 text-bnb-yellow mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Open Issues</h3>
                <p className="text-xl font-bold">{selectedRepo.open_issues_count.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-base font-medium mb-4">Pull Requests</h3>
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">{repoStats.pullRequests.open}</div>
                  <div className="text-sm text-gray-500">Open</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-500">{repoStats.pullRequests.closed}</div>
                  <div className="text-sm text-gray-500">Closed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-bnb-yellow">
                    {repoStats.pullRequests.open + repoStats.pullRequests.closed}
                  </div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-base font-medium mb-4">Issues</h3>
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500">{repoStats.issues.open}</div>
                  <div className="text-sm text-gray-500">Open</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-500">{repoStats.issues.closed}</div>
                  <div className="text-sm text-gray-500">Closed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-bnb-yellow">
                    {repoStats.issues.open + repoStats.issues.closed}
                  </div>
                  <div className="text-sm text-gray-500">Total</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-base font-medium mb-4">Commit Activity</h3>
              <div className="h-64">
                <ActivityChart commitActivity={repoStats.commitActivity} />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-base font-medium mb-4">Top Contributors</h3>
              <ContributorsList contributors={repoStats.contributors} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <h3 className="text-base font-medium mb-4">Recent Commits</h3>
            <CommitHistory commits={repoCommits} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          No data available for this repository
        </div>
      )}
    </div>
  );
};

export default RepoDetails;
