import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { useUser } from '@supabase/auth-helpers-react';
import { fetchLevelsWithLessons } from '../../lib/learning-api';
import { LearningLevel } from '../../types/learning';
import styles from '../../styles/learn.module.css';

const HechunPage: React.FC = () => {
    const user = useUser();
    const [levels, setLevels] = useState<LearningLevel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchLevelsWithLessons(user?.id);
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
            <div className={styles.learnContainer}>
                <div className="text-center pt-10 pb-4 px-4">
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
                        <Link href="/hechun/progress" className={`btn ${styles.headerButton}`}>
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
                                        <div className="text-xs bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full font-bold">
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
                                                className="transform transition-transform"
                                            >
                                                <div className={`${styles.lessonNode} ${isLocked ? styles.locked : ''}`}>
                                                    {isLocked ? (
                                                        <span>🔒</span>
                                                    ) : (
                                                        <span>{lesson.lesson_order}</span>
                                                    )}

                                                    {/* Stars (Floating below) */}
                                                    {!isLocked && (
                                                        <div className="absolute -bottom-8 flex gap-1 text-sm">
                                                            {[1, 2, 3].map(star => (
                                                                <span key={star} className={star <= (lesson.user_progress?.[0]?.stars || 0) ? 'text-yellow-400' : 'text-gray-300'}>
                                                                    ★
                                                                </span>
                                                            ))}
                                                        </div>
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
