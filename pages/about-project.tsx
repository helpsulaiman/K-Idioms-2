import React from 'react';
import Layout from '../components/Layout';
import Image from "next/image";

const AboutProjectPage: React.FC = () => {
  return (
    <Layout
      title="About the Project - Kashmiri Idioms"
      description="Learn about our mission to preserve and digitize traditional Kashmiri idioms for future generations."
    >
      <div className="logo-container">
        <Image
          src="https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images//DYDsSpirit.png"
          alt="Project Logo"
          width={200}
          height={200}
          className="team-logo"
        />
      </div>

      <div className="about-section">
        <h1 className="main-title">About the Project</h1>
        <p className="about-text">
          Preserving Kashmiri Cultural Heritage Through Digital Innovation
        </p>
      </div>

      <div className="members-container">
        <div className="member-card">
          <div className="member-info">
            <h2>Our Mission</h2>
            <p>
              The Kashmiri Idioms project aims to preserve and digitize the rich collection
              of traditional Kashmiri idioms, ensuring that this invaluable cultural heritage
              is accessible to current and future generations worldwide.
            </p>
          </div>
        </div>

        <div className="member-card">
          <div className="member-info">
            <h2>Why It Matters</h2>
            <p>
              Idioms are more than just expressions—they carry the wisdom, values, and
              worldview of a culture. By preserving Kashmiri idioms, we're safeguarding
              centuries of collective wisdom and cultural identity.
            </p>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2 className="team-title">What We Offer</h2>
        <div className="members-container">
          <div className="member-card">
            <div className="member-info">
              <h3>📚 Comprehensive Collection</h3>
              <p>
                A growing database of authentic Kashmiri idioms with their meanings,
                translations, and cultural context.
              </p>
            </div>
          </div>

          <div className="member-card">
            <div className="member-info">
              <h3>🔊 Audio Pronunciations</h3>
              <p>
                Native speaker recordings to help preserve the correct pronunciation
                and intonation of each idiom.
              </p>
            </div>
          </div>

          <div className="member-card">
            <div className="member-info">
              <h3>🔍 Easy Search & Discovery</h3>
              <p>
                Advanced search functionality allowing users to find idioms by text,
                meaning, or thematic tags.
              </p>
            </div>
          </div>

          <div className="member-card">
            <div className="member-info">
              <h3>🤝 Community Contributions</h3>
              <p>
                A platform for community members to contribute their knowledge
                and help expand our collection.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2 className="team-title">Our Approach</h2>
        <div className="members-container">
          <div className="member-card">
            <div className="member-info">
              <h3>Digital Preservation</h3>
              <p>
                We use modern web technologies to create a sustainable, accessible
                digital archive that can be maintained and expanded over time.
              </p>
            </div>
          </div>

          <div className="member-card">
            <div className="member-info">
              <h3>Cultural Authenticity</h3>
              <p>
                Every idiom in our collection is verified by native speakers and
                cultural experts to ensure accuracy and authenticity.
              </p>
            </div>
          </div>

          <div className="member-card">
            <div className="member-info">
              <h3>Open Access</h3>
              <p>
                Our platform is freely accessible to anyone interested in learning
                about Kashmiri culture and language.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2 className="team-title">Join Our Mission</h2>
        <div className="member-card">
          <div className="member-info">
            <p>
              This project thrives on community participation. Whether you're a native
              speaker, a cultural enthusiast, or simply someone who appreciates the
              beauty of language, there are many ways to contribute:
            </p>
            <ul className="social-links">
              <li className="social-link">Submit idioms you know through our contribution form</li>
              <li className="social-link">Help with translations and cultural context</li>
              <li className="social-link">Share the project with others who might be interested</li>
              <li className="social-link">Provide feedback to help us improve the platform</li>
            </ul>
            <div className="modal-header">
              <a href="/submit" className="social-link github">
                Contribute an Idiom
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutProjectPage;