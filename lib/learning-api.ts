import { supabase } from './supabase';
import { ApiError } from './api';
import {
    LearningLevel,
    LearningLesson,
    LessonStep,
    UserProgress,
    UserStats
} from '../types/learning';

// --- LEVELS & LESSONS ---

export async function fetchLevelsWithLessons(userId?: string): Promise<LearningLevel[]> {
    try {
        // 1. Fetch all levels
        const { data: levels, error: levelsError } = await supabase
            .from('learning_levels')
            .select('*')
            .order('level_order', { ascending: true });

        if (levelsError) throw new ApiError(`Failed to fetch levels: ${levelsError.message}`);
        if (!levels) return [];

        // 2. Fetch user stats to check total stars (for unlocking levels)
        let totalStars = 0;
        if (userId) {
            const { data: stats } = await supabase
                .from('user_stats')
                .select('total_stars')
                .eq('user_id', userId)
                .single();
            totalStars = stats?.total_stars || 0;
        }

        // 3. For each level, fetch lessons and attach lock status
        const levelsWithLessons = await Promise.all(levels.map(async (level) => {
            const { data: lessons, error: lessonsError } = await supabase
                .from('learning_lessons')
                .select('*')
                .eq('level_id', level.id)
                .order('lesson_order', { ascending: true });

            if (lessonsError) throw new ApiError(`Failed to fetch lessons for level ${level.id}: ${lessonsError.message}`);

            // Attach user progress if logged in OR check localStorage for guest
            let lessonsWithProgress = lessons || [];
            if (userId) {
                const { data: progress } = await supabase
                    .from('user_progress')
                    .select('lesson_id, stars')
                    .eq('user_id', userId);

                lessonsWithProgress = lessonsWithProgress.map(lesson => {
                    const p = progress?.find(p => p.lesson_id === lesson.id);
                    return {
                        ...lesson,
                        user_stars: p?.stars || 0,
                        is_locked: false // We'll calculate this logic in the UI or here
                    };
                });
            } else if (typeof window !== 'undefined') {
                // Guest mode: Read from localStorage
                try {
                    const localProgress = JSON.parse(localStorage.getItem('hechun_guest_progress') || '{}');
                    lessonsWithProgress = lessonsWithProgress.map(lesson => {
                        const stars = localProgress[lesson.id] || 0;
                        return {
                            ...lesson,
                            user_stars: stars,
                            is_locked: false
                        };
                    });

                    // Calculate total stars for guest to unlock levels
                    totalStars = Object.values(localProgress).reduce((sum: number, stars: any) => sum + (Number(stars) || 0), 0);
                } catch (e) {
                    console.error('Error reading guest progress', e);
                }
            }

            // Determine if level is locked based on stars
            const isLevelLocked = totalStars < level.min_stars_required;

            return {
                ...level,
                lessons: lessonsWithProgress,
                is_locked: isLevelLocked
            };
        }));

        return levelsWithLessons;
    } catch (error) {
        console.error('Error fetching learning path:', error);
        throw error instanceof ApiError ? error : new ApiError('Failed to fetch learning path');
    }
}

export async function fetchLessonWithSteps(lessonId: number): Promise<{ lesson: LearningLesson, steps: LessonStep[] }> {
    try {
        // Fetch lesson details
        const { data: lesson, error: lessonError } = await supabase
            .from('learning_lessons')
            .select('*')
            .eq('id', lessonId)
            .single();

        if (lessonError) throw new ApiError(`Failed to fetch lesson: ${lessonError.message}`);

        // Fetch steps
        const { data: steps, error: stepsError } = await supabase
            .from('lesson_steps')
            .select('*')
            .eq('lesson_id', lessonId)
            .order('step_order', { ascending: true });

        if (stepsError) throw new ApiError(`Failed to fetch steps: ${stepsError.message}`);

        return { lesson, steps: steps || [] };
    } catch (error) {
        console.error('Error fetching lesson content:', error);
        throw error instanceof ApiError ? error : new ApiError('Failed to fetch lesson content');
    }
}

// --- PROGRESS & STATS ---

export async function submitLessonProgress(userId: string | undefined, lessonId: number, stars: number): Promise<void> {
    try {
        if (!userId) {
            // Guest mode: Save to localStorage
            if (typeof window !== 'undefined') {
                const localProgress = JSON.parse(localStorage.getItem('hechun_guest_progress') || '{}');
                // Only update if new stars are higher or it's a new entry
                if ((localProgress[lessonId] || 0) < stars) {
                    localProgress[lessonId] = stars;
                    localStorage.setItem('hechun_guest_progress', JSON.stringify(localProgress));
                }
            }
            return;
        }

        // 1. Upsert user_progress
        const { error: progressError } = await supabase
            .from('user_progress')
            .upsert({
                user_id: userId,
                lesson_id: lessonId,
                stars: stars,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id, lesson_id' });

        if (progressError) throw new ApiError(`Failed to save progress: ${progressError.message}`);

        // 2. Update user_stats (re-calculate totals)
        // Fetch all progress for this user to calculate total stars
        const { data: allProgress, error: fetchProgressError } = await supabase
            .from('user_progress')
            .select('stars')
            .eq('user_id', userId);

        if (fetchProgressError) {
            console.error('Error fetching all progress:', fetchProgressError);
            // Don't throw, just log. We still saved the current lesson progress.
        } else {
            const totalStars = allProgress?.reduce((sum, p) => sum + p.stars, 0) || 0;
            const lessonsCompleted = allProgress?.filter(p => p.stars > 0).length || 0;

            const { error: statsError } = await supabase
                .from('user_stats')
                .upsert({
                    user_id: userId,
                    total_stars: totalStars,
                    lessons_completed: lessonsCompleted,
                    last_activity_date: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });

            if (statsError) {
                console.error('Failed to update stats:', statsError);
                // Don't throw, as the primary action (saving lesson progress) succeeded
            }
        }

        // 3. Check for badges
        await checkAndAwardBadges(userId, lessonId);

    } catch (error) {
        console.error('Error submitting progress:', error);
        throw error instanceof ApiError ? error : new ApiError('Failed to submit progress');
    }
}

export async function fetchLeaderboard(period: 'daily' | 'weekly' | 'all_time' = 'all_time'): Promise<UserStats[]> {
    // For now, we'll just return all-time stats sorted by stars
    // Implementing true daily/weekly requires a separate 'activity_log' table
    try {
        const { data, error } = await supabase
            .from('user_stats')
            .select('*')
            .order('total_stars', { ascending: false })
            .limit(50);

        if (error) throw new ApiError(`Failed to fetch leaderboard: ${error.message}`);
        return data || [];
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error instanceof ApiError ? error : new ApiError('Failed to fetch leaderboard');
    }
}

// --- BADGES ---

async function checkAndAwardBadges(userId: string, lessonId: number) {
    try {
        // Get the lesson to find out which level it belongs to
        const { data: lesson } = await supabase
            .from('learning_lessons')
            .select('level_id')
            .eq('id', lessonId)
            .single();

        if (!lesson) return;

        // Check if all lessons in this level are completed
        const { data: levelLessons } = await supabase
            .from('learning_lessons')
            .select('id')
            .eq('level_id', lesson.level_id);

        if (!levelLessons) return;

        const { data: userProgress } = await supabase
            .from('user_progress')
            .select('lesson_id')
            .eq('user_id', userId)
            .gt('stars', 0); // Completed lessons

        const completedLessonIds = new Set(userProgress?.map(p => p.lesson_id));
        const allCompleted = levelLessons.every(l => completedLessonIds.has(l.id));

        if (allCompleted) {
            // Find the badge for this level
            // In a real app, we'd query the badges table with criteria, but for now we'll hardcode or use a convention
            // Let's assume badge ID corresponds to level ID for simplicity, or query by criteria
            const { data: badges } = await supabase
                .from('badges')
                .select('*');

            const levelBadge = badges?.find(b => b.criteria?.type === 'level_complete' && b.criteria?.level_id === lesson.level_id);

            if (levelBadge) {
                // Award badge if not already owned
                await supabase
                    .from('user_badges')
                    .upsert({
                        user_id: userId,
                        badge_id: levelBadge.id,
                        awarded_at: new Date().toISOString()
                    }, { onConflict: 'user_id, badge_id' });
            }
        }
    } catch (error) {
        console.error('Error checking badges:', error);
        // Don't throw here, as it shouldn't block progress submission
    }
}

export async function fetchUserBadges(userId: string) {
    try {
        const { data, error } = await supabase
            .from('user_badges')
            .select('*, badge:badges(*)')
            .eq('user_id', userId);

        if (error) throw new ApiError(`Failed to fetch badges: ${error.message}`);
        return data || [];
    } catch (error) {
        console.error('Error fetching badges:', error);
        throw error instanceof ApiError ? error : new ApiError('Failed to fetch badges');
    }
}

export async function fetchNextLesson(levelId: number, currentLessonOrder: number): Promise<LearningLesson | null> {
    const { data, error } = await supabase
        .from('learning_lessons')
        .select('*')
        .eq('level_id', levelId)
        .gt('lesson_order', currentLessonOrder)
        .order('lesson_order', { ascending: true })
        .limit(1)
        .single();

    if (error) {
        if (error.code === 'PGRST116') return null; // No next lesson found
        console.error('Error fetching next lesson:', error);
        return null;
    }

    return data;
}
