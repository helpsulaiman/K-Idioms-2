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
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newTags);
    onSearch({
      query: query.trim(),
      tags: newTags
    });
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedTags([]);
    onSearch({ query: '', tags: [] });
  };

  return (
    <div className="w-full max-w-[1260px] mx-auto mb-8 bg-card border border-border rounded-xl p-6 shadow-sm">
      {/* Main Search Input */}
      <div className="flex gap-4 items-center mb-4">
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search idioms by Kashmiri text, meaning, or translation..."
            className="w-full px-4 py-3 bg-secondary/30 ml-1 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring outline-none text-foreground placeholder:text-muted-foreground transition-all"
          />
        </div>
        <button
          onClick={handleSearch}
          className="btn btn-primary px-6 shrink-0"
        >
          🔍 Search
        </button>
      </div>

      {/* Tags Filter Section */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Filter by category:
        </span>

        {/* Add Tag Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowTagDropdown(!showTagDropdown)}
            className="btn btn-secondary text-sm px-4 py-2 rounded-full"
          >
            + Add Category
          </button>

          {showTagDropdown && (
            <div
              className="absolute top-full left-0 mt-2 bg-popover rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto min-w-48 border border-border p-2"
            >
              {availableTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    toggleTag(tag);
                    setShowTagDropdown(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${selectedTags.includes(tag)
                    ? 'font-medium text-primary-foreground bg-primary'
                    : 'text-foreground hover:bg-muted'
                    }`}
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
            className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1"
            onClick={() => toggleTag(tag)}
            title="Click to remove"
          >
            {tag} <span className="text-xs opacity-70">×</span>
          </span>
        ))}

        {/* Clear All Button */}
        {(query || selectedTags.length > 0) && (
          <button
            onClick={clearFilters}
            className="text-sm hover:underline transition-all text-muted-foreground ml-2"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;