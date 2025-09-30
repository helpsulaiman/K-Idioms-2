// components/Navigation.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation: React.FC = () => {
  const router = useRouter();
  const isActive = (path: string) => router.pathname.startsWith(path);

  return (
      <nav className="site-nav">
        <div className="container">
          <div className="nav-content">
            <div className="nav-brand">
              <Link href="/" className="brand-link">
                <span className="brand-text">🍁KashWords</span>
              </Link>
            </div>
            <div className="nav-buttons">
              <Link href="/" className={`nav-btn ${router.pathname === '/' ? 'nav-btn-active' : ''}`}>
                Home
              </Link>
              {/* UPDATED: Link now points to /hechun */}
              <Link href="/hechun" className={`nav-btn ${isActive('/hechun') ? 'nav-btn-active' : ''}`}>
                Hećhun (Learn)
              </Link>
              <Link href="/submit" className={`nav-btn ${isActive('/submit') ? 'nav-btn-active' : ''}`}>
                Submit Idiom
              </Link>
              <Link href="/about-project" className={`nav-btn ${isActive('/about-project') ? 'nav-btn-active' : ''}`}>
                About Project
              </Link>
              <Link href="/about-team" className={`nav-btn ${isActive('/about-team') ? 'nav-btn-active' : ''}`}>
                About Us
              </Link>
            </div>
          </div>
        </div>
      </nav>
  );
};

export default Navigation;