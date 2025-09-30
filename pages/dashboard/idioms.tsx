// pages/dashboard/idioms.tsx
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

// Define a simple type for the idiom
interface Idiom {
    id: string; // Assuming UUIDs are strings
    idiom_kashmiri: string;
    transliteration: string;
    translation: string;
    meaning: string;
}

const ManageIdiomsPage: React.FC = () => {
    const [idioms, setIdioms] = useState<Idiom[]>([]);
    const [form, setForm] = useState<Partial<Idiom>>({});
    const [editingId, setEditingId] = useState<string | null>(null);

    const fetchIdioms = async () => {
        const res = await fetch('/api/idioms');
        const data = await res.json();
        setIdioms(data);
    };

    useEffect(() => {
        fetchIdioms();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const body = editingId ? JSON.stringify({ id: editingId, ...form }) : JSON.stringify(form);

        await fetch('/api/idioms', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body,
        });

        setForm({});
        setEditingId(null);
        fetchIdioms();
    };

    const handleEdit = (idiom: Idiom) => {
        setEditingId(idiom.id);
        setForm(idiom);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this idiom?')) return;
        await fetch('/api/idioms', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        fetchIdioms();
    };

    const cancelEdit = () => {
        setEditingId(null);
        setForm({});
    };

    return (
        <Layout title="Manage Idioms">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Manage Idioms</h1>

                <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg space-y-4">
                    <h2 className="text-xl font-semibold">{editingId ? 'Edit Idiom' : 'Add New Idiom'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="idiom_kashmiri" placeholder="Kashmiri Idiom" onChange={handleInputChange} value={form.idiom_kashmiri || ''} className="form-input" required />
                        <input name="transliteration" placeholder="Transliteration" onChange={handleInputChange} value={form.transliteration || ''} className="form-input" />
                        <input name="translation" placeholder="Translation" onChange={handleInputChange} value={form.translation || ''} className="form-input" />
                        <textarea name="meaning" placeholder="Meaning" onChange={handleInputChange} value={form.meaning || ''} className="form-textarea md:col-span-2" rows={3} required />
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" className="btn btn-primary">{editingId ? 'Update Idiom' : 'Add Idiom'}</button>
                        {editingId && <button type="button" onClick={cancelEdit} className="btn btn-secondary">Cancel</button>}
                    </div>
                </form>

                <div className="space-y-4">
                    {idioms.map((idiom) => (
                        <div key={idiom.id} className="p-4 border rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold">{idiom.idiom_kashmiri}</p>
                                <p className="text-sm text-gray-600">{idiom.meaning}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(idiom)} className="btn btn-secondary">Edit</button>
                                <button onClick={() => handleDelete(idiom.id)} className="btn btn-danger text-white">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ManageIdiomsPage;