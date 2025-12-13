import React, { useState, useEffect } from 'react';
import Head from 'next/head';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);
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
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        setIsFormVisible(false);
    };

    return (
        <>
            <Head>
                <title>Manage Idioms</title>
            </Head>
            <DashboardLayout>
                <div className="flex justify-between items-center mb-8" style={{ marginBottom: '2rem' }}>
                    <h1 className="text-3xl font-bold">Manage Idioms</h1>
                    {!isFormVisible && (
                        <button
                            onClick={() => setIsFormVisible(true)}
                            className="btn btn-primary"
                        >
                            + Add New Idiom
                        </button>
                    )}
                </div>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search idioms by text, meaning, or transliteration..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input"
                    />
                </div>

                {isFormVisible && (
                    <form onSubmit={handleSubmit} className="mb-8 p-6 border border-border rounded-lg bg-card shadow-sm fade-in">
                        <h2 className="text-xl font-semibold mb-4 text-foreground">{editingId ? `Editing: ${formData.idiom_kashmiri}` : 'Add New Idiom'}</h2>

                        <div className="form-group">
                            <label className="form-label text-foreground">Kashmiri Idiom</label>
                            <input name="idiom_kashmiri" onChange={handleInputChange} value={formData.idiom_kashmiri || ''} className="form-input bg-background text-foreground border-border" required />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                            <div className="form-group">
                                <label className="form-label text-foreground">Transliteration</label>
                                <input name="transliteration" onChange={handleInputChange} value={formData.transliteration || ''} className="form-input bg-background text-foreground border-border" />
                            </div>
                            <div className="form-group">
                                <label className="form-label text-foreground">Literal Translation</label>
                                <input name="translation" onChange={handleInputChange} value={formData.translation || ''} className="form-input bg-background text-foreground border-border" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label text-foreground">Meaning</label>
                            <textarea name="meaning" onChange={handleInputChange} value={formData.meaning || ''} className="form-textarea bg-background text-foreground border-border" rows={3} required />
                        </div>

                        <div className="form-group">
                            <label className="form-label text-foreground">Audio URL (Optional)</label>
                            <input name="audio_url" placeholder="https://example.com/audio.mp3" onChange={handleInputChange} value={formData.audio_url || ''} className="form-input bg-background text-foreground border-border" />
                        </div>

                        <div className="form-group">
                            <label className="form-label text-foreground">Tags / Categories</label>
                            <div className="tag-input-row">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                                    className="form-input bg-background text-foreground border-border"
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

                        <div className="flex gap-4 pt-4 border-t border-border">
                            <button type="submit" className="btn btn-primary">{editingId ? 'Update Idiom' : 'Add Idiom'}</button>
                            <button type="button" onClick={cancelEdit} className="btn btn-secondary">Cancel</button>
                        </div>
                    </form>
                )}

                <div className="dashboard-grid">
                    {isLoading ? <p>Loading idioms...</p> : idioms.filter(idiom =>
                        idiom.idiom_kashmiri.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        idiom.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (idiom.translation && idiom.translation.toLowerCase().includes(searchTerm.toLowerCase())) ||
                        (idiom.transliteration && idiom.transliteration.toLowerCase().includes(searchTerm.toLowerCase()))
                    ).map((idiom) => (
                        <div key={idiom.id} className="dashboard-card bg-card border-border">
                            <div className="mb-2">
                                <h3 className="text-lg font-bold text-kashmiri mb-1">{idiom.idiom_kashmiri}</h3>
                                {idiom.transliteration && <p className="text-xs text-transliteration mb-1">{idiom.transliteration}</p>}
                                <p className="text-sm text-muted-foreground line-clamp-3">{idiom.meaning}</p>
                            </div>
                            <div className="flex justify-end gap-2 mt-auto pt-2 border-t border-border">
                                <button onClick={() => handleEdit(idiom)} className="btn btn-sm btn-secondary">Edit</button>
                                <button onClick={() => handleDelete(idiom.id)} className="btn btn-sm btn-danger text-white bg-destructive hover:bg-destructive/90">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </DashboardLayout>
        </>
    );
};

export default ManageIdiomsPage;