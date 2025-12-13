import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useUser, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { fetchUserBadges, fetchUserStats, updateUserProfile } from '../lib/learning-api';
import Layout from '../components/Layout'; // Re-using Layout for basic structure/head

const ProfilePage: React.FC = () => {
    const { isLoading } = useSessionContext();
    const user = useUser();
    const supabase = useSupabaseClient();
    const router = useRouter();

    // Profile State
    const [username, setUsername] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Progress State
    const [stats, setStats] = useState({ totalStars: 0, lessonsCompleted: 0 });
    const [badges, setBadges] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            loadProfile();
            loadProgress();
        } else if (!isLoading) {
            loadGuestProgress();
        }
    }, [user, isLoading]);

    const loadProfile = async () => {
        if (!user) return;
        try {
            const userStats = await fetchUserStats(supabase, user.id);
            setUsername(userStats?.username || user.user_metadata?.full_name || user.email?.split('@')[0] || '');
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const loadProgress = async () => {
        if (!user) return;
        try {
            const [userBadges, userStats] = await Promise.all([
                fetchUserBadges(supabase, user.id),
                fetchUserStats(supabase, user.id)
            ]);

            setBadges(userBadges || []);
            if (userStats) {
                setStats({
                    totalStars: userStats.total_stars,
                    lessonsCompleted: userStats.lessons_completed
                });
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    };

    const loadGuestProgress = () => {
        try {
            const localProgress = JSON.parse(localStorage.getItem('hechun_guest_progress') || '{}');
            const totalStars = Object.values(localProgress).reduce((sum: number, s: any) => sum + (Number(s) || 0), 0);
            const lessonsCompleted = Object.keys(localProgress).length;
            setStats({ totalStars, lessonsCompleted });
            setBadges([]);
        } catch (e) {
            console.error("Error loading guest progress", e);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);
        setMessage(null);
        try {
            await updateUserProfile(supabase, user.id, username);
            setMessage({ type: 'success', text: 'Profile updated!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update' });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (isLoading) {
        return <div className="p-10 text-center">Loading...</div>;
    }

    return (
        <Layout title="Your Profile">
            <div className="container mt-12 space-y-12">

                {/* Header Section */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-[var(--border-color)] pb-6">
                    <div></div> {/* Spacer for centering */}
                    <h1 className="page-title !m-0 !p-0 text-center">Dashboard</h1>
                    <div className="flex justify-end">
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="btn btn-secondary btn-sm"
                            >
                                Sign Out
                            </button>
                        ) : (
                            <Link href="/auth/login" className="btn btn-primary">
                                Log In
                            </Link>
                        )}
                    </div>
                </div>

                {/* Profile Settings */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">Profile Settings</h2>
                    {user ? (
                        <div className="form-container !m-0 !max-w-none">
                            {message && (
                                <div className={`p-3 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {message.text}
                                </div>
                            )}
                            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-md">
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Display Name</label>
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        className="search-input"
                                        placeholder="Enter username"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="btn btn-primary"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="dashboard-card text-center py-8">
                            <p className="text-[var(--text-secondary)]">Log in to edit your profile.</p>
                        </div>
                    )}
                </section>

                {/* Statistics */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">Your Progress</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="dashboard-card items-center text-center py-8">
                            <span className="block text-5xl font-bold text-[var(--color-primary)] mb-2">{stats.totalStars}</span>
                            <span className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Total Stars</span>
                        </div>
                        <div className="dashboard-card items-center text-center py-8">
                            <span className="block text-5xl font-bold text-purple-600 mb-2">{stats.lessonsCompleted}</span>
                            <span className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">Lessons Completed</span>
                        </div>
                    </div>
                </section>

                {/* Badges */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">Badges</h2>
                    {badges.length === 0 ? (
                        <div className="dashboard-card text-center py-10">
                            <p className="text-[var(--text-secondary)] italic">No badges earned yet. Complete lessons to earn them!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {badges.map((b: any) => (
                                <div key={b.id} className="idiom-card flex flex-col items-center text-center">
                                    <img
                                        src={b.badge.icon_url || '/placeholder.png'}
                                        alt={b.badge.name}
                                        className="w-20 h-20 mb-4 object-contain"
                                    />
                                    <span className="font-semibold text-[var(--text-primary)]">{b.badge.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <div className="pt-8 border-t border-[var(--border-color)]">
                    <Link href="/" className="btn btn-secondary btn-sm">
                        &larr; Back to Home
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;
