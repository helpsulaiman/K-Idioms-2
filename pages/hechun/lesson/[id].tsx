import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Layout from '../../../components/Layout';
import styles from '../../../styles/learn.module.css';
import { Mic, Square } from 'lucide-react';
import { fetchLessonWithSteps, submitLessonProgress, fetchNextLesson } from '../../../lib/learning-api';
import { LearningLesson, LessonStep } from '../../../types/learning';

const LessonRunner: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const user = useUser();
    const supabase = useSupabaseClient();

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

    // Speaking State
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [transcription, setTranscription] = useState<string | null>(null);
    const [hasCompletedSpeak, setHasCompletedSpeak] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);

    useEffect(() => {
        if (id) {
            const loadLesson = async () => {
                try {
                    const data = await fetchLessonWithSteps(supabase, Number(id));
                    setLesson(data.lesson);
                    setSteps(data.steps);

                    // Fetch next lesson
                    const next = await fetchNextLesson(supabase, data.lesson.level_id, data.lesson.lesson_order);
                    setNextLesson(next);
                } catch (error) {
                    console.error('Failed to load lesson:', error);
                } finally {
                    setLoading(false);
                }
            };
            loadLesson();
        }
    }, [id, supabase]);

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
                await submitLessonProgress(supabase, user?.id, lesson.id, stars);
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

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mimeType = MediaRecorder.isTypeSupported('audio/webm')
                ? 'audio/webm'
                : MediaRecorder.isTypeSupported('audio/mp4')
                    ? 'audio/mp4'
                    : 'audio/ogg'; // Fallback

            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;
            (mediaRecorderRef.current as any).mimeType = mimeType; // Store for valid blob creation
            const chunks: BlobPart[] = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const mimeType = (mediaRecorderRef.current as any).mimeType || 'audio/webm';
                const blob = new Blob(chunks, { type: mimeType });
                setAudioBlob(blob);
                handleTranscribe(blob, mimeType);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setTranscription(null);
            setIsCorrect(null);
            setSessionStatus('answering');
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Could not access microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleTranscribe = async (blob: Blob, mimeType: string) => {
        setIsTranscribing(true);
        const formData = new FormData();
        const ext = mimeType.split('/')[1] || 'webm';
        formData.append('audio', blob, `recording.${ext}`);

        try {
            const response = await fetch('/api/transcribe', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setTranscription(data.text);

            // Simple check logic (fuzzy match ideally, but simple includes/match for now)
            // Or if backend returns confidence/correctness
            // Normalize strings for comparison (lowercase, trim)
            const normalizedTranscription = data.text?.toLowerCase().trim() || "";
            const targets = [
                currentStep.content.correct_answer?.toLowerCase().trim(),
                currentStep.content.kashmiri?.toLowerCase().trim(),
                currentStep.content.text?.toLowerCase().trim()
            ].filter(Boolean); // Filter out null/undefined

            console.log('Verification Debug:', {
                transcription: normalizedTranscription,
                targets: targets
            });

            // Check if transcription matches any of the target strings
            // We use 'includes' for leniency, or exact match if preferred
            const isMatch = targets.some((t: string) => normalizedTranscription.includes(t) || t.includes(normalizedTranscription));

            setIsCorrect(isMatch);
            setSessionStatus('checked');
            if (isMatch) setCorrectAnswersCount(prev => prev + 1);

            // Mark that we've completed a speak step, so we don't show the warning again
            if (!hasCompletedSpeak) setHasCompletedSpeak(true);

        } catch (err) {
            console.error('Transcription failed:', err);
            alert('Transcription failed');
        } finally {
            setIsTranscribing(false);
        }
    };

    if (loading) {
        return (
            <Layout title="Loading Lesson...">
                <div className={styles.learnContainer}>
                    <p className="text-center p-8">Loading lesson...</p>
                </div>
            </Layout>
        );
    }

    if (isCompleted) {
        return (
            <Layout title="Lesson Complete!">
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
            </Layout>
        );
    }

    if (!currentStep) return null;

    return (
        <Layout title={lesson?.title || 'Lesson'}>
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

                                    {currentStep.content.audio_url && (
                                        <div className="mt-4">
                                            <audio controls src={currentStep.content.audio_url} className="w-full" />
                                        </div>
                                    )}
                                </div>
                            ) : currentStep.step_type === 'speak' ? (
                                <div className="text-center">
                                    <h2 className={styles.promptText}>{currentStep.content.title || 'Speak the phrase:'}</h2>
                                    <p className="text-xl mb-4 text-kashmiri" lang="ks">{currentStep.content.kashmiri || currentStep.content.text}</p>
                                    <p className="text-lg text-gray-500 mb-8">{currentStep.content.transliteration}</p>

                                    <div className="flex flex-col items-center justify-center gap-6">
                                        <button
                                            onClick={isRecording ? stopRecording : startRecording}
                                            disabled={isTranscribing || (sessionStatus === 'checked')}
                                            className={`
                                                relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl
                                                ${isRecording
                                                    ? 'bg-red-500 scale-110 ring-4 ring-red-200 animate-pulse'
                                                    : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] hover:scale-105'
                                                }
                                                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                                            `}
                                        >
                                            {isRecording ? (
                                                <Square size={32} fill="white" className="text-white" />
                                            ) : (
                                                <Mic size={40} className="text-white" />
                                            )}
                                        </button>
                                        <p className="text-lg font-medium text-[var(--text-secondary)]">
                                            {isRecording ? 'Listening...' : sessionStatus === 'checked' ? 'Recorded' : 'Tap to Record'}
                                        </p>

                                        {/* First time warning */}
                                        <div className="flex items-start gap-2 bg-blue-50 text-blue-700 p-3 rounded-lg text-sm max-w-sm mx-auto mt-2">
                                            <span className="text-xl">ℹ️</span>
                                            <p className="text-left leading-tight">
                                                <strong>Note:</strong> The first recording will take longer (~1 min) to download the AI model. Subsequent tries will be fast!
                                            </p>
                                        </div>
                                    </div>

                                    {isTranscribing && <div className="mt-4 text-blue-600">Transcribing...</div>}
                                    {transcription && (
                                        <div className="mt-4 p-4 bg-secondary rounded-xl border border-border/10">
                                            <p className="text-sm text-secondary-foreground/70">You said:</p>
                                            <p className="text-lg font-medium text-secondary-foreground">{transcription}</p>
                                        </div>
                                    )}
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
                                        {!isCorrect && currentStep.step_type !== 'speak' && <p className="text-lg mt-1">Answer: <strong>{currentStep.content.correct_answer}</strong></p>}
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
        </Layout>
    );
};

export const getStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking',
    };
};

export const getStaticProps = async () => {
    return {
        props: {},
    };
};

export default LessonRunner;
