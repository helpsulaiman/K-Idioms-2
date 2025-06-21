import React from 'react';
import Layout from '../components/Layout';

const AboutUsPage: React.FC = () => {
  const teamMembers = [
    {
      name: "Your Name",
      role: "Project Lead & Developer",
      description: "Passionate about preserving Kashmiri culture through technology.",
      image: "/team/member1.jpg" // You'll need to add actual images
    },
    // Add more team members as needed
  ];

  const contributors = [
    "Community elders who shared their knowledge",
    "Native speakers who provided pronunciations",
    "Cultural experts who verified authenticity",
    "Beta testers who helped improve the platform",
    "Everyone who submitted idioms and feedback"
  ];

  return (
    <Layout 
      title="About Us - Kashmiri Idioms"
      description="Meet the team behind the Kashmiri Idioms project and learn about our contributors."
    >
      <div className="container section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About Us</h1>
            <p className="text-xl text-secondary">
              The people behind the Kashmiri Idioms project
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="card text-center">
                  <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                    {/* Placeholder for profile image */}
                    <svg className="w-12 h-12 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary text-sm mb-2">{member.role}</p>
                  <p className="text-secondary text-sm">{member.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card mb-8">
            <h2 className="card-title">Our Story</h2>
            <div className="space-y-4 text-secondary">
              <p>
                The Kashmiri Idioms project was born out of a deep concern for the preservation 
                of our cultural heritage. As globalization continues to influence local cultures, 
                many traditional expressions and idioms risk being forgotten.
              </p>
              <p>
                We recognized that Kashmiri idioms, with their rich metaphors and cultural 
                insights, needed to be preserved not just in memory, but in a format that 
                could be easily accessed, shared, and passed down to future generations.
              </p>
              <p>
                What started as a small personal project has grown into a community-driven 
                initiative, thanks to the support and contributions of many individuals who 
                share our passion for preserving Kashmiri culture.
              </p>
            </div>
          </div>

          <div className="card mb-8">
            <h2 className="card-title">Acknowledgments</h2>
            <p className="text-secondary mb-4">
              This project would not have been possible without the generous contributions 
              and support from many individuals and organizations:
            </p>
            <ul className="list-disc list-inside text-secondary space-y-2">
              {contributors.map((contributor, index) => (
                <li key={index}>{contributor}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2 className="card-title">Get in Touch</h2>
            <p className="text-secondary mb-4">
              We're always looking to connect with people who share our passion for 
              preserving cultural heritage. Whether you have questions, suggestions, 
              or want to contribute to the project, we'd love to hear from you.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/submit" className="btn btn-primary">
                Contribute an Idiom
              </a>
              <a href="mailto:contact@kashmiiriidioms.com" className="btn btn-outline">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUsPage;