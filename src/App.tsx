import React from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import { GithubProvider } from './contexts/GithubContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <GithubProvider>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <div className="flex-1 overflow-auto">
            <Dashboard />
          </div>
          <Toaster position="top-right" />
        </div>
      </GithubProvider>
    </ThemeProvider>
  );
}

export default App;
