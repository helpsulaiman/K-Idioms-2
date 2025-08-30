import React from 'react';
import Head from 'next/head';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({
                                         children,
                                         title = 'Kashmiri Idioms - Preserving Cultural Heritage',
                                         description = 'Discover traditional Kashmiri idioms and their meanings. Explore our collection of cultural expressions that carry the wisdom of Kashmir.'
                                       }) => {
  return (
      <>
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {/* Add Google Fonts for better typography */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          {/* ADDED: Font Awesome for social media icons */}
          <link
              rel="stylesheet"
              href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
              integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
          />
        </Head>

        <div className="min-h-screen flex flex-col">
          {/* Chinar Banner - decorative top stripe */}
          <div className="chinar-banner"></div>

          {/* Site Header */}
          <header className="site-header">
            <Navigation />
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer
              className="py-8 text-center border-t"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-light)',
                color: 'var(--text-secondary)'
              }}
          >
            <div className="container">
              <p className="text-sm">
                © 2024 Kashmiri Idioms - Preserving the wisdom of Kashmir 🍂
              </p>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                Made with love for Kashmiri culture and heritage
              </p>
            </div>
          </footer>
        </div>
      </>
  );
};

export default Layout;