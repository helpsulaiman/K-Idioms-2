import React from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import SpotlightCard from '../components/SpotlightCard';

const HechunRedirectPage: React.FC = () => {
    return (
        <Layout title="Hečhun Has Moved">
            <div className="main-content" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SpotlightCard className="idiom-card" style={{ maxWidth: '600px', height: 'auto', textAlign: 'center' }}>
                    <div className="card-content p-8">
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
                        <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                            Hečhun Has Moved!
                        </h1>
                        <p className="text-meaning mb-6" style={{ fontSize: '1.1rem' }}>
                            The Hečhun learning platform has been moved to a separate site.
                            You can access it at the link below:
                        </p>
                        <a
                            href="https://hechun.vercel.app"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary inline-flex items-center gap-2"
                        >
                            <i className="fas fa-external-link-alt"></i>
                            Visit hechun.vercel.app
                        </a>
                        <div className="mt-6">
                            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                                ← Back to KashWords
                            </Link>
                        </div>
                    </div>
                </SpotlightCard>
            </div>
        </Layout>
    );
};

export default HechunRedirectPage;
