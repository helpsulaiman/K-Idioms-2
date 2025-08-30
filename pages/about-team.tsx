import React, { useState } from 'react';
import Layout from '../components/Layout';
import Image from 'next/image';

const AboutTeam: React.FC = () => {
  // --- UPDATED: More robust data structure ---
  const teamMembers = [
    {
      id: 'sulaiman-shabir',
      name: "Sulaiman Shabir",
      role: "Co-Leader & Developer",
      bio: "Technical lead and main developer of the project. Passionate about preserving Kashmiri culture through technology.",
      avatar: "https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images//helpsulaiman.jpg",
      socials: [
        { type: 'linkedin', url: 'https://linkedin.com/in/helpsulaiman' },
        { type: 'instagram', url: 'https://instagram.com/helpsulaiman' },
        { type: 'github', url: 'https://github.com/helpsulaiman' },
      ],
    },
    {
      id: 'tehniyah-rayaz',
      name: "Tehniyah Rayaz",
      role: "Co-Leader & Creative Lead",
      bio: "Writer, planner, and creative lead. Brings innovative ideas and cultural expertise to the project.",
      avatar: "https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images//DYDsSpirit.png",
      socials: [
        { type: 'linkedin', url: 'https://linkedin.com/in/' },
        { type: 'instagram', url: 'https://instagram.com/' },
      ],
    },
    {
      id: 'furqan-malik',
      name: "Furqan Malik",
      role: "Content & Research",
      bio: "Contributing to content development and cultural research aspects of the project.",
      avatar: "https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images//DYDsSpirit.png",
      socials: [],
    },
    {
      id: 'farees-ahmed',
      name: "Farees Ahmed",
      role: "UX & Content Curation",
      bio: "Focuses on user experience and content curation for the platform.",
      avatar: "https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images//DYDsSpirit.png",
      socials: [],
    },
    {
      id: 'anha-nabi',
      name: "Anha Nabi",
      role: "Content Verification",
      bio: "Contributes to content verification and cultural authenticity of the project.",
      avatar: "https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images//DYDsSpirit.png",
      socials: [],
    }
  ];

  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleCardClick = (memberId: string) => {
    setExpandedCard(prev => (prev === memberId ? null : memberId));
  };

  return (
      <Layout
          title="About Us - Kashmiri Idioms"
          description="Meet the team behind the Kashmiri Idioms project and learn about our contributors."
      >
        <div className="logo-container">
          <Image
              src="https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images//DYDsSpirit.png"
              alt="Team Logo"
              className="team-logo"
              width={800}
              height={800}
          />
        </div>

        <div className="about-section">
          <h1 className="main-title">About Us</h1>
          <p className="about-text">
            We are a dedicated team of students from Kashmir University participating in the DYD (Design Your Degree) programme.
            Our project focuses on preserving and promoting Kashmiri culture through a digital platform dedicated to Kashmiri idioms.
            As part of the DYD initiative, we&apos;ve combined our diverse skills and shared passion for our cultural heritage to create
            this valuable resource for current and future generations.
          </p>
        </div>

        <h2 className="team-title">Meet Our Team</h2>

        <div className="members-container">
          {teamMembers.map((member) => (
              <div
                  key={member.id}
                  className={`member-card ${expandedCard === member.id ? 'expanded' : ''}`}
                  onClick={() => handleCardClick(member.id)}
              >
                <Image
                    src={member.avatar}
                    alt={member.name}
                    className="member-image"
                    width={400}
                    height={400}
                />
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <h4>{member.role}</h4>
                  <p>{member.bio}</p>
                </div>

                <div className="expandable-content">
                  <div className="social-links-container">
                    {member.socials.map((social) => (
                        <a
                            key={social.type}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`social-link ${social.type}`}
                        >
                          <i className={`fab fa-${social.type}`}></i>
                          {social.type.charAt(0).toUpperCase() + social.type.slice(1)}
                        </a>
                    ))}
                  </div>
                </div>
              </div>
          ))}
        </div>
      </Layout>
  );
};

export default AboutTeam;