import React from 'react';
import Layout from '../components/Layout';
import Image from "next/image";
import Link from "next/link";
import ThemeImage from '../components/ThemeImage';
import SpotlightCard from '../components/SpotlightCard';
import styles from "@/styles/Alphabet.module.css";

const AboutProjectPage: React.FC = () => {
  return (
    <Layout>
      <div className="logo-container">
        <ThemeImage
          srcLight="https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images/DYDsSpiritLight.png"
          srcDark="https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images/DYDsSpiritDark.png"
          alt="Project Logo"
          width={200}
          height={200}
          style={{ objectFit: "cover" }}
          className="team-logo"
        />
      </div>

      <div className={styles.pageContainer}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>About the Project</h1>
          <p className={styles.pageSubtitle}>
            Preserving Kashmiri Cultural Heritage Through Digital Innovation
          </p>
        </div>
      </div>


      {/* --- Mission & Why It Matters --- */}
      <div className="idioms-grid" style={{ maxWidth: '1000px' }}>
        <SpotlightCard className="idiom-card" style={{ height: 'auto' }}>
          <div className="card-content">
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Our Mission</h2>
            <p className="text-meaning" style={{ fontSize: '1.1rem' }}>
              The Kashmiri Idioms project aims to preserve and digitize the rich collection
              of traditional Kashmiri idioms, ensuring that this invaluable cultural heritage
              is accessible to current and future generations worldwide.
            </p>
          </div>
        </SpotlightCard>
        <SpotlightCard className="idiom-card" style={{ height: 'auto' }}>
          <div className="card-content">
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Why It Matters</h2>
            <p className="text-meaning" style={{ fontSize: '1.1rem' }}>
              Idioms are more than just expressions—they carry the wisdom, values, and
              worldview of a culture. By preserving Kashmiri idioms, we&apos;re safeguarding
              centuries of collective wisdom and cultural identity.
            </p>
          </div>
        </SpotlightCard>
      </div>

      {/* --- What We Offer --- */}
      <div className="about-section" style={{ marginBlock: '2rem' }}>
        <h2 className={styles.pageTitle}>What We Offer</h2>
      </div>
      <div className="idioms-grid">
        <SpotlightCard className="idiom-card" style={{ height: 'auto' }}>
          <div className="card-content">
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>📖 Comprehensive Collection</h3>
            <p className="text-meaning" style={{ fontSize: '1.1rem' }}>
              A growing database of authentic Kashmiri idioms with their meanings,
              translations, and cultural context.
            </p>
          </div>
        </SpotlightCard>
        <SpotlightCard className="idiom-card" style={{ height: 'auto' }}>
          <div className="card-content">
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>🔊 Audio Pronunciations</h3>
            <p className="text-meaning" style={{ fontSize: '1.1rem' }}>
              Native speaker recordings to help preserve the correct pronunciation
              and intonation of each idiom.
            </p>
          </div>
        </SpotlightCard>
        <SpotlightCard className="idiom-card" style={{ height: 'auto' }}>
          <div className="card-content">
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>🔍 Easy Search & Discovery</h3>
            <p className="text-meaning" style={{ fontSize: '1.1rem' }}>
              Advanced search functionality allowing users to find idioms by text,
              meaning, or thematic tags.
            </p>
          </div>
        </SpotlightCard>
        <SpotlightCard className="idiom-card" style={{ height: 'auto' }}>
          <div className="card-content">
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>🤝 Community Contributions</h3>
            <p className="text-meaning" style={{ fontSize: '1.1rem' }}>
              A platform for community members to contribute their knowledge
              and help expand our collection.
            </p>
          </div>
        </SpotlightCard>
      </div>

      {/* --- Our Approach --- */}
      <div className="about-section" style={{ marginBlock: '2rem' }}>
        <h2 className={styles.pageTitle}>Our Approach</h2>
      </div>
      <div className="idioms-grid">
        <SpotlightCard className="idiom-card" style={{ height: 'auto' }}>
          <div className="card-content">
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Digital Preservation</h3>
            <p className="text-meaning" style={{ fontSize: '1.1rem' }}>
              We use modern web technologies to create a sustainable, accessible
              digital archive that can be maintained and expanded over time.
            </p>
          </div>
        </SpotlightCard>
        <SpotlightCard className="idiom-card" style={{ height: 'auto' }}>
          <div className="card-content">
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Cultural Authenticity</h3>
            <p className="text-meaning" style={{ fontSize: '1.1rem' }}>
              Every idiom in our collection is verified by native speakers and
              cultural experts to ensure accuracy and authenticity.
            </p>
          </div>
        </SpotlightCard>
        <SpotlightCard className="idiom-card" style={{ height: 'auto' }}>
          <div className="card-content">
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Open Access</h3>
            <p className="text-meaning" style={{ fontSize: '1.1rem' }}>
              Our platform is freely accessible to anyone interested in learning
              about Kashmiri culture and language.
            </p>
          </div>
        </SpotlightCard>
      </div>

      {/* --- Join Our Mission (Restored) --- */}
      <div className="about-section" style={{ marginBlock: '2rem' }}>
        <h2 className={styles.pageTitle}>Join Our Mission</h2>
      </div>
      <div className="idioms-grid" style={{ maxWidth: '700px', gridTemplateColumns: '1fr' }}>
        <SpotlightCard className="idiom-card" style={{ height: 'auto' }}>
          <div className="card-content">
            <p className="text-primary">
              This project thrives on community participation. Whether you&apos;re a native
              speaker, a cultural enthusiast, or simply someone who appreciates the
              beauty of language, there are many ways to contribute:
            </p>
            <ul className="list-disc list-inside text-left text-primary my-4 space-y-2">
              <li>Submit idioms you know through our contribution form</li>
              <li>Help with translations and cultural context</li>
              <li>Share the project with others who might be interested</li>
              <li>Provide feedback to help us improve the platform</li>
            </ul>
            <Link href="/submit" className="btn btn-primary self-center mt-2">
              Contribute an Idiom
            </Link>
          </div>
        </SpotlightCard>
      </div>
    </Layout>
  );
};

export default AboutProjectPage;