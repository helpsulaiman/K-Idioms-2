import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { fetchLevelsWithLessons } from '../../lib/learning-api';
import { LearningLevel } from '../../types/learning';
import styles from '../../styles/learn.module.css';

import ScrollingBanner from '../../components/ui/ScrollingBanner';

const HechunPage: React.FC = () => {
    const user = useUser();
    const supabase = useSupabaseClient();
    const [levels, setLevels] = useState<LearningLevel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchLevelsWithLessons(supabase, user?.id);
                setLevels(data);
            } catch (error) {
                console.error('Failed to load learning path:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [user]);

    return (
        <Layout title="Hechun - Learn Kashmiri">
            <ScrollingBanner text="WORK IN PROGRESS • HEČHUN • WORK IN PROGRESS" />
            <div className={styles.learnContainer}>
                <div className="text-center pt-0 pb-4 px-4">
                    <h1 className={styles.pagetitle}>Hečhun</h1>
                    <p className={styles.pagesubtitle}>
                        Master Kashmiri step by step.
                    </p>

                    <div className={styles.buttonContainer}>
                        <Link href="/hechun/alphabet" className={`btn ${styles.headerButton}`}>
                            🔤 Alphabet
                        </Link>
                        <Link href="/leaderboard" className={`btn ${styles.headerButton}`}>
                            🏆 Leaderboard
                        </Link>
                        <Link href="/profile" className={`btn ${styles.headerButton}`}>
                            👤 My Progress
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20">Loading your path...</div>
                ) : (
                    <div className={styles.pathContainer}>
                        {levels.map((level) => (
                            <div key={level.id} className={styles.levelSection}>
                                {/* Level Header */}
                                <div className={`${styles.levelHeader} ${level.is_locked ? 'opacity-75' : ''}`}>
                                    <div>
                                        <h2 className={styles.levelTitle}>{level.name}</h2>
                                        <p className={styles.levelDesc}>{level.description}</p>
                                    </div>
                                    {level.is_locked && (
                                        <div className="text-xs bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 px-5 py-1 rounded-full font-bold">
                                            🔒 {level.min_stars_required}★
                                        </div>
                                    )}
                                </div>

                                {/* Nodes Container */}
                                <div className={styles.nodesContainer}>
                                    {/* Connecting Line */}
                                    <div className={styles.connectingLine} />

                                    {/* Lesson Nodes */}
                                    {/* @ts-ignore - lessons is joined in API */}
                                    {level.lessons?.map((lesson, index) => {
                                        const isLocked = !!(level.is_locked || lesson.is_locked);

                                        return (
                                            <Link
                                                href={isLocked ? '#' : `/hechun/lesson/${lesson.id}`}
                                                key={lesson.id}
                                                className="transform transition-transform group"
                                            >
                                                <div className={`${styles.lessonNode} ${isLocked ? styles.locked : ''} flex flex-col items-center justify-center gap-1`}>
                                                    {isLocked ? (
                                                        <span className="text-2xl">🔒</span>
                                                    ) : (
                                                        <>
                                                            <span className="text-xl font-bold leading-none">{lesson.lesson_order}</span>
                                                            {/* Stars (Inside circle) */}
                                                            <div className="flex gap-0.5">
                                                                {[1, 2, 3].map(star => {
                                                                    const isEarned = star <= (lesson.user_stars || 0);
                                                                    return (
                                                                        <svg
                                                                            key={star}
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 24 24"
                                                                            fill={isEarned ? "currentColor" : "none"}
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            className={`w-3 h-3 ${isEarned ? 'text-yellow-500' : 'text-gray-300'}`}
                                                                        >
                                                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                                        </svg>
                                                                    );
                                                                })}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default HechunPage;
