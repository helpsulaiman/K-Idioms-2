// pages/api/suggestions.ts
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createServerSupabaseClient({ req, res });

    if (req.method === 'GET') {
        // Fetch all suggestions
        const { data, error } = await supabase.from('suggestions').select('*').order('created_at');
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json(data);
    }

    else if (req.method === 'POST') {
        // This is the APPROVE action
        const suggestion = req.body;
        const { id, created_at, ...newIdiom } = suggestion; // Exclude suggestion-specific fields

        // 1. Insert the approved suggestion into the main 'idioms' table
        const { error: insertError } = await supabase.from('idioms').insert({ ...newIdiom, status: 'approved' });
        if (insertError) {
            return res.status(500).json({ error: `Failed to insert into idioms: ${insertError.message}` });
        }

        // 2. If insert is successful, delete from the 'suggestions' table
        const { error: deleteError } = await supabase.from('suggestions').delete().eq('id', id);
        if (deleteError) {
            // The idiom was approved, but we failed to clean up the queue.
            // It's not a critical failure, but should be noted.
            return res.status(500).json({ error: `Failed to delete from suggestions: ${deleteError.message}` });
        }

        return res.status(200).json({ message: 'Suggestion approved successfully' });
    }

    else if (req.method === 'DELETE') {
        // This is the REJECT/DELETE action
        const { id } = req.body;
        const { error } = await supabase.from('suggestions').delete().eq('id', id);
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ message: 'Suggestion deleted successfully' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
}