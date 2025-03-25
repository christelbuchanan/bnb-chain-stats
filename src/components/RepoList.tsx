import React, { useState } from 'react';
import { Search, Star, GitFork, AlertCircle, Code } from 'lucide-react';
import { Repository } from '../types';
import { useGithub } from '../contexts/GithubContext';

const RepoList: React.FC = () => {
  const { repositories, loading, selectRepository, selectedRepo } = useGithub();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredRepos = repositories.filter(repo => 
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bnb-yellow"></div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search repositories..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-bnb-yellow focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filteredRepos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <Search className="h-12 w-12 mb-2" />
            <p>No repositories found</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredRepos.map(repo => (
              <div 
                key={repo.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedRepo?.id === repo.id ? 'bg-bnb-yellow bg-opacity-10 border-l-4 border-bnb-yellow' : ''
                }`}
                onClick={() => selectRepository(repo)}
              >
                <div className="flex items-start">
                  <img 
                    src={repo.owner.avatar_url} 
                    alt={repo.owner.login}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {repo.full_name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {repo.description || 'No description provided'}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-500 space-x-4">
                      {repo.language && (
                        <div className="flex items-center">
                          <Code className="h-3.5 w-3.5 mr-1" />
                          <span>{repo.language}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Star className="h-3.5 w-3.5 mr-1" />
                        <span>{repo.stargazers_count}</span>
                      </div>
                      <div className="flex items-center">
                        <GitFork className="h-3.5 w-3.5 mr-1" />
                        <span>{repo.forks_count}</span>
                      </div>
                      <div className="flex items-center">
                        <AlertCircle className="h-3.5 w-3.5 mr-1" />
                        <span>{repo.open_issues_count}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                      Updated on {formatDate(repo.updated_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoList;
