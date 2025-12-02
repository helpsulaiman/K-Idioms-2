import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useUser } from '@supabase/auth-helpers-react';
import Layout from '../../components/Layout';
import styles from '../../styles/learn.module.css';
import { fetchUserBadges } from '../../lib/learning-api';

const ProgressPage: React.FC = () => {
    const user = useUser();
    const [stats, setStats] = useState({ totalStars: 0, lessonsCompleted: 0 });
    const [badges, setBadges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                if (user) {
                    // Fetch from DB if logged in
                    // We need a fetchUserStats function, but for now let's just use what we have or mock it
                    // Actually, let's just calculate from badges or add a stats fetcher later.
                    // For now, let's focus on badges.
                    const userBadges = await fetchUserBadges(user.id);
                    setBadges(userBadges);

                    // Mock stats for now or fetch if we had an API
                    // We can fetch stats from user_stats table if we add an API for it
                } else {
                    // Guest mode
                    const localProgress = JSON.parse(localStorage.getItem('hechun_guest_progress') || '{}');
                    const totalStars = Object.values(localProgress).reduce((sum: number, s: any) => sum + (Number(s) || 0), 0);
                    const lessonsCompleted = Object.keys(localProgress).length;
                    setStats({ totalStars, lessonsCompleted });

                    // Guest badges? Maybe just show placeholders or calculate locally
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

    const handleShare = (badgeName: string) => {
        if (navigator.share) {
            navigator.share({
                title: 'Earned a Badge!',
                text: `I just earned the ${badgeName} badge on Hečhun!`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            alert('Sharing is not supported on this browser, but you can take a screenshot!');
        }
    };

    return (
        <Layout title="My Progress - Hečhun">
            <div className={styles.learnContainer}>
                <div className="max-w-4xl mx-auto w-full p-4">
                    <h1 className={styles.pagetitle}>My Progress</h1>

                    {!user && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-blue-700">Playing as Guest</p>
                                    <p className="text-sm text-blue-600">Login to save your progress permanently and compete on the leaderboard.</p>
                                </div>
                                <Link href="/auth/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                                    Login
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className={`${styles.lessonCard} flex flex-col items-center justify-center p-8`}>
                            <span className="text-6xl mb-4">⭐</span>
                            <h2 className="text-2xl font-bold text-gray-700">Total Stars</h2>
                            <p className="text-4xl font-bold text-yellow-500 mt-2">{stats.totalStars}</p>
                        </div>
                        <div className={`${styles.lessonCard} flex flex-col items-center justify-center p-8`}>
                            <span className="text-6xl mb-4">📚</span>
                            <h2 className="text-2xl font-bold text-gray-700">Lessons Completed</h2>
                            <p className="text-4xl font-bold text-blue-500 mt-2">{stats.lessonsCompleted}</p>
                        </div>
                    </div>

                    {/* Badges Section */}
                    <h2 className="text-2xl font-bold mb-6 text-center">Badges</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {/* Placeholder Badges */}
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`${styles.lessonCard} flex flex-col items-center p-6 opacity-50`}>
                                <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-4xl">
                                    🏆
                                </div>
                                <h3 className="font-bold text-gray-500">Locked Badge</h3>
                                <p className="text-sm text-gray-400 text-center mt-2">Keep learning to unlock!</p>
                            </div>
                        ))}

                        {/* Render actual badges if any */}
                        {badges.map((badge) => (
                            <div key={badge.id} className={`${styles.lessonCard} flex flex-col items-center p-6 border-yellow-400 border-2`}>
                                <div className="w-24 h-24 bg-yellow-100 rounded-full mb-4 flex items-center justify-center text-4xl">
                                    🏅
                                </div>
                                <h3 className="font-bold text-gray-800">{badge.badge.name}</h3>
                                <p className="text-sm text-gray-600 text-center mt-2">{badge.badge.description}</p>
                                <button
                                    onClick={() => handleShare(badge.badge.name)}
                                    className="mt-4 text-sm text-blue-500 font-bold hover:underline"
                                >
                                    Share
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProgressPage;
