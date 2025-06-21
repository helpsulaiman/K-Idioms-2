import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation: React.FC = () => {
  const router = useRouter();

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  return (
    <nav className="site-nav">
      <div className="container">
        <div className="nav-content">
          {/* Logo/Brand on the left */}
          <div className="nav-brand">
            <Link href="/" className="brand-link">
              <span className="brand-text">🍂 Kashmiri Idioms</span>
            </Link>
          </div>

          {/* Navigation buttons on the right */}
          <div className="nav-buttons">
            <Link 
              href="/" 
              className={`nav-btn ${isActive('/') ? 'nav-btn-active' : ''}`}
            >
              Home
            </Link>
            <Link 
              href="/submit" 
              className={`nav-btn ${isActive('/submit') ? 'nav-btn-active' : ''}`}
            >
              Submit Idiom
            </Link>
            <Link 
              href="/about-project" 
              className={`nav-btn ${isActive('/about-project') ? 'nav-btn-active' : ''}`}
            >
              About Project
            </Link>
            <Link 
              href="/about-us" 
              className={`nav-btn ${isActive('/about-us') ? 'nav-btn-active' : ''}`}
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;