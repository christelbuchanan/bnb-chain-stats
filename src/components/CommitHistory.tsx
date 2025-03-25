import React from 'react';
import { Commit } from '../types';
import { GitCommit, User } from 'lucide-react';

interface CommitHistoryProps {
  commits: Commit[];
}

const CommitHistory: React.FC<CommitHistoryProps> = ({ commits }) => {
  if (commits.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        No commits found in the selected time range
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const truncateMessage = (message: string, maxLength = 100) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };
  
  return (
    <div className="divide-y">
      {commits.map(commit => (
        <div key={commit.sha} className="p-4 hover:bg-gray-50">
          <div className="flex items-start">
            <div className="mr-3">
              {commit.avatar_url ? (
                <img 
                  src={commit.avatar_url} 
                  alt={commit.author.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <a 
                  href={commit.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-900 hover:text-bnb-yellow truncate"
                >
                  {truncateMessage(commit.message.split('\n')[0])}
                </a>
              </div>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <GitCommit className="h-3.5 w-3.5 mr-1" />
                <span className="font-mono">{commit.sha.substring(0, 7)}</span>
                <span className="mx-2">•</span>
                <span>{commit.author.name}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(commit.author.date)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommitHistory;
