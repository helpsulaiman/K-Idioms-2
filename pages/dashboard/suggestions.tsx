import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '../../components/DashboardLayout';

// UPDATED: The interface now includes all relevant fields from the suggestions table
interface Suggestion {
    id: string;
    created_at: string;
    idiom_kashmiri: string;
    transliteration: string;
    translation: string;
    meaning: string;
    tags: string[];
    submitter_name?: string;
    submitter_email?: string;
    notes?: string;
}

const ManageSuggestionsPage: React.FC = () => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSuggestions = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/suggestions');
            const data = await res.json();
            setSuggestions(data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const handleApprove = async (suggestion: Suggestion) => {
        if (!window.confirm('Are you sure you want to approve this suggestion?')) return;
        await fetch('/api/suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(suggestion),
        });
        fetchSuggestions();
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this suggestion?')) return;
        await fetch('/api/suggestions', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        fetchSuggestions();
    };

    return (
        <>
            <Head>
                <title>Manage Suggestions</title>
            </Head>
            <DashboardLayout>
                <h1 className="text-3xl font-bold mb-6 text-foreground">Manage Suggestions</h1>
                {isLoading ? (
                    <p className="text-muted-foreground">Loading suggestions...</p>
                ) : suggestions.length === 0 ? (
                    <div className="text-center p-8 bg-card rounded-lg border border-border">
                        <p className="text-muted-foreground">No pending suggestions found.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {suggestions.map((suggestion) => (
                            // UPDATED: The entire display for each suggestion is now more detailed
                            <div key={suggestion.id} className="p-6 border border-border rounded-lg bg-card shadow-sm text-foreground">
                                <div className="mb-4 space-y-3">
                                    <div>
                                        <strong className="text-sm text-muted-foreground">Kashmiri (Perso-Arabic)</strong>
                                        <p className="font-bold text-xl text-foreground" lang="ks">{suggestion.idiom_kashmiri}</p>
                                    </div>
                                    <div>
                                        <strong className="text-sm text-muted-foreground">Transliteration</strong>
                                        <p className="italic text-foreground">{suggestion.transliteration}</p>
                                    </div>
                                    <div>
                                        <strong className="text-sm text-muted-foreground">Literal Translation</strong>
                                        <p className="text-foreground">{suggestion.translation}</p>
                                    </div>
                                    <div>
                                        <strong className="text-sm text-muted-foreground">Meaning/Context</strong>
                                        <p className="text-muted-foreground">{suggestion.meaning}</p>
                                    </div>
                                    {suggestion.notes && (
                                        <div>
                                            <strong className="text-sm text-muted-foreground">Submitter Notes</strong>
                                            <p className="text-sm text-muted-foreground italic">{suggestion.notes}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="border-t border-border pt-4 flex justify-between items-center">
                                    <p className="text-sm text-muted-foreground">
                                        Submitted by: {suggestion.submitter_name || 'Anonymous'}
                                    </p>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleApprove(suggestion)} className="btn btn-primary">Approve</button>
                                        <button onClick={() => handleDelete(suggestion.id)} className="btn btn-danger text-white bg-destructive hover:bg-destructive/90">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </DashboardLayout>
        </>
    );
};

export default ManageSuggestionsPage;