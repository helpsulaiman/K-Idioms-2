import React from 'react';
import Layout from '../components/Layout';
import ChromaGrid, { ChromaGridItem } from '../components/ChromaGrid';
import ThemeImage from '../components/ThemeImage';
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
        image: "https://hdbmcwmgolmxmtllaclx.supabase.co/storage/v1/object/public/images/DYDsSpiritLight.png",
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
                            width={240} // 15rem approx
                            height={240}
                            className={styles.teamLogo}
                        />
                    </div>
                    <h1 className={styles.pagetitle}>About Us</h1>
                    <p className={styles.pagesubtitle}>
                        We are a dedicated team of students from Kashmir University participating in the DYD (Design Your Degree) programme.
                        Our project focuses on preserving and promoting Kashmiri culture through a digital platform dedicated to Kashmiri idioms.
                    </p>
                </div>

                <div className="w-full py-8">
                    <ChromaGrid
                        items={teamMembers}
                        columns={3}
                        radius={300}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default AboutPage;
