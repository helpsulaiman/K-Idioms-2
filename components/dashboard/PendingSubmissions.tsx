
import React, { useState, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

interface PendingSubmissionsProps {
  onUpdate: () => void;
}

interface IdiomSubmission {
  id: number;
  idiom_kashmiri: string;
  transliteration: string;
  translation: string;
  meaning: string;
  tags: string[];
  submitter_name: string;
  notes?: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

const PendingSubmissions: React.FC<PendingSubmissionsProps> = ({ onUpdate }) => {
  const [submissions, setSubmissions] = useState<IdiomSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchPendingSubmissions();
  }, []);

  const fetchPendingSubmissions = async () => {
    try {
      const { data, error } = await supabase
          .from('submissions')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      // First, get the submission data
      const { data: submission } = await supabase
          .from('submissions')
          .select('*')
          .eq('id', id)
          .single();

      if (!submission) throw new Error('Submission not found');

      // Create new idiom entry
      const { error: idiomError } = await supabase
          .from('idioms')
          .insert([{
            idiom_kashmiri: submission.idiom_kashmiri,
            transliteration: submission.transliteration,
            translation: submission.translation,
            meaning: submission.meaning,
            tags: submission.tags,
            contributor: submission.submitter_name,
            notes: submission.notes
          }]);

      if (idiomError) throw idiomError;

      // Update submission status
      const { error: updateError } = await supabase
          .from('submissions')
          .update({ status: 'approved' })
          .eq('id', id);

      if (updateError) throw updateError;

      fetchPendingSubmissions();
      onUpdate();
    } catch (error) {
      console.error('Error approving submission:', error);
      alert('Failed to approve submission');
    }
  };

  const handleReject = async (id: number) => {
    try {
      const { error } = await supabase
          .from('submissions')
          .update({ status: 'rejected' })
          .eq('id', id);

      if (error) throw error;

      fetchPendingSubmissions();
      onUpdate();
    } catch (error) {
      console.error('Error rejecting submission:', error);
      alert('Failed to reject submission');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading submissions...</div>;
  }

  return (
      <div>
        <h2 className="text-xl font-bold mb-4">Pending Submissions</h2>
        {submissions.length === 0 ? (
            <p className="text-gray-500">No pending submissions</p>
        ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                  <div key={submission.id} className="border rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold">Kashmiri Text</h3>
                        <p>{submission.idiom_kashmiri || '(Not provided)'}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Transliteration</h3>
                        <p>{submission.transliteration || '(Not provided)'}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Translation</h3>
                        <p>{submission.translation || '(Not provided)'}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Meaning</h3>
                        <p>{submission.meaning}</p>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            Submitted by: {submission.submitter_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Date: {new Date(submission.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="space-x-2">
                          <button
                              onClick={() => handleReject(submission.id)}
                              className="btn btn-danger"
                          >
                            Reject
                          </button>
                          <button
                              onClick={() => handleApprove(submission.id)}
                              className="btn btn-success"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

export default PendingSubmissions;