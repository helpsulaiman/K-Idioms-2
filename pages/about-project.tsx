import React from 'react';
import Layout from '../components/Layout';
import Link from "next/link";
import { BookOpen, Archive, Users, Search, Heart, Coffee, ArrowRight } from 'lucide-react';

const AboutProjectPage: React.FC = () => {
  return (
    <Layout title="About the Project - KashWords" fullWidth={true}>
      <div className="min-h-screen">
        {/* Hero Section - Full width gradient */}
        <section className="relative py-24 px-4 overflow-hidden">
          {/* Subtle pattern background - cool blue/slate tones */}

          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-sm font-medium mb-6">
              A Digital Preservation Initiative
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Safeguarding <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">Our Voice</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Building a digital home for the Kashmiri language, one idiom at a time.
            </p>
          </div>
        </section>

        {/* Mission Cards - Offset grid */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {/* Card 1 - Slightly raised - indigo gradient */}
              <div className="md:-mt-8 group">
                <div className="h-full p-8 md:p-10 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Preservation Matters</h2>
                  <p className="text-white/90 text-lg leading-relaxed">
                    Kashmiri is classified as "vulnerable" by UNESCO. In a digital world, languages without online presence risk fading away. We're building modern infrastructure to ensure Kashmiri thrives in the future of technology.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group">
                <div className="h-full p-8 md:p-10 rounded-3xl bg-card border-2 border-indigo-200 dark:border-indigo-800/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30">
                    <Archive className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">KashWords</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Our digital archive of traditional Kashmiri sayings. Preservation starts with documentation—making idioms accessible and searchable empowers a new generation to connect with their roots.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Our Approach</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
              Four pillars that guide our preservation strategy
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: BookOpen, title: 'Organized', desc: 'Comprehensive, searchable database with meanings and context' },
                { icon: Archive, title: 'Archived', desc: 'Digitizing folklore, proverbs, and cultural expressions' },
                { icon: Users, title: 'Community', desc: 'Tools for contribution and collective ownership' },
                { icon: Search, title: 'Accessible', desc: 'Tagged, categorized, and easy to discover' },
              ].map((feature, i) => (
                <div key={i} className="group p-6 rounded-2xl bg-card border border-border hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-lg">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-8 shadow-lg shadow-indigo-500/30">
              <Heart className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6">Support the Movement</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              This is an open-source initiative built by passion. Help us keep the Kashmiri language alive online.
            </p>

            <ul className="text-left max-w-md mx-auto mb-10 space-y-3">
              {[
                'Explore the idioms collection and provide feedback',
                'Contribute new idioms or verify existing ones',
                'Share the platform with friends and family',
                'Support the development costs',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-300"
              >
                Explore Idioms
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://buymeacoffee.com/helpsulaiman"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold border-2 border-border hover:border-indigo-400 dark:hover:border-indigo-600 rounded-full hover:scale-105 transition-all duration-300"
              >
                <Coffee className="w-5 h-5" />
                Buy us a coffee
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AboutProjectPage;