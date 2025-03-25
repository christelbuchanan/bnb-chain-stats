import React from 'react';
import { Coins, Github, BarChart2, Activity, Settings, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Sidebar: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  
  return (
    <div className="w-16 md:w-64 bg-bnb-dark text-white flex flex-col h-screen">
      <div className="p-4 flex items-center justify-center md:justify-start">
        <Coins className="h-8 w-8 text-bnb-yellow" />
        <span className="hidden md:block ml-2 text-xl font-bold">BNB Chain Analytics</span>
      </div>
      
      <div className="flex-1 py-6">
        <nav className="space-y-2 px-2">
          <a href="#" className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-bnb-yellow bg-opacity-20 text-bnb-yellow">
            <Github className="h-5 w-5" />
            <span className="hidden md:block">Repositories</span>
          </a>
          
          <a href="#" className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
            <BarChart2 className="h-5 w-5" />
            <span className="hidden md:block">Statistics</span>
          </a>
          
          <a href="#" className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
            <Activity className="h-5 w-5" />
            <span className="hidden md:block">Activity</span>
          </a>
          
          <a href="#" className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors">
            <Settings className="h-5 w-5" />
            <span className="hidden md:block">Settings</span>
          </a>
        </nav>
      </div>
      
      <div className="p-4">
        <button 
          onClick={toggleDarkMode}
          className="flex items-center justify-center md:justify-start w-full px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
        >
          {darkMode ? (
            <>
              <Sun className="h-5 w-5 text-bnb-yellow" />
              <span className="hidden md:block ml-3">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-5 w-5" />
              <span className="hidden md:block ml-3">Dark Mode</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
