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
  const [isFocused, setIsFocused] = useState(false);

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
    <div className="w-full max-w-[900px] mx-auto mb-12 relative z-10">
      {/* Glow Effect - Gold/Primary Theme */}
      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/30 via-primary/30 to-amber-500/30 rounded-3xl opacity-20 blur-xl group-hover:opacity-40 transition duration-1000"></div>

      <div className={`
        relative bg-card/80 backdrop-blur-xl border border-border/50
        rounded-2xl p-2 shadow-2xl transition-all duration-300
        ${isFocused ? 'ring-2 ring-primary/30 translate-y-[-2px]' : ''}
      `}>
        {/* Main Input Row */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1 relative flex items-center">
            <div className="absolute left-4 text-muted-foreground">
              <i className="fas fa-search text-lg"></i>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search idioms by text, meaning, or translation..."
              className="w-full h-14 pl-12 pr-10 bg-transparent text-lg text-foreground placeholder:text-muted-foreground focus:outline-none rounded-xl font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>

          <button
            onClick={handleSearch}
            className="h-14 px-8 rounded-xl bg-gradient-to-r from-primary to-yellow-600 hover:from-yellow-500 hover:to-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 transform active:scale-95"
          >
            Search
          </button>
        </div>

        {/* Filter Section */}
        <div className="px-2 pb-2 pt-3 border-t border-border/50 mt-1 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">Filters:</span>

          {/* Add Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowTagDropdown(!showTagDropdown)}
              className={`
                  flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${showTagDropdown
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}
                `}
            >
              <i className="fas fa-plus text-xs"></i> Category
            </button>

            {showTagDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowTagDropdown(false)}></div>
                <div className="absolute top-full left-0 mt-2 bg-popover text-popover-foreground rounded-xl shadow-xl border border-border z-20 w-64 max-h-64 overflow-y-auto p-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="text-xs font-semibold text-muted-foreground px-2 py-1 mb-1">Select Categories</div>
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`
                          w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between group
                          ${selectedTags.includes(tag)
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-foreground hover:bg-muted'}
                        `}
                    >
                      <span>{tag}</span>
                      {selectedTags.includes(tag) && <i className="fas fa-check text-xs text-primary"></i>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Active Tags */}
          {selectedTags.map(tag => (
            <span
              key={tag}
              onClick={() => toggleTag(tag)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground border border-primary/20 text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
              title="Remove filter"
            >
              {tag}
              <i className="fas fa-times text-[10px] opacity-70"></i>
            </span>
          ))}

          {/* Clear All */}
          {(query || selectedTags.length > 0) && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
            >
              <i className="fas fa-trash-alt"></i> Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;