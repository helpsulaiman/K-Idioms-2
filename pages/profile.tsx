import React, { useState, useEffect } from 'react';
import { useUser, useSupabaseClient, useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Link from 'next/link';
import styles from '../styles/learn.module.css';
import { fetchUserStats, updateUserProfile } from '../lib/learning-api';

const ProfilePage: React.FC = () => {
    const { isLoading, session } = useSessionContext();
    const user = useUser();
    const supabase = useSupabaseClient();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (user) {
            loadProfile();
        }
    }, [user]);

    const loadProfile = async () => {
        if (!user) return;
        try {
            const stats = await fetchUserStats(user.id);
            if (stats?.username) {
                setUsername(stats.username);
            } else {
                // Fallback to metadata or email prefix
                setUsername(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        setMessage(null);

        try {
            await updateUserProfile(user.id, username);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (isLoading) {
        return (
            <Layout title="Profile - Hečhun">
                <div className={styles.learnContainer}>
                    <div className="text-center py-20">Loading...</div>
                </div>
            </Layout>
        );
    }

    if (!user) {
        return (
            <Layout title="Profile - Hečhun">
                <div className={styles.learnContainer}>
                    <div className="text-center py-20">
                        <p className="text-xl mb-4">You are not logged in.</p>
                        <Link href="/auth/login" className="btn btn-primary">
                            Login
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Profile - Hečhun">
            <div className={styles.learnContainer}>
                <div className="max-w-2xl mx-auto w-full p-4 pt-12">
                    <div className={`${styles.lessonCard} p-8`}>
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl border-4 border-white shadow-lg">
                                👤
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                            <p className="text-gray-500 mt-1">{user.email}</p>
                        </div>

                        {message && (
                            <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleUpdateProfile} className="mb-8">
                            <div className="form-group mb-4">
                                <label className="block text-gray-700 font-bold mb-2">Username (Display Name)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        placeholder="Enter your username"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        {saving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">This name will appear on the leaderboard.</p>
                            </div>
                        </form>

                        <div className="space-y-4 border-t pt-6">
                            <Link href="/hechun/progress" className="block w-full text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition border border-blue-200 group">
                                <span className="text-2xl block mb-1 group-hover:scale-110 transition-transform">📊</span>
                                <span className="font-bold text-blue-700">View My Progress</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="w-full p-4 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition border border-red-200 font-bold"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProfilePage;
