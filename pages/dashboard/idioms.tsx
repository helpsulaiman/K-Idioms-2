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

    const fetchIdioms = async () => { /* ... (function is unchanged) ... */ };
    useEffect(() => { fetchIdioms(); }, []);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleAddTag = () => { /* ... (function is unchanged) ... */ };
    const handleRemoveTag = (tagToRemove: string) => { /* ... (function is unchanged) ... */ };
    const handleSubmit = async (e: React.FormEvent) => { /* ... (function is unchanged) ... */ };
    const handleEdit = (idiom: Idiom) => { /* ... (function is unchanged) ... */ };
    const handleDelete = async (id: string) => { /* ... (function is unchanged) ... */ };
    const cancelEdit = () => { /* ... (function is unchanged) ... */ };

    return (
        <Layout title="Manage Idioms">
            <DashboardLayout>
                <h1 className="text-3xl font-bold mb-6">Manage Idioms</h1>

                <form onSubmit={handleSubmit} className="mb-8 p-6 border rounded-lg space-y-4 bg-white dark:bg-gray-800 shadow-sm">
                    <h2 className="text-xl font-semibold">{editingId ? 'Edit Idiom' : 'Add New Idiom'}</h2>

                    {/* --- UPDATED FORM STRUCTURE --- */}
                    <div className="form-group">
                        <label className="form-label">Kashmiri Idiom</label>
                        <input name="idiom_kashmiri" placeholder="Kashmiri Idiom" onChange={handleInputChange} value={formData.idiom_kashmiri || ''} className="form-input" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                        <div className="form-group">
                            <label className="form-label">Transliteration</label>
                            <input name="transliteration" placeholder="Transliteration" onChange={handleInputChange} value={formData.transliteration || ''} className="form-input" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Literal Translation</label>
                            <input name="translation" placeholder="Translation" onChange={handleInputChange} value={formData.translation || ''} className="form-input" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Meaning</label>
                        <textarea name="meaning" placeholder="Meaning" onChange={handleInputChange} value={formData.meaning || ''} className="form-textarea" rows={3} required />
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
                    {idioms.map((idiom) => (
                        <div key={idiom.id} className="p-4 border rounded-lg flex justify-between items-center bg-white dark:bg-gray-800">
                            {/* ... (list of idioms remains the same) ... */}
                        </div>
                    ))}
                </div>
            </DashboardLayout>
        </Layout>
    );
};

export default ManageIdiomsPage;