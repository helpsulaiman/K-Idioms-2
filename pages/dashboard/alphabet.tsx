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
    };

    return (
        <Layout title="Manage Alphabet">
            <DashboardLayout>
                <h1 className="text-3xl font-bold mb-6">Manage Alphabet</h1>

                <form onSubmit={handleSubmit} className="mb-8 p-6 border rounded-lg space-y-4 bg-white dark:bg-gray-800 shadow-sm">
                    <h2 className="text-xl font-semibold">{editingId ? `Editing: ${formData.name}` : 'Add New Letter'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input name="lesson_order" type="number" placeholder="Order" onChange={handleInputChange} value={formData.lesson_order || ''} className="form-input" required />
                        <input name="letter" placeholder="Letter (e.g., ا)" onChange={handleInputChange} value={formData.letter || ''} className="form-input" required />
                        <input name="name" placeholder="Name (e.g., Alif)" onChange={handleInputChange} value={formData.name || ''} className="form-input" required />
                        <input name="pronunciation" placeholder="Pronunciation" onChange={handleInputChange} value={formData.pronunciation || ''} className="form-input md:col-span-3" />
                        <input name="example_word_kashmiri" placeholder="Kashmiri Example" onChange={handleInputChange} value={formData.example_word_kashmiri || ''} className="form-input" />
                        <input name="example_word_english" placeholder="English Example" onChange={handleInputChange} value={formData.example_word_english || ''} className="form-input" />
                    </div>
                    <div className="flex gap-4 pt-2">
                        <button type="submit" className="btn btn-primary">{editingId ? 'Update Letter' : 'Add Letter'}</button>
                        {editingId && <button type="button" onClick={cancelEdit} className="btn btn-secondary">Cancel</button>}
                    </div>
                </form>

                <div className="space-y-4">
                    {lessons.map((lesson) => (
                        <div key={lesson.id} className="p-4 border rounded-lg flex justify-between items-center bg-white dark:bg-gray-800">
                            <div className="flex items-center gap-4">
                                <span className="font-mono text-gray-500 text-sm">#{lesson.lesson_order}</span>
                                <div>
                                    <span className="font-bold text-2xl" lang="ks">{lesson.letter}</span>
                                    <span className="ml-2 text-lg">{lesson.name}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(lesson)} className="btn btn-secondary">Edit</button>
                                <button onClick={() => handleDelete(lesson.id)} className="btn btn-danger text-white">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </DashboardLayout>
        </Layout>
    );
};

export default ManageAlphabetPage;