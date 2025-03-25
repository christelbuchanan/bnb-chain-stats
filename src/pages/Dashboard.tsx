import React from 'react';
import RepoList from '../components/RepoList';
import RepoDetails from '../components/RepoDetails';
import { useGithub } from '../contexts/GithubContext';

const Dashboard: React.FC = () => {
  const { selectedRepo } = useGithub();
  
  return (
    <div className="flex-1 flex overflow-hidden">
      <div className={`${selectedRepo ? 'hidden md:block' : 'block'} w-full md:w-1/3 lg:w-1/4 border-r bg-white overflow-hidden`}>
        <RepoList />
      </div>
      <div className={`${selectedRepo ? 'block' : 'hidden md:block'} w-full md:w-2/3 lg:w-3/4 overflow-hidden`}>
        <RepoDetails />
      </div>
    </div>
  );
};

export default Dashboard;
