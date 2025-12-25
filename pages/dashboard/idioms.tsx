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
        // Scroll removed to keep context
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

                {/* Modal Overlay */}
                {isFormVisible && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div
                            className="bg-card w-full max-w-3xl rounded-xl shadow-2xl border border-border flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center p-6 border-b border-border">
                                <h2 className="text-xl font-bold text-foreground">
                                    {editingId ? `Editing: ${formData.idiom_kashmiri}` : 'Add New Idiom'}
                                </h2>
                                <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground">
                                    <i className="fas fa-times text-xl"></i>
                                </button>
                            </div>

                            {/* Modal Body - Scrollable */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <form id="idiomForm" onSubmit={handleSubmit} className="space-y-4">
                                    <div className="form-group">
                                        <label className="form-label text-foreground font-medium mb-1 block">Kashmiri Idiom</label>
                                        <input
                                            name="idiom_kashmiri"
                                            onChange={handleInputChange}
                                            value={formData.idiom_kashmiri || ''}
                                            className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                            placeholder="Enter idiom in Kashmiri script..."
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="form-group">
                                            <label className="form-label text-foreground font-medium mb-1 block">Transliteration</label>
                                            <input
                                                name="transliteration"
                                                onChange={handleInputChange}
                                                value={formData.transliteration || ''}
                                                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                placeholder="e.g., kath baath"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label text-foreground font-medium mb-1 block">Literal Translation</label>
                                            <input
                                                name="translation"
                                                onChange={handleInputChange}
                                                value={formData.translation || ''}
                                                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                placeholder="Literal meaning in English"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label text-foreground font-medium mb-1 block">Meaning / Moral</label>
                                        <textarea
                                            name="meaning"
                                            onChange={handleInputChange}
                                            value={formData.meaning || ''}
                                            className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50 outline-none transition-all min-h-[100px]"
                                            rows={3}
                                            placeholder="The deeper meaning or moral of the idiom..."
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label text-foreground font-medium mb-1 block">Audio URL (Optional)</label>
                                        <input
                                            name="audio_url"
                                            onChange={handleInputChange}
                                            value={formData.audio_url || ''}
                                            className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                            placeholder="https://example.com/audio.mp3"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label text-foreground font-medium mb-1 block">Tags / Categories</label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                                                className="flex-1 px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                                placeholder="Type a tag and press Enter"
                                            />
                                            <button type="button" onClick={handleAddTag} className="btn btn-secondary whitespace-nowrap px-4">Add Tag</button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map(tag => (
                                                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                                                    {tag}
                                                    <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-destructive transition-colors ml-1">×</button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-border bg-muted/20 rounded-b-xl flex justify-end gap-3">
                                <button type="button" onClick={cancelEdit} className="btn btn-secondary">Cancel</button>
                                <button type="submit" form="idiomForm" className="btn btn-primary">{editingId ? 'Update Idiom' : 'Add Idiom'}</button>
                            </div>
                        </div>

                        {/* Backdrop Click to Close */}
                        <div className="absolute inset-0 -z-10" onClick={cancelEdit}></div>
                    </div>
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