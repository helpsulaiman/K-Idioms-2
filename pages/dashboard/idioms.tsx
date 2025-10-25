import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import DashboardLayout from '../../components/DashboardLayout';

interface Idiom {
    id: string;
    idiom_kashmiri: string;
    transliteration: string;
    translation: string;
    meaning: string;
    tags: string[];
    audio_url?: string;
}

const ManageIdiomsPage: React.FC = () => {
    const [idioms, setIdioms] = useState<Idiom[]>([]);
    const [formData, setFormData] = useState<Partial<Omit<Idiom, 'tags'>>>({});
    const [editingId, setEditingId] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchIdioms = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/idioms');
            const data = await res.json();
            setIdioms(data);
        } catch (error) {
            console.error("Failed to fetch idioms", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchIdioms();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddTag = () => {
        const newTag = tagInput.trim();
        if (newTag && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const submissionData = { ...formData, tags };
        const body = editingId ? JSON.stringify({ id: editingId, ...submissionData }) : JSON.stringify(submissionData);

        await fetch('/api/idioms', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body,
        });

        cancelEdit();
        fetchIdioms();
    };

    const handleEdit = (idiom: Idiom) => {
        setEditingId(idiom.id);
        setFormData(idiom);
        setTags(idiom.tags || []);
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
        setFormData({});
        setTags([]);
        setTagInput('');
    };

    return (
        <Layout title="Manage Idioms">
            <DashboardLayout>
                <h1 className="text-3xl font-bold mb-6">Manage Idioms</h1>

                <form onSubmit={handleSubmit} className="mb-8 p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">{editingId ? `Editing: ${formData.idiom_kashmiri}` : 'Add New Idiom'}</h2>

                    <div className="form-group">
                        <label className="form-label">Kashmiri Idiom</label>
                        <input name="idiom_kashmiri" onChange={handleInputChange} value={formData.idiom_kashmiri || ''} className="form-input" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <div className="form-group">
                            <label className="form-label">Transliteration</label>
                            <input name="transliteration" onChange={handleInputChange} value={formData.transliteration || ''} className="form-input" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Literal Translation</label>
                            <input name="translation" onChange={handleInputChange} value={formData.translation || ''} className="form-input" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Meaning</label>
                        <textarea name="meaning" onChange={handleInputChange} value={formData.meaning || ''} className="form-textarea" rows={3} required />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Audio URL (Optional)</label>
                        <input name="audio_url" placeholder="https://example.com/audio.mp3" onChange={handleInputChange} value={formData.audio_url || ''} className="form-input" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tags / Categories</label>
                        <div className="tag-input-row">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                                className="form-input"
                                placeholder="Type a tag and press Enter"
                            />
                            <button type="button" onClick={handleAddTag} className="btn btn-secondary">Add</button>
                        </div>
                        <div className="tag-display">
                            {tags.map(tag => (
                                <div key={tag} className="tag-removable">
                                    <span>{tag}</span>
                                    <button type="button" onClick={() => handleRemoveTag(tag)} className="tag-remove-btn">×</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t">
                        <button type="submit" className="btn btn-primary">{editingId ? 'Update Idiom' : 'Add Idiom'}</button>
                        {editingId && <button type="button" onClick={cancelEdit} className="btn btn-secondary">Cancel</button>}
                    </div>
                </form>

                <div className="space-y-4">
                    {isLoading ? <p>Loading idioms...</p> : idioms.map((idiom) => (
                        <div key={idiom.id} className="p-4 border rounded-lg flex justify-between items-center bg-white dark:bg-gray-800">
                            <div>
                                <p className="font-bold">{idiom.idiom_kashmiri}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{idiom.meaning}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(idiom)} className="btn btn-secondary">Edit</button>
                                <button onClick={() => handleDelete(idiom.id)} className="btn btn-danger text-white">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </DashboardLayout>
        </Layout>
    );
};

export default ManageIdiomsPage;