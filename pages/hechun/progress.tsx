import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Layout from '../../components/Layout';
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
            <div className="main-content">
                {/* Page Header */}
                <div className="page-header">
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

                {/* Stats Section */}
                <div className="container mb-4">
                    <h2 className="text-2xl font-bold mb-4 px-4 text-gray-800">Statistics</h2>
                </div>
                <div className="idioms-grid">
                    {/* Total Stars Card */}
                    <div className="idiom-card flex flex-col items-center justify-center text-center">
                        <div className="text-5xl mb-4">⭐</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">Total Stars</h3>
                        <p className="text-4xl font-bold text-yellow-500">{stats.totalStars}</p>
                    </div>

                    {/* Lessons Completed Card */}
                    <div className="idiom-card flex flex-col items-center justify-center text-center">
                        <div className="text-5xl mb-4">📚</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">Lessons Completed</h3>
                        <p className="text-4xl font-bold text-blue-500">{stats.lessonsCompleted}</p>
                    </div>
                </div>

                {/* Badges Section */}
                <div className="container mt-8 mb-4">
                    <h2 className="text-2xl font-bold mb-4 px-4 text-gray-800">Badges</h2>
                </div>
                <div className="idioms-grid">
                    {/* Placeholder Badges */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="idiom-card flex flex-col items-center justify-center text-center opacity-60 bg-gray-50">
                            <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 flex items-center justify-center text-3xl grayscale">
                                🏆
                            </div>
                            <h3 className="text-lg font-bold text-gray-500 mb-2">Locked Badge</h3>
                            <p className="text-sm text-gray-400">Keep learning to unlock!</p>
                        </div>
                    ))}

                    {/* Actual Badges */}
                    {badges.map((badge) => (
                        <div key={badge.id} className="idiom-card flex flex-col items-center justify-center text-center border-yellow-400 border-2 bg-yellow-50">
                            <div className="w-20 h-20 bg-white rounded-full mb-4 flex items-center justify-center text-3xl shadow-sm">
                                🏅
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{badge.badge.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">{badge.badge.description}</p>
                            <button
                                onClick={() => handleShare(badge.badge.name)}
                                className="btn btn-secondary btn-sm"
                            >
                                Share
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ProgressPage;
