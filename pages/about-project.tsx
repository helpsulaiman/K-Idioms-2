import React from 'react';
import Layout from '../components/Layout';

const AboutProjectPage: React.FC = () => {
  return (
    <Layout 
      title="About the Project - Kashmiri Idioms"
      description="Learn about our mission to preserve and digitize traditional Kashmiri idioms for future generations."
    >
      <div className="container section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About the Project</h1>
            <p className="text-xl text-secondary">
              Preserving Kashmiri Cultural Heritage Through Digital Innovation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="card">
              <h2 className="card-title">Our Mission</h2>
              <p className="text-secondary">
                The Kashmiri Idioms project aims to preserve and digitize the rich collection 
                of traditional Kashmiri idioms, ensuring that this invaluable cultural heritage 
                is accessible to current and future generations worldwide.
              </p>
            </div>

            <div className="card">
              <h2 className="card-title">Why It Matters</h2>
              <p className="text-secondary">
                Idioms are more than just expressions—they carry the wisdom, values, and 
                worldview of a culture. By preserving Kashmiri idioms, we're safeguarding 
                centuries of collective wisdom and cultural identity.
              </p>
            </div>
          </div>

          <div className="card mb-8">
            <h2 className="card-title">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">📚</span>
                  Comprehensive Collection
                </h3>
                <p className="text-secondary text-sm">
                  A growing database of authentic Kashmiri idioms with their meanings, 
                  translations, and cultural context.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">🔊</span>
                  Audio Pronunciations
                </h3>
                <p className="text-secondary text-sm">
                  Native speaker recordings to help preserve the correct pronunciation 
                  and intonation of each idiom.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">🔍</span>
                  Easy Search & Discovery
                </h3>
                <p className="text-secondary text-sm">
                  Advanced search functionality allowing users to find idioms by text, 
                  meaning, or thematic tags.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-primary">🤝</span>
                  Community Contributions
                </h3>
                <p className="text-secondary text-sm">
                  A platform for community members to contribute their knowledge 
                  and help expand our collection.
                </p>
              </div>
            </div>
          </div>

          <div className="card mb-8">
            <h2 className="card-title">Our Approach</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Digital Preservation</h3>
                <p className="text-secondary">
                  We use modern web technologies to create a sustainable, accessible 
                  digital archive that can be maintained and expanded over time.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Cultural Authenticity</h3>
                <p className="text-secondary">
                  Every idiom in our collection is verified by native speakers and 
                  cultural experts to ensure accuracy and authenticity.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Open Access</h3>
                <p className="text-secondary">
                  Our platform is freely accessible to anyone interested in learning 
                  about Kashmiri culture and language.
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Join Our Mission</h2>
            <p className="text-secondary mb-4">
              This project thrives on community participation. Whether you're a native 
              speaker, a cultural enthusiast, or simply someone who appreciates the 
              beauty of language, there are many ways to contribute:
            </p>
            <ul className="list-disc list-inside text-secondary space-y-2">
              <li>Submit idioms you know through our contribution form</li>
              <li>Help with translations and cultural context</li>
              <li>Share the project with others who might be interested</li>
              <li>Provide feedback to help us improve the platform</li>
            </ul>
            <div className="mt-6">
              <a href="/submit" className="btn btn-primary">
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