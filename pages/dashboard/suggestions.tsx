// pages/dashboard/suggestions.tsx
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

interface Suggestion {
    id: string;
    idiom_kashmiri: string;
    meaning: string;
    submitter_name: string;
    // Add any other fields you want to display
}

const ManageSuggestionsPage: React.FC = () => {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

    const fetchSuggestions = async () => {
        const res = await fetch('/api/suggestions');
        const data = await res.json();
        setSuggestions(data);
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
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Manage Suggestions</h1>
                {suggestions.length === 0 ? (
                    <p>No pending suggestions.</p>
                ) : (
                    <div className="space-y-4">
                        {suggestions.map((suggestion) => (
                            <div key={suggestion.id} className="p-4 border rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-bold">{suggestion.idiom_kashmiri}</p>
                                    <p className="text-sm text-gray-600">{suggestion.meaning}</p>
                                    <p className="text-xs text-gray-500 mt-1">Submitted by: {suggestion.submitter_name || 'Anonymous'}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleApprove(suggestion)} className="btn btn-primary">Approve</button>
                                    <button onClick={() => handleDelete(suggestion.id)} className="btn btn-danger text-white">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ManageSuggestionsPage;