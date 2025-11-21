import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import DashboardLayout from '../../components/DashboardLayout';

interface Lesson {
    id: number;
    type: 'mcq' | 'translate';
    prompt: string;
    kashmiri: string;
    transliteration: string;
    english: string;
    choices?: string[];
    answer: string;
}

const ManageLessonsPage: React.FC = () => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [formData, setFormData] = useState<Partial<Lesson>>({ type: 'mcq', prompt: 'What is the English meaning of this sentence?' });
    const [choicesInput, setChoicesInput] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchLessons = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/lessons');
            const data = await res.json();
            setLessons(data);
        } catch (error) {
            console.error('Failed to fetch lessons', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLessons();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleEdit = (lesson: Lesson) => {
        setEditingId(lesson.id);
        setFormData(lesson);
        setChoicesInput(lesson.choices?.join(', ') || '');
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ type: 'mcq', prompt: 'What is the English meaning of this sentence?' });
        setChoicesInput('');
        setIsFormVisible(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            choices: formData.type === 'mcq' ? choicesInput.split(',').map(c => c.trim()).filter(Boolean) : null,
        };

        const method = editingId ? 'PUT' : 'POST';
        const body = editingId ? JSON.stringify({ id: editingId, ...submissionData }) : JSON.stringify(submissionData);

        await fetch('/api/lessons', { method, headers: { 'Content-Type': 'application/json' }, body });
        cancelEdit();
        fetchLessons();
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this lesson?')) return;
        await fetch('/api/lessons', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
        fetchLessons();
    };

    return (
        <Layout title="Manage Lessons">
            <DashboardLayout>
                <div className="flex justify-between items-center mb-8" style={{ marginBottom: '2rem' }}>
                    <h1 className="text-3xl font-bold">Manage Lessons</h1>
                    {!isFormVisible && (
                        <button
                            onClick={() => setIsFormVisible(true)}
                            className="btn btn-primary"
                        >
                            + Add New Lesson
                        </button>
                    )}
                </div>

                {isFormVisible && (
                    <form onSubmit={handleSubmit} className="mb-8 p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm fade-in">
                        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Lesson' : 'Add New Lesson'}</h2>

                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <select name="type" onChange={handleInputChange} value={formData.type} className="form-input">
                                <option value="mcq">Multiple Choice</option>
                                <option value="translate">Translation</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Prompt</label>
                            <input name="prompt" onChange={handleInputChange} value={formData.prompt || ''} className="form-input" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Kashmiri Sentence</label>
                            <input name="kashmiri" onChange={handleInputChange} value={formData.kashmiri || ''} className="form-input" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Transliteration</label>
                            <input name="transliteration" onChange={handleInputChange} value={formData.transliteration || ''} className="form-input" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">English Translation</label>
                            <input name="english" onChange={handleInputChange} value={formData.english || ''} className="form-input" required />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Correct Answer</label>
                            <input name="answer" onChange={handleInputChange} value={formData.answer || ''} className="form-input" required />
                        </div>

                        {formData.type === 'mcq' && (
                            <div className="form-group">
                                <label className="form-label">Choices (comma-separated)</label>
                                <input placeholder="Choice 1, Choice 2, Choice 3" onChange={(e) => setChoicesInput(e.target.value)} value={choicesInput} className="form-input" />
                                <p className="form-help-text">The correct answer must be one of these choices.</p>
                            </div>
                        )}

                        <div className="flex gap-4 pt-4 border-t">
                            <button type="submit" className="btn btn-primary">{editingId ? 'Update Lesson' : 'Add Lesson'}</button>
                            <button type="button" onClick={cancelEdit} className="btn btn-secondary">Cancel</button>
                        </div>
                    </form>
                )}

                <div className="dashboard-grid">
                    {isLoading ? <p>Loading lessons...</p> : lessons.map((lesson) => (
                        <div key={lesson.id} className="dashboard-card">
                            <div className="mb-2">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{lesson.type}</span>
                                </div>
                                <h3 className="text-lg font-bold text-kashmiri mb-1" dir="rtl">{lesson.kashmiri}</h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{lesson.english}</p>
                            </div>
                            <div className="flex justify-end gap-2 mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
                                <button onClick={() => handleEdit(lesson)} className="btn btn-sm btn-secondary">Edit</button>
                                <button onClick={() => handleDelete(lesson.id)} className="btn btn-sm btn-danger text-white">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </DashboardLayout>
        </Layout>
    );
};

export default ManageLessonsPage;