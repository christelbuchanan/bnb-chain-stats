import React from 'react';
import { Contributor } from '../types';
import { User } from 'lucide-react';

interface ContributorsListProps {
  contributors: Contributor[];
}

const ContributorsList: React.FC<ContributorsListProps> = ({ contributors }) => {
  if (contributors.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 text-gray-500">
        No contributors found
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {contributors.map(contributor => (
        <a 
          key={contributor.login}
          href={contributor.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center p-2 rounded-lg hover:bg-gray-50"
        >
          <img 
            src={contributor.avatar_url} 
            alt={contributor.login}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {contributor.login}
            </p>
            <p className="text-xs text-gray-500">
              {contributor.contributions} {contributor.contributions === 1 ? 'contribution' : 'contributions'}
            </p>
          </div>
          <div className="ml-2">
            <div className="w-12 h-6 bg-bnb-yellow rounded-full flex items-center justify-center text-xs font-bold text-bnb-dark">
              #{contributors.findIndex(c => c.login === contributor.login) + 1}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default ContributorsList;
