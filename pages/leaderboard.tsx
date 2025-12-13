import React, { useEffect, useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Layout from '../components/Layout';
import { fetchLeaderboard } from '../lib/learning-api';
import { UserStats } from '../types/learning';

const LeaderboardPage: React.FC = () => {
    const supabase = useSupabaseClient();
    const [users, setUsers] = useState<UserStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<'daily' | 'weekly' | 'all_time'>('all_time');

    useEffect(() => {
        const loadLeaderboard = async () => {
            setLoading(true);
            try {
                const data = await fetchLeaderboard(supabase, period);
                setUsers(data);
            } catch (error) {
                console.error('Failed to load leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        loadLeaderboard();
    }, [period]);

    return (
        <Layout title="Leaderboard - Hechun">
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold mb-4">🏆 Leaderboard</h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        See who&apos;s mastering Kashmiri the fastest!
                    </p>
                </div>

                {/* Period Selector */}
                <div className="flex justify-center gap-2 mb-8">
                    {(['daily', 'weekly', 'all_time'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${period === p
                                ? 'bg-chinar-orange text-white shadow-md'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                }`}
                        >
                            {p.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-20">Loading rankings...</div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        {users.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No data yet. Be the first to complete a lesson!
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Lessons</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Stars</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {users.map((user, index) => (
                                        <tr key={user.user_id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className={`
                          w-8 h-8 flex items-center justify-center rounded-full font-bold
                          ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                                        index === 1 ? 'bg-gray-100 text-gray-700' :
                                                            index === 2 ? 'bg-orange-100 text-orange-700' : 'text-gray-500'}
                        `}>
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {user.username || `User ${user.user_id.slice(0, 8)}...`}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-gray-500">
                                                {user.lessons_completed}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-yellow-600 dark:text-yellow-400">
                                                {user.total_stars} ★
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default LeaderboardPage;
