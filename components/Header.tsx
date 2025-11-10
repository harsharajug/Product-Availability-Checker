
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold text-gray-800 dark:text-white">
            <span className="text-blue-500">Gemini</span> Price Checker
          </div>
        </div>
      </div>
    </header>
  );
};
