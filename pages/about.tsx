import React from 'react';
import Layout from '../components/Layout';
import ChromaGrid, { ChromaGridItem } from '../components/ChromaGrid';
import ThemeImage from '../components/ThemeImage';
import SpotlightCard from '../components/SpotlightCard';
import styles from '../styles/learn.module.css';

const teamMembers: ChromaGridItem[] = [
    {
        image: "https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images/helpsulaiman.png",
        title: "Sulaiman Shabir",
        subtitle: "Co-Leader & Developer",
        handle: "@helpsulaiman",
        borderColor: '#4F46E5', // Indigo
        gradient: 'linear-gradient(145deg, #4F46E5, #000)',
        url: "https://instagram.com/helpsulaiman.jpg"
    },
    {
        image: "https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images/tehniyah.jpg",
        title: "Tehniyah Rayaz",
        subtitle: "Co-Leader & Creative Lead",
        handle: "-",
        borderColor: '#EC4899', // Pink
        gradient: 'linear-gradient(145deg, #EC4899, #000)',
        url: "https://linkedin.com/in/tehniyahrayaz"
    },
    {
        image: "https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images/furqan.jpg",
        title: "Furqan Malik",
        subtitle: "Content & Research",
        handle: "@ffurqann18",
        borderColor: '#10B981', // Emerald
        gradient: 'linear-gradient(145deg, #10B981, #000)',
        url: "https://instagram.com/ffurqann18"
    },
    {
        image: "https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images/Farees2.jpg",
        title: "Farees Ahmed",
        subtitle: "UX & Content Curation",
        handle: "@ahangerfarees",
        borderColor: '#F59E0B', // Amber
        gradient: 'linear-gradient(145deg, #F59E0B, #000)',
        url: "https://instagram.com/ahangerfarees"
    },
    {
        image: "https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images/DYDsSpiritDark.png",
        title: "Anha Nabi",
        subtitle: "Content Verification",
        handle: "-",
        borderColor: '#8B5CF6', // Violet
        gradient: 'linear-gradient(145deg, #8B5CF6, #000)',
        url: ""
    }
];

const AboutPage: React.FC = () => {
    return (
        <Layout title="About Us - Hečhun">
            <div className={styles.learnContainer}>
                <div className="text-center pt-10 pb-4 px-4 max-w-4xl mx-auto">
                    <div className={styles.teamLogoContainer}>
                        <ThemeImage
                            srcLight="https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images/DYDsSpiritLight.png"
                            srcDark="https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images/DYDsSpiritDark.png"
                            alt="Team Logo"
                            width={320}
                            height={320}
                            className={styles.teamLogo}
                        />
                    </div>
                    <h1 className={styles.pagetitle}>About Us</h1>
                    <p className={styles.pagesubtitle} style={{ maxWidth: '800px', margin: '0 auto' }}>
                        We are a group of passionate students from the <strong>University of Kashmir</strong>, part of the innovative <strong>Design Your Degree (DYD)</strong> program.
                        Beyond digitally preserving Kashmiri idioms, we have built <strong>Hečhun</strong>—an interactive learning platform designed to teach the language to a new generation, ensuring our rich linguistic heritage thrives.
                    </p>
                </div>

                <div className="w-full py-8">
                    <ChromaGrid
                        items={teamMembers}
                        columns={3}
                        radius={300}
                    />
                </div>

                {/* Contact Section */}
                <div className="w-full max-w-4xl mx-auto px-4 pb-16">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">Contact Us</h2>
                    </div>
                    <SpotlightCard className="w-full" style={{ height: 'auto', background: 'var(--card)' }}>
                        <div className="flex flex-col items-center justify-center p-8 gap-6">
                            <p className="text-secondary-foreground text-center text-lg max-w-2xl">
                                Have questions, suggestions, or just want to say hello? We&apos;d love to hear from you.
                            </p>
                            <div className="flex justify-center gap-4 flex-wrap">
                                <a href="mailto:dydspirit@gmail.com" className="btn btn-secondary flex items-center gap-2 px-6 py-3 rounded-full hover:scale-105 transition-transform">
                                    <i className="fas fa-envelope"></i> Email Us
                                </a>
                                <a href="https://instagram.com/helpsulaiman.clicks" target="_blank" rel="noopener noreferrer" className="btn btn-secondary flex items-center gap-2 px-6 py-3 rounded-full hover:scale-105 transition-transform">
                                    <i className="fab fa-instagram"></i> Instagram
                                </a>
                            </div>
                        </div>
                    </SpotlightCard>
                </div>
            </div>
        </Layout>
    );
};

export default AboutPage;
