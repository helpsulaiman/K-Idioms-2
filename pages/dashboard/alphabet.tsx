import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import DashboardLayout from '../../components/DashboardLayout';

interface AlphabetLesson {
    id: number;
    letter: string;
    name: string;
    pronunciation: string;
    example_word_kashmiri: string;
    example_word_english: string;
    lesson_order: number;
}

const ManageAlphabetPage: React.FC = () => {
    const [lessons, setLessons] = useState<AlphabetLesson[]>([]);
    const [formData, setFormData] = useState<Partial<AlphabetLesson>>({
        letter: '',
        name: '',
        pronunciation: '',
        example_word_kashmiri: '',
        example_word_english: '',
        lesson_order: undefined,
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isFormVisible, setIsFormVisible] = useState(false);

    const fetchAlphabet = async () => {
        try {
            const res = await fetch('/api/alphabet');
            if (!res.ok) throw new Error('Failed to fetch alphabet data');
            const data = await res.json();
            setLessons(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAlphabet();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'lesson_order' ? parseInt(value, 10) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const body = editingId ? JSON.stringify({ id: editingId, ...formData }) : JSON.stringify(formData);

        await fetch('/api/alphabet', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body,
        });

        cancelEdit(); // Reset form and state
        fetchAlphabet(); // Refresh list
    };

    const handleEdit = (lesson: AlphabetLesson) => {
        console.log("Editing lesson:", lesson); // For debugging
        setEditingId(lesson.id);
        setFormData(lesson);
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this letter?')) return;
        await fetch('/api/alphabet', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        fetchAlphabet();
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({
            letter: '', name: '', pronunciation: '', example_word_kashmiri: '',
            example_word_english: '', lesson_order: undefined,
        });
        setIsFormVisible(false);
    };

    return (
        <Layout title="Manage Alphabet">
            <DashboardLayout>
                <div className="flex justify-between items-center mb-8" style={{ marginBottom: '2rem' }}>
                    <h1 className="text-3xl font-bold">Manage Alphabet</h1>
                    {!isFormVisible && (
                        <button
                            onClick={() => setIsFormVisible(true)}
                            className="btn btn-primary"
                        >
                            + Add New Letter
                        </button>
                    )}
                </div>

                {isFormVisible && (
                    <form onSubmit={handleSubmit} className="mb-8 p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm fade-in">
                        <h2 className="text-xl font-semibold mb-4">{editingId ? `Editing: ${formData.name}` : 'Add New Letter'}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                            <div className="form-group">
                                <label className="form-label">Order</label>
                                <input name="lesson_order" type="number" placeholder="1" onChange={handleInputChange} value={formData.lesson_order || ''} className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Letter</label>
                                <input name="letter" placeholder="ا" onChange={handleInputChange} value={formData.letter || ''} className="form-input" required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input name="name" placeholder="Alif" onChange={handleInputChange} value={formData.name || ''} className="form-input" required />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Pronunciation</label>
                            <input name="pronunciation" placeholder="like 'a' in 'apple'" onChange={handleInputChange} value={formData.pronunciation || ''} className="form-input" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                            <div className="form-group">
                                <label className="form-label">Kashmiri Example</label>
                                <input name="example_word_kashmiri" placeholder="أنار (Anār)" onChange={handleInputChange} value={formData.example_word_kashmiri || ''} className="form-input" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">English Example</label>
                                <input name="example_word_english" placeholder="Pomegranate" onChange={handleInputChange} value={formData.example_word_english || ''} className="form-input" />
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4 border-t">
                            <button type="submit" className="btn btn-primary">{editingId ? 'Update Letter' : 'Add Letter'}</button>
                            <button type="button" onClick={cancelEdit} className="btn btn-secondary">Cancel</button>
                        </div>
                    </form>
                )}

                <div className="dashboard-grid">
                    {lessons.map((lesson) => (
                        <div key={lesson.id} className="dashboard-card">
                            <div className="mb-2 text-center">
                                <div className="text-5xl font-bold text-kashmiri my-1" lang="ks">{lesson.letter}</div>
                                <h3 className="text-lg font-semibold">{lesson.name}</h3>
                                <p className="text-xs text-gray-500 italic">{lesson.pronunciation}</p>
                            </div>
                            <div className="mt-1 pt-2 border-t border-gray-100 dark:border-gray-700 text-xs">
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-500">Example:</span>
                                    <span className="font-medium" lang="ks">{lesson.example_word_kashmiri}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Meaning:</span>
                                    <span className="font-medium">{lesson.example_word_english}</span>
                                </div>
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

export default ManageAlphabetPage;