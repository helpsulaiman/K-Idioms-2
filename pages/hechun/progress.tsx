import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Layout from '../../components/Layout';
import MagicBento from '../../components/MagicBento';
import TiltedCard from '../../components/TiltedCard';
import { fetchUserBadges, fetchUserStats } from '../../lib/learning-api';

const ProgressPage: React.FC = () => {
    const user = useUser();
    const supabase = useSupabaseClient();
    const [stats, setStats] = useState({ totalStars: 0, lessonsCompleted: 0 });
    const [badges, setBadges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                if (user) {
                    const userBadges = await fetchUserBadges(supabase, user.id);
                    setBadges(userBadges);

                    const userStats = await fetchUserStats(supabase, user.id);
                    if (userStats) {
                        setStats({
                            totalStars: userStats.total_stars,
                            lessonsCompleted: userStats.lessons_completed
                        });
                    }
                } else {
                    // Guest mode
                    const localProgress = JSON.parse(localStorage.getItem('hechun_guest_progress') || '{}');
                    const totalStars = Object.values(localProgress).reduce((sum: number, s: any) => sum + (Number(s) || 0), 0);
                    const lessonsCompleted = Object.keys(localProgress).length;
                    setStats({ totalStars, lessonsCompleted });
                    setBadges([]);
                }
            } catch (error) {
                console.error('Failed to load progress:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [user]);



    // Prepare data for MagicBento (Stats)
    const bentoCards = [
        {
            color: '#1e293b', // Dark slate
            title: stats.totalStars.toString(),
            description: 'Total Stars Earned',
            label: 'Stars ⭐'
        },
        {
            color: '#0f172a', // Slate 900
            title: stats.lessonsCompleted.toString(),
            description: 'Lessons Completed',
            label: 'Lessons 📚'
        },
        {
            color: '#312e81', // Indigo 900
            title: 'Keep Going!',
            description: 'Consistency is key to learning.',
            label: 'Motivation 🚀'
        },
        {
            color: '#4c1d95', // Violet 900
            title: 'Kashmiri',
            description: 'Language of the Valley',
            label: 'Focus 🧠'
        },
        {
            color: '#060010',
            title: 'Streak',
            description: 'Day 1',
            label: 'Consistency 🔥'
        },
        {
            color: '#060010',
            title: 'Rank',
            description: 'Novice',
            label: 'Status 🔰'
        }
    ];

    return (
        <Layout title="My Progress - Hečhun">
            <div className="main-content">
                {/* Page Header */}
                <div className="page-header mb-8">
                    <h1 className="page-title">My Progress</h1>
                    <p className="page-subtitle">
                        Track your journey in learning the Kashmiri language.
                    </p>
                </div>

                {!user && (
                    <div className="container mb-8">
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
                            <div className="flex justify-between items-center flex-wrap gap-4">
                                <div>
                                    <p className="font-bold text-blue-700">Playing as Guest</p>
                                    <p className="text-sm text-blue-600">Login to save your progress permanently.</p>
                                </div>
                                <Link href="/auth/login" className="btn btn-primary btn-sm">
                                    Login
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Section with MagicBento */}
                <div className="container mb-12">
                    <h2 className="text-2xl font-bold mb-6 px-4 text-gray-800">Statistics</h2>
                    <div className="flex justify-center">
                        <MagicBento
                            cards={bentoCards}
                            textAutoHide={false}
                            enableStars={true}
                            enableSpotlight={true}
                            enableBorderGlow={true}
                            enableTilt={true}
                            enableMagnetism={true}
                            clickEffect={true}
                            spotlightRadius={300}
                            particleCount={12}
                            glowColor="132, 0, 255"
                        />
                    </div>
                </div>

                {/* Badges Section with TiltedCard */}
                <div className="container mb-12">
                    <h2 className="text-2xl font-bold mb-8 px-4 text-gray-800">My Badges Collection</h2>

                    {badges.length === 0 ? (
                        <div className="text-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            <p className="text-xl text-gray-500">No badges yet. Complete lessons to earn them!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                            {badges.map((badge) => (
                                <div key={badge.id} className="relative">
                                    <TiltedCard
                                        imageSrc={badge.badge.icon_url || '/images/badge-placeholder.png'}
                                        altText={badge.badge.name}
                                        captionText={badge.badge.name}
                                        containerHeight="250px"
                                        containerWidth="250px"
                                        imageHeight="250px"
                                        imageWidth="250px"
                                        rotateAmplitude={12}
                                        scaleOnHover={1.1}
                                        showMobileWarning={false}
                                        showTooltip={true}
                                        displayOverlayContent={true}
                                        overlayContent={
                                            <div className="bg-black/50 p-2 rounded-b-xl w-full absolute bottom-0 text-white backdrop-blur-sm text-center">
                                                <p className="font-bold text-sm">{badge.badge.name}</p>
                                            </div>
                                        }
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = badge.badge.icon_url || '/images/badge-placeholder.png';
                                            link.download = `${badge.badge.name.replace(/\s+/g, '_')}_badge.png`;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ProgressPage;
