import { useState } from 'react';
import { Idiom } from '@/types/idiom';
import { supabase } from '@/lib/supabaseClient';

const AllIdioms = ({ onUpdate }: { onUpdate?: () => void }) => {
  const [editingIdiom, setEditingIdiom] = useState<Idiom | null>(null);

  const handleEdit = (idiom: Idiom) => {
    setEditingIdiom(idiom);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this idiom?')) return;

    try {
      const { error } = await supabase
          .from('idioms')
          .delete()
          .eq('id', id);

      if (error) throw error;

      // Refresh the list
      onUpdate?.();
      alert('Idiom deleted successfully!');
    } catch (error) {
      console.error('Error deleting idiom:', error);
      alert('Error deleting idiom. Please try again.');
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingIdiom) return;

    try {
      const { error } = await supabase
          .from('idioms')
          .update({
            idiom_kashmiri: editingIdiom.idiom_kashmiri,
            transliteration: editingIdiom.transliteration,
            translation: editingIdiom.translation,
            meaning: editingIdiom.meaning,
            tags: editingIdiom.tags,
          })
          .eq('id', id);

      if (error) throw error;

      // Refresh the list and close modal
      onUpdate?.();
      setEditingIdiom(null);
      alert('Idiom updated successfully!');
    } catch (error) {
      console.error('Error updating idiom:', error);
      alert('Error updating idiom. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setEditingIdiom(null);
  };




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

        {editingIdiom && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                {/* ... form fields */}
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <button
                      onClick={handleCancelEdit}
                      className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={() => handleUpdate(editingIdiom.id)}
                      className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default AllIdioms;