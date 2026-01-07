import React from 'react';
import Layout from '../components/Layout';
import Link from "next/link";
import SpotlightCard from '../components/SpotlightCard';
import styles from "@/styles/Alphabet.module.css";

const AboutProjectPage: React.FC = () => {
  return (
    <Layout>

      <div className={styles.pageContainer}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>About the Project</h1>
          <p className={styles.pageSubtitle}>
            Safeguarding Our Voice: A Digital Initiative for the Kashmiri Language
          </p>
        </div>
      </div>


      {/* --- The Core Mission: Preservation --- */}
      <div className="idioms-grid" style={{ maxWidth: '1000px' }}>
        <SpotlightCard className="idiom-card" style={{ height: 'auto' }}>
          <div className="card-content">
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Why Preservation Matters</h2>
            <p className="text-meaning" style={{ fontSize: '1.1rem' }}>
              The Kashmiri language (Koshur) is currently classified as "vulnerable" by UNESCO.
              In an increasingly digital world, languages that lack a strong online presence risk fading away.
              Our primary mission is to build a modern, digital infrastructure for Kashmiri, ensuring it thrives not just in our homes, but in the future of technology.
            </p>
          </div>
        </SpotlightCard>
        <SpotlightCard className="idiom-card" style={{ height: 'auto' }}>
          <div className="card-content">
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>KashWords (Kashmiri Idioms)</h2>
            <p className="text-meaning" style={{ fontSize: '1.1rem' }}>
              At the heart of this initiative is <strong>KashWords</strong>, our digital archive of traditional Kashmiri sayings.
              We believe preservation starts with documentation. By making these idioms accessible and searchable,
              we empower a new generation to connect with their cultural roots.
            </p>
          </div>
        </SpotlightCard>
      </div>

      {/* --- What We Are Building --- */}
      <div className="about-section" style={{ marginBlock: '2rem' }}>
        <h2 className={styles.pageTitle}>Our Preservation Strategy</h2>
      </div>
      <div className="idioms-grid">
        <SpotlightCard className="idiom-card" style={{ height: 'auto' }}>
          <div className="card-content">
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>📖 Organized Collection</h3>
            <p className="text-meaning" style={{ fontSize: '1.1rem' }}>
              We've moved beyond scattered resources to build a comprehensive, searchable database of Kashmiri idioms
              complete with meanings, usage, and cultural context.
            </p>
          </div>
        </SpotlightCard>
        <SpotlightCard className="idiom-card" style={{ height: 'auto' }}>
          <div className="card-content">
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>📚 Digital Archive</h3>
            <p className="text-meaning" style={{ fontSize: '1.1rem' }}>
              We are digitizing folklore, proverbs, and sayings. Our <strong>Kashmiri Idioms</strong> collection serves as a repository
              of cultural wisdom, preserving expressions that capture the essence of our worldview.
            </p>
          </div>
        </SpotlightCard>
        <SpotlightCard className="idiom-card" style={{ height: 'auto' }}>
          <div className="card-content">
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>🤝 Community Driven</h3>
            <p className="text-meaning" style={{ fontSize: '1.1rem' }}>
              Preservation is a collective effort. We provide tools for the community to contribute idioms, translations, and context,
              making this a living, breathing platform owned by the people.
            </p>
          </div>
        </SpotlightCard>
        <SpotlightCard className="idiom-card" style={{ height: 'auto' }}>
          <div className="card-content">
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>🔍 Searchable & Accessible</h3>
            <p className="text-meaning" style={{ fontSize: '1.1rem' }}>
              Every idiom is tagged and categorized, making it easy to find exactly what you're looking for.
              Filter by theme, search by keyword, and discover the wisdom of Kashmiri culture.
            </p>
          </div>
        </SpotlightCard>
      </div>

      {/* --- Join Our Mission --- */}
      <div className="about-section" style={{ marginBlock: '2rem' }}>
        <h2 className={styles.pageTitle}>Support the Movement</h2>
      </div>
      <div className="idioms-grid" style={{ maxWidth: '700px', gridTemplateColumns: '1fr' }}>
        <SpotlightCard className="idiom-card" style={{ height: 'auto' }}>
          <div className="card-content">
            <p className="text-primary">
              This is an open-source initiative built by passion. There are many ways you can help us keep the Kashmiri language alive online:
            </p>
            <ul className="list-disc list-inside text-left text-primary my-4 space-y-2">
              <li>Explore the idioms collection and provide feedback</li>
              <li>Contribute new idioms or verify existing ones</li>
              <li>Share the platform with friends and family</li>
              <li>Support the development costs</li>
            </ul>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <Link href="/" className="btn btn-primary">
                Explore Idioms
              </Link>
              <a href="https://buymeacoffee.com/helpsulaiman" target="_blank" rel="noopener noreferrer" className="btn btn-secondary flex items-center justify-center gap-2 px-6 py-3 rounded-full hover:scale-105 transition-transform">
                <i className="fas fa-coffee"></i> Buy us a coffee
              </a>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </Layout>
  );
};

export default AboutProjectPage;