
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface AllIdiomsProps {
  onUpdate: () => void;
}

interface Idiom {
  id: number;
  idiom_kashmiri: string;
  transliteration: string;
  translation: string;
  meaning: string;
  tags: string[];
  contributor: string;
  notes?: string;
  created_at: string;
}

const AllIdioms: React.FC<AllIdiomsProps> = ({ onUpdate }) => {
  const [idioms, setIdioms] = useState<Idiom[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Idiom | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchIdioms();
  }, []);

  const fetchIdioms = async () => {
    try {
      const { data, error } = await supabase
          .from('idioms')
          .select('*')
          .order('created_at', { ascending: false });

      if (error) throw error;
      setIdioms(data || []);
    } catch (error) {
      console.error('Error fetching idioms:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... (keep the existing handleEdit, handleCancelEdit, handleUpdate, handleDelete functions)

  const filteredIdioms = idioms.filter(idiom =>
      idiom.idiom_kashmiri.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idiom.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idiom.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idiom.meaning.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-4">Loading idioms...</div>;
  }

  return (
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">All Idioms</h2>
          <div className="relative w-full md:w-64">
            <input
                type="text"
                placeholder="Search idioms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input w-full pl-8"
            />
            <svg
                className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdioms.map((idiom) => (
              <div
                  key={idiom.id}
                  className={`idiom-card transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg
              ${editingId === idiom.id ? 'ring-2 ring-primary ring-opacity-50' : ''}`}
              >
                {editingId === idiom.id ? (
                    <div className="p-6 space-y-4">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Kashmiri Text</label>
                          <input
                              type="text"
                              value={editForm?.idiom_kashmiri || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev!, idiom_kashmiri: e.target.value }))}
                              className="form-input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Transliteration</label>
                          <input
                              type="text"
                              value={editForm?.transliteration || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev!, transliteration: e.target.value }))}
                              className="form-input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Translation</label>
                          <input
                              type="text"
                              value={editForm?.translation || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev!, translation: e.target.value }))}
                              className="form-input w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Meaning</label>
                          <textarea
                              value={editForm?.meaning || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev!, meaning: e.target.value }))}
                              className="form-textarea w-full"
                              rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4 border-t">
                        <button
                            onClick={handleCancelEdit}
                            className="btn btn-secondary"
                        >
                          Cancel
                        </button>
                        <button
                            onClick={() => handleUpdate(idiom.id)}
                            className="btn btn-primary"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                ) : (
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="border-b pb-4">
                          <h3 className="text-lg font-bold text-primary mb-2">
                            {idiom.idiom_kashmiri}
                          </h3>
                          <p className="text-gray-600 italic">
                            {idiom.transliteration}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <h4 className="text-sm font-semibold text-gray-500">Translation</h4>
                            <p>{idiom.translation}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-gray-500">Meaning</h4>
                            <p className="text-gray-700">{idiom.meaning}</p>
                          </div>
                        </div>

                        {idiom.tags && idiom.tags.length > 0 && (
                            <div className="pt-4">
                              <div className="flex flex-wrap gap-2">
                                {idiom.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-600"
                                    >
                            {tag}
                          </span>
                                ))}
                              </div>
                            </div>
                        )}

                        <div className="pt-4 border-t mt-4">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              <p>By {idiom.contributor}</p>
                              <p>{new Date(idiom.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex space-x-3">
                              <button
                                  onClick={() => handleDelete(idiom.id)}
                                  className="btn-icon-large btn-danger flex items-center gap-2"
                                  title="Delete"
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Delete</span>
                              </button>
                              <button
                                  onClick={() => handleEdit(idiom)}
                                  className="btn-icon-large btn-secondary flex items-center gap-2"
                                  title="Edit"
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Edit</span>
                              </button>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                )}
              </div>
          ))}
        </div>
      </div>
  );
};

export default AllIdioms;