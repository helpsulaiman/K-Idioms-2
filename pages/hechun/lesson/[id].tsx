import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useUser } from '@supabase/auth-helpers-react';
import Navigation from '../../../components/Navigation';
import styles from '../../../styles/learn.module.css';
import { fetchLessonWithSteps, submitLessonProgress, fetchNextLesson } from '../../../lib/learning-api';
import { LearningLesson, LessonStep } from '../../../types/learning';

const LessonRunner: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const user = useUser();

    const [lesson, setLesson] = useState<LearningLesson | null>(null);
    const [steps, setSteps] = useState<LessonStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [nextLesson, setNextLesson] = useState<LearningLesson | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [earnedStars, setEarnedStars] = useState(0);

    // Quiz State
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const [sessionStatus, setSessionStatus] = useState<'answering' | 'checked'>('answering');
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

    useEffect(() => {
        if (id) {
            const loadLesson = async () => {
                try {
                    const data = await fetchLessonWithSteps(Number(id));
                    setLesson(data.lesson);
                    setSteps(data.steps);

                    // Fetch next lesson
                    const next = await fetchNextLesson(data.lesson.level_id, data.lesson.lesson_order);
                    setNextLesson(next);
                } catch (error) {
                    console.error('Failed to load lesson:', error);
                } finally {
                    setLoading(false);
                }
            };
            loadLesson();
        }
    }, [id]);

    const currentStep = steps[currentStepIndex];
    const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

    const handleCheckAnswer = () => {
        if (sessionStatus !== 'answering') return;

        let correct = false;
        // Logic for checking answer
        if (currentStep.step_type.startsWith('quiz')) {
            correct = selectedChoice === currentStep.content.correct_answer;
        } else {
            // For 'teach' steps, it's always "correct" when they click continue
            correct = true;
        }

        setIsCorrect(correct);
        setSessionStatus('checked');

        if (correct && currentStep.step_type.startsWith('quiz')) {
            setCorrectAnswersCount(prev => prev + 1);
        }
    };

    const handleContinue = async () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
            setSessionStatus('answering');
            setIsCorrect(null);
            setSelectedChoice(null);
        } else {
            await finishLesson();
        }
    };

    const finishLesson = async () => {
        if (!lesson) return;

        // Calculate score
        const quizStepsCount = steps.filter(s => s.step_type.startsWith('quiz')).length;
        const percentage = quizStepsCount > 0 ? (correctAnswersCount / quizStepsCount) * 100 : 100;

        let stars = 0;
        if (percentage >= 100) stars = 3;
        else if (percentage >= 60) stars = 2;
        else if (percentage >= 45) stars = 1;

        setEarnedStars(stars);

        if (stars > 0) {
            try {
                await submitLessonProgress(user?.id, lesson.id, stars);
            } catch (error) {
                console.error('Failed to save progress:', error);
            }
        }

        setIsCompleted(true);
    };

    const getChoiceClass = (choice: string) => {
        let classNames = [styles.mcqOption];
        const isSelected = selectedChoice === choice;
        if (sessionStatus === 'checked') {
            if (choice === currentStep.content.correct_answer) classNames.push(styles.correct);
            if (isSelected && choice !== currentStep.content.correct_answer) classNames.push(styles.incorrect);
        } else if (isSelected) {
            classNames.push(styles.selected);
        }
        return classNames.join(' ');
    };

    const getActionButtonClass = () => {
        if (sessionStatus === 'answering') return styles.check;
        return isCorrect ? styles.correct : styles.incorrect;
    };

    const getButtonText = () => {
        if (sessionStatus === 'answering') return 'Check';
        if (currentStepIndex === steps.length - 1) return 'Finish Lesson';
        return 'Continue';
    };

    if (loading) {
        return (
            <>
                <Head><title>Loading Lesson...</title></Head>
                <Navigation />
                <div className={styles.learnContainer}>
                    <p className="text-center p-8">Loading lesson...</p>
                </div>
            </>
        );
    }

    if (isCompleted) {
        return (
            <>
                <Head><title>Lesson Complete!</title></Head>
                <Navigation />
                <div className={styles.learnContainer}>
                    <main className={`${styles.mainContent} flex-col justify-center`}>
                        <div className={`${styles.lessonCard} text-center max-w-md mx-auto`}>
                            <h1 className="text-3xl font-bold mb-4 text-kashmiri">Lesson Complete!</h1>
                            <div className="text-6xl mb-6">
                                {earnedStars >= 1 ? '⭐' : '☆'}
                                {earnedStars >= 2 ? '⭐' : '☆'}
                                {earnedStars >= 3 ? '⭐' : '☆'}
                            </div>
                            <p className="text-xl mb-8">You earned {earnedStars} stars!</p>

                            <div className="space-y-4">
                                {nextLesson && (
                                    <button
                                        onClick={() => window.location.href = `/hechun/lesson/${nextLesson.id}`}
                                        className={`${styles.actionButton} ${styles.correct}`}
                                    >
                                        Next Lesson: {nextLesson.title} →
                                    </button>
                                )}
                                <button
                                    onClick={() => router.push('/hechun')}
                                    className={`${styles.actionButton} ${styles.check}`}
                                >
                                    Back to Path
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </>
        );
    }

    if (!currentStep) return null;

    return (
        <>
            <Head>
                <title>{lesson?.title || 'Lesson'}</title>
            </Head>
            <Navigation />
            <div className={styles.learnContainer}>
                <div className={`${styles.lessonHeader} mb-2`}>
                    <h1 className="text-xl font-bold">{lesson?.title}</h1>
                    <button onClick={() => router.push('/hechun')} className={styles.restartButton}>
                        Quit
                    </button>
                </div>

                <div className={`${styles.progressBarContainer} mb-4`}>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${progressPercentage}%` }} />
                    </div>
                </div>

                <main className={`${styles.mainContent} flex-col justify-start pt-4`}>
                    <div className={`${styles.lessonWrapper} mx-auto`}>
                        <div className={`${styles.lessonCard} mb-6`}>
                            {currentStep.step_type === 'teach' ? (
                                <div className="text-center">
                                    <h2 className={styles.promptText}>{currentStep.content.title}</h2>
                                    <p className="text-xl mb-8">{currentStep.content.text}</p>
                                    {currentStep.content.kashmiri && (
                                        <p className={styles.sentenceText} lang="ks">
                                            {currentStep.content.kashmiri}
                                        </p>
                                    )}
                                    {currentStep.content.transliteration && (
                                        <p className={styles.transliterationText}>
                                            {currentStep.content.transliteration}
                                        </p>
                                    )}
                                    <button
                                        onClick={handleContinue}
                                        className={`${styles.actionButton} ${styles.check}`}
                                    >
                                        Got it!
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className={styles.promptText}>{currentStep.content.question}</h2>
                                    {currentStep.content.transliteration && (
                                        <p className={styles.transliterationText}>
                                            {currentStep.content.transliteration}
                                        </p>
                                    )}

                                    <div className="space-y-4">
                                        {currentStep.content.options?.map((choice: string) => (
                                            <button
                                                key={choice}
                                                onClick={() => setSelectedChoice(choice)}
                                                disabled={sessionStatus === 'checked'}
                                                className={`${getChoiceClass(choice)} text-kashmiri`}
                                            >
                                                {choice}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer / Action Area moved inside wrapper for tighter spacing */}
                        {currentStep.step_type !== 'teach' && (
                            <div className="w-full mt-4">
                                {sessionStatus === 'checked' && (
                                    <div className={`${styles.feedbackArea} ${isCorrect ? styles.correct : styles.incorrect} mb-4`}>
                                        <h3>{isCorrect ? 'Excellent!' : 'That\'s not quite right.'}</h3>
                                        {!isCorrect && <p className="text-lg mt-1">Answer: <strong>{currentStep.content.correct_answer}</strong></p>}
                                    </div>
                                )}
                                <button
                                    onClick={sessionStatus === 'answering' ? handleCheckAnswer : handleContinue}
                                    className={`${styles.actionButton} ${getActionButtonClass()}`}
                                    disabled={sessionStatus === 'answering' && !selectedChoice}
                                >
                                    {getButtonText()}
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
};

export default LessonRunner;
