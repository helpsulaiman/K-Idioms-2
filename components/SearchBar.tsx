import React, { useState, useEffect } from 'react';
import { SearchFilters } from '../types/idiom';
import { fetchTags } from '../lib/api';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const tags = await fetchTags();
      setAvailableTags(tags);
    } catch (error) {
      console.error('Failed to load tags:', error);
    }
  };

  const handleSearch = () => {
    onSearch({
      query: query.trim(),
      tags: selectedTags
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedTags([]);
    onSearch({ query: '', tags: [] });
  };

  return (
    <div className="search-container">
      {/* Main Search Input */}
      <div className="search-input-row mb-4">
        <div className="flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search idioms by Kashmiri text, meaning, or translation..."
            className="search-input"
          />
        </div>
        <button
          onClick={handleSearch}
          className="btn btn-primary px-6"
        >
          🔍 Search
        </button>
      </div>

      {/* Tags Filter Section */}
      <div className="search-tags-row">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          Filter by category:
        </span>
        
        {/* Add Tag Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTagDropdown(!showTagDropdown)}
            className="btn btn-secondary text-sm"
          >
            + Add Category
          </button>
          
          {showTagDropdown && (
            <div 
              className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto min-w-48"
              style={{ 
                background: 'var(--bg-card)',
                border: '1px solid var(--border-medium)',
                boxShadow: '0 8px 24px var(--shadow-medium)'
              }}
            >
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    toggleTag(tag);
                    setShowTagDropdown(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-opacity-50 transition-colors ${
                    selectedTags.includes(tag) 
                      ? 'font-medium' 
                      : ''
                  }`}
                  style={{ 
                    color: selectedTags.includes(tag) ? 'var(--chinar-orange)' : 'var(--text-primary)',
                    background: selectedTags.includes(tag) ? 'var(--bg-card-right)' : 'transparent'
                  }}
                >
                  {selectedTags.includes(tag) ? '✓ ' : ''}{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Tags */}
        {selectedTags.map(tag => (
          <span
            key={tag}
            className="tag cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => toggleTag(tag)}
            title="Click to remove"
          >
            {tag} ×
          </span>
        ))}

        {/* Clear All Button */}
        {(query || selectedTags.length > 0) && (
          <button
            onClick={clearFilters}
            className="text-sm hover:underline transition-all"
            style={{ color: 'var(--text-muted)' }}
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;