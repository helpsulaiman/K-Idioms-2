import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
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
        <Layout title="Manage Suggestions">
            <DashboardLayout>
                <h1 className="text-3xl font-bold mb-6">Manage Suggestions</h1>
                {isLoading ? (
                    <p>Loading suggestions...</p>
                ) : suggestions.length === 0 ? (
                    <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg border">
                        <p className="text-gray-500">No pending suggestions found.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {suggestions.map((suggestion) => (
                            // UPDATED: The entire display for each suggestion is now more detailed
                            <div key={suggestion.id} className="p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                                <div className="mb-4 space-y-3">
                                    <div>
                                        <strong className="text-sm text-gray-500 dark:text-gray-400">Kashmiri (Perso-Arabic)</strong>
                                        <p className="font-bold text-xl" lang="ks">{suggestion.idiom_kashmiri}</p>
                                    </div>
                                    <div>
                                        <strong className="text-sm text-gray-500 dark:text-gray-400">Transliteration</strong>
                                        <p className="italic">{suggestion.transliteration}</p>
                                    </div>
                                    <div>
                                        <strong className="text-sm text-gray-500 dark:text-gray-400">Literal Translation</strong>
                                        <p>{suggestion.translation}</p>
                                    </div>
                                    <div>
                                        <strong className="text-sm text-gray-500 dark:text-gray-400">Meaning/Context</strong>
                                        <p className="text-gray-700 dark:text-gray-300">{suggestion.meaning}</p>
                                    </div>
                                    {suggestion.notes && (
                                        <div>
                                            <strong className="text-sm text-gray-500 dark:text-gray-400">Submitter Notes</strong>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 italic">{suggestion.notes}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="border-t pt-4 flex justify-between items-center">
                                    <p className="text-sm text-gray-500">
                                        Submitted by: {suggestion.submitter_name || 'Anonymous'}
                                    </p>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleApprove(suggestion)} className="btn btn-primary">Approve</button>
                                        <button onClick={() => handleDelete(suggestion.id)} className="btn btn-danger text-white">Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </DashboardLayout>
        </Layout>
    );
};

export default ManageSuggestionsPage;