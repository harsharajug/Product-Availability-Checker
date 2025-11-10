
import React from 'react';
import { SearchIcon } from './icons';

interface SearchBarProps {
  url: string;
  setUrl: (url: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ url, setUrl, onSubmit, isLoading }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.amazon.com/dp/..."
          className="w-full pl-4 pr-32 py-4 text-md bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full focus:ring-blue-500 focus:border-blue-500 transition duration-300 shadow-sm"
          disabled={isLoading}
          aria-label="Amazon Product URL"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute inset-y-0 right-0 flex items-center justify-center px-6 m-1.5 text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
             <SearchIcon className="h-5 w-5 mr-2" />
          )}
          <span>{isLoading ? 'Checking...' : 'Check'}</span>
        </button>
      </div>
    </form>
  );
};
