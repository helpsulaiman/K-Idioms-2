
import React, { useState } from 'react';
import Layout from '../components/Layout';
import Image from 'next/image';

const AboutTeam: React.FC = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Sulaiman Shabir",
      role: "Co-Leader",
      description: "Technical lead and main developer of the project. Passionate about preserving Kashmiri culture through technology.",
      image: "https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images//helpsulaiman.jpg",
      socials: {
        linkedin: "https://linkedin.com/in/helpsulaiman",
        instagram: "https://instagram.com/helpsulaiman",
        github: "https://github.com/helpsulaiman"
      }
    },
    {
      id: 2,
      name: "Tehniyah Rayaz",
      role: "Co-Leader",
      description: "Writer, planner, and creative lead. Brings innovative ideas and cultural expertise to the project.",
      image: "https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images//DYDsSpirit.png",
      socials: {
        linkedin: "https://linkedin.com/in/",
        instagram: "https://instagram.com/",
        github: "https://github.com/"
      }
    },
    {
      id: 3,
      name: "Furqan Malik",
      role: "Team Member",
      description: "Contributing to content development and cultural research aspects of the project.",
      image: "https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images//DYDsSpirit.png",
      socials: {
        linkedin: "https://linkedin.com/in/",
        instagram: "https://instagram.com/",
        github: "https://github.com/"
      }
    },
    {
      id: 4,
      name: "Farees Ahmed",
      role: "Team Member",
      description: "Focuses on user experience and content curation for the platform.",
      image: "https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images//DYDsSpirit.png",
      socials: {
        linkedin: "https://linkedin.com/in/",
        instagram: "https://instagram.com/",
        github: "https://github.com/"
      }
    },
    {
      id: 5,
      name: "Anha Nabi",
      role: "Team Member",
      description: "Contributes to content verification and cultural authenticity of the project.",
      image: "https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images//DYDsSpirit.png",
      socials: {
        linkedin: "https://linkedin.com/in/",
        instagram: "https://instagram.com/",
        github: "https://github.com/"
      }
    }
  ];

  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);

  const handleCardClick = (member: typeof teamMembers[0]) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
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
            As part of the DYD initiative, we've combined our diverse skills and shared passion for our cultural heritage to create
            this valuable resource for current and future generations.
          </p>
        </div>

        <h2 className="team-title">Meet Our Team</h2>

        <div className="members-container">
          {teamMembers.map((member) => (
              <div
                  key={member.id}
                  className="member-card"
                  onClick={() => handleCardClick(member)}
              >
                <Image
                    src={member.image}
                    alt={member.name}
                    className="member-image"
                    width={400}
                    height={400}
                />
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <h4>{member.role}</h4>
                  <p>{member.description}</p>
                </div>
              </div>
          ))}
        </div>

        {selectedMember && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={closeModal}>×</button>
                <div className="modal-header">
                  <Image
                      src={selectedMember.image}
                      alt={selectedMember.name}
                      className="modal-image"
                      width={400}
                      height={400}
                  />
                  <h2>{selectedMember.name}</h2>
                  <h3>{selectedMember.role}</h3>
                </div>
                <div className="social-links">
                  {selectedMember.socials?.linkedin && (
                      <a
                          href={selectedMember.socials.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link linkedin"
                      >
                        <i className="fab fa-linkedin"></i>
                        LinkedIn
                      </a>
                  )}
                  {selectedMember.socials?.instagram && (
                      <a
                          href={selectedMember.socials.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link instagram"
                      >
                        <i className="fab fa-instagram"></i>
                        Instagram
                      </a>
                  )}
                  {selectedMember.socials?.github && (
                      <a
                          href={selectedMember.socials.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-link github"
                      >
                        <i className="fab fa-github"></i>
                        GitHub
                      </a>
                  )}
                </div>
              </div>
            </div>
        )}
      </Layout>
  );
};

export default AboutTeam;