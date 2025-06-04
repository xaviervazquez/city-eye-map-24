/**
 * Search bar component for searching warehouses by location or project name
 * Positioned absolutely at the top of the map view
 */

import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;  // Callback function when user submits search
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');  // Current search input value

  /**
   * Handle form submission when user presses enter or submits
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);  // Pass the search query to parent component
  };

  return (
    // Positioned absolutely over the map with z-index for layering
    <form onSubmit={handleSubmit} className="absolute top-4 left-4 right-4 z-10">
      <div className="relative">
        {/* Search icon positioned inside the input field */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-inactive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {/* Main search input field */}
        <input
          type="text"
          placeholder="Search by city, ZIP, project name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-body-md bg-white rounded-2xl shadow-sm border border-border focus:outline-none focus:ring-2 focus:ring-urgent-blue focus:border-transparent"
        />
      </div>
    </form>
  );
};

export default SearchBar;
