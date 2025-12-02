import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image'; // 1. Import the Image component
import { useUser } from '@supabase/auth-helpers-react';

const Navigation: React.FC = () => {
  const router = useRouter();
  const user = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => router.pathname.startsWith(path);

  return (
    <nav className="site-nav">
      <div className="container">
        <div className="nav-content">
          <div className="nav-brand">
            {/* 2. Use the new styles from the module file */}
            <Link href="/" className="brand-container" onClick={() => setIsOpen(false)}>

              <span className="brand-text">🍁KashWords</span>
            </Link>
          </div>

          <div className="hamburger-button" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? '✕' : '☰'}
          </div>

          <div className="nav-buttons">
            <Link href="/" className={`nav-btn ${router.pathname === '/' ? 'nav-btn-active' : ''}`}>
              Home
            </Link>
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
            {user ? (
              <Link href="/profile" className={`nav-btn ${isActive('/profile') ? 'nav-btn-active' : ''}`}>
                Profile
              </Link>
            ) : (
              <Link href="/auth/login" className={`nav-btn ${isActive('/auth/login') ? 'nav-btn-active' : ''}`}>
                Login
              </Link>
            )}
          </div>
        </div>

        {isOpen && (
          <div className="mobile-menu">
            <Link href="/" className="mobile-nav-btn" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/hechun" className="mobile-nav-btn" onClick={() => setIsOpen(false)}>Hećhun (Learn)</Link>
            <Link href="/submit" className="mobile-nav-btn" onClick={() => setIsOpen(false)}>Submit Idiom</Link>
            <Link href="/about-project" className="mobile-nav-btn" onClick={() => setIsOpen(false)}>About Project</Link>
            <Link href="/about-team" className="mobile-nav-btn" onClick={() => setIsOpen(false)}>About Us</Link>
            {user ? (
              <Link href="/profile" className="mobile-nav-btn" onClick={() => setIsOpen(false)}>Profile</Link>
            ) : (
              <Link href="/auth/login" className="mobile-nav-btn" onClick={() => setIsOpen(false)}>Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;