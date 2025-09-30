// pages/dashboard/alphabet.tsx
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

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
    const [form, setForm] = useState<Partial<AlphabetLesson>>({});
    const [editingId, setEditingId] = useState<number | null>(null);

    const fetchAlphabet = async () => {
        const res = await fetch('/api/alphabet');
        const data = await res.json();
        setLessons(data);
    };

    useEffect(() => {
        fetchAlphabet();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const body = editingId ? JSON.stringify({ id: editingId, ...form }) : JSON.stringify(form);

        await fetch('/api/alphabet', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body,
        });

        setForm({});
        setEditingId(null);
        fetchAlphabet();
    };

    const handleEdit = (lesson: AlphabetLesson) => {
        setEditingId(lesson.id);
        setForm(lesson);
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
        setForm({});
    };

    return (
        <Layout title="Manage Alphabet">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Manage Alphabet</h1>

                {/* --- Form for Adding/Editing --- */}
                <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg space-y-4">
                    <h2 className="text-xl font-semibold">{editingId ? 'Edit Letter' : 'Add New Letter'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="lesson_order" type="number" placeholder="Order" onChange={handleInputChange} value={form.lesson_order || ''} className="form-input" required />
                        <input name="letter" placeholder="Letter (e.g., ا)" onChange={handleInputChange} value={form.letter || ''} className="form-input" required />
                        <input name="name" placeholder="Name (e.g., Alif)" onChange={handleInputChange} value={form.name || ''} className="form-input" required />
                        <input name="pronunciation" placeholder="Pronunciation" onChange={handleInputChange} value={form.pronunciation || ''} className="form-input" />
                        <input name="example_word_kashmiri" placeholder="Kashmiri Example" onChange={handleInputChange} value={form.example_word_kashmiri || ''} className="form-input" />
                        <input name="example_word_english" placeholder="English Example" onChange={handleInputChange} value={form.example_word_english || ''} className="form-input" />
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Add'}</button>
                        {editingId && <button type="button" onClick={cancelEdit} className="btn btn-secondary">Cancel</button>}
                    </div>
                </form>

                {/* --- List of Existing Letters --- */}
                <div className="space-y-4">
                    {lessons.map((lesson) => (
                        <div key={lesson.id} className="p-4 border rounded-lg flex justify-between items-center">
                            <div>
                                <span className="font-bold text-xl">{lesson.letter}</span> ({lesson.name}) - Order: {lesson.lesson_order}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(lesson)} className="btn btn-secondary">Edit</button>
                                <button onClick={() => handleDelete(lesson.id)} className="btn btn-danger text-white">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ManageAlphabetPage;