import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import IdiomCardFlip from '../components/IdiomCardFlip';
import SearchBar from '../components/SearchBar';
import { Idiom, SearchFilters } from '../types/idiom';
import { fetchIdioms, searchIdioms } from '../lib/api';


const HomePage: React.FC = () => {
  const [idioms, setIdioms] = useState<Idiom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    tags: []
  });
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);

  useEffect(() => {
    loadIdioms();
  }, []);

  const loadIdioms = async () => {
    try {
      setLoading(true);
      const data = await fetchIdioms();
      setIdioms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load idioms');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters: SearchFilters) => {
    try {
      setLoading(true);
      setSearchFilters(filters)
      if (filters.query.trim() === '' && filters.tags.length === 0) {
        const data = await fetchIdioms();
        setIdioms(data);
      } else {
        const data = await searchIdioms(filters);
        setIdioms(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCardFlip = (idiomId: string) => {
    // If clicking the same card, close it. Otherwise, open the new one
    setFlippedCardId(flippedCardId === idiomId ? null : idiomId);
  };

  if (error) {
    return (
      <Layout>
        <div className="error-container">
          <div className="error-message">
            ⚠️ {error}
          </div>
          <button
            onClick={loadIdioms}
            className="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Kashmiri Idioms - Cultural Heritage">
      <div className="main-content">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title-styled">
            Kash<span className="gradient-text">Words</span>
          </h1>
          <p className="page-subtitle">
            The traditional Kashmiri sayings are a repository of wisdom and beauty, encapsulating centuries of cultural heritage and timeless insights. As Kashmiri is recognized as a vulnerable language by <strong>UNESCO</strong>, it is imperative to preserve this legacy.
          </p>
        </div>

        {/* Search Bar & Actions */}
        <div className="flex flex-col gap-3 items-center justify-center mb-8">
          <div className="w-full">
            <SearchBar onSearch={handleSearch} />
          </div>
          <Link
            href="/submit"
            className="text-base text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 opacity-80 hover:opacity-100"
          >
            Don't see an idiom? <span className="underline decoration-dotted underline-offset-4">Contribute a suggestion</span>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div className="loading-text">
              {searchFilters.query || searchFilters.tags.length > 0
                ? 'Searching idioms...'
                : 'Loading idioms...'
              }
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && (
          <>
            {/* Results count */}
            <div style={{
              textAlign: 'center',
              marginBottom: '1rem',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem'
            }}>
              {searchFilters.query || searchFilters.tags.length > 0
                ? `Found ${idioms.length} idiom${idioms.length !== 1 ? 's' : ''}`
                : `Showing ${idioms.length} idiom${idioms.length !== 1 ? 's' : ''}`
              }
            </div>

            {/* Idioms Grid */}
            {idioms.length > 0 ? (
              <div className="idioms-grid p-4 sm:p-2">
                {idioms.map((idiom) => (
                  <IdiomCardFlip key={idiom.id} idiom={idiom} isFlipped={flippedCardId === idiom.id} onFlip={() => handleCardFlip(idiom.id)} />
                ))}
              </div>
            ) : (
              <div className="error-container">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                <div className="error-message">
                  No idioms found matching your search.
                </div>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Try different keywords or remove some filters.
                </p>
                <button
                  onClick={() => handleSearch({ query: '', tags: [] })}
                  className="btn btn-secondary"
                >
                  Show All Idioms
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
