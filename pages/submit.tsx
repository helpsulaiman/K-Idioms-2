import React, { useState } from 'react';
import Layout from '../components/Layout';
import { IdiomSubmission } from '../types/idiom';
import { submitIdiom } from '../lib/api';

const SubmitPage: React.FC = () => {
  const [formData, setFormData] = useState<IdiomSubmission>({
    idiom_kashmiri: '',
    transliteration: '',
    translation: '',
    meaning: '',
    tags: [],
    submitter_name: '',
    submitter_email: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleBlur = (fieldName: string) => {
    setTouchedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouchedFields({
      idiom_kashmiri: true,
      transliteration: true,
      meaning: true,
      submitter_name: true
    });

    const hasKashmiriOrTransliteration = formData.idiom_kashmiri.trim() || formData.transliteration.trim();

    if (!hasKashmiriOrTransliteration || !formData.meaning.trim() || !formData.submitter_name.trim()) {
      if (!formData.meaning.trim()) {
        setErrorMessage('Please provide the meaning of the idiom.');
        return;
      }
      if (!formData.submitter_name.trim()) {
        setErrorMessage('Please provide your name.');
        return;
      }
      if (!hasKashmiriOrTransliteration) {
        setErrorMessage('Please provide either Kashmiri text OR transliteration.');
        return;
      }
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitStatus('idle');
      setErrorMessage('');

      await submitIdiom(formData);

      setSubmitStatus('success');
      setFormData({
        idiom_kashmiri: '',
        transliteration: '',
        translation: '',
        meaning: '',
        tags: [],
        submitter_name: '',
        submitter_email: '',
        notes: ''
      });

      setTouchedFields({}); // Reset touched fields
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit idiom');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <Layout 
      title="Submit an Idiom - Kashmiri Idioms"
      description="Help preserve Kashmiri culture by submitting traditional idioms for our collection."
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Submit an Idiom</h1>
            <p className="text-gray-600">
              Help us preserve Kashmiri cultural heritage by contributing idioms you know. 
              All submissions will be reviewed before being added to our collection.
            </p>
          </div>

          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Thank you! Your idiom has been submitted successfully and is pending review.
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="card">
            <div className="form-group">
              <label htmlFor="idiom_kashmiri" className="form-label">
                Kashmiri Text
              </label>
              <input
                  type="text"
                  id="idiom_kashmiri"
                  name="idiom_kashmiri"
                  value={formData.idiom_kashmiri}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('idiom_kashmiri')}
                  className={`form-input ${
                      touchedFields.idiom_kashmiri &&
                      !formData.idiom_kashmiri.trim() &&
                      !formData.transliteration.trim()
                          ? 'border-red-500'
                          : ''
                  }`}
                  placeholder="Enter the idiom in Kashmiri"
              />
            </div>

            <div className="form-group">
              <label htmlFor="transliteration" className="form-label">
                Transliteration
              </label>
              <input
                  type="text"
                  id="transliteration"
                  name="transliteration"
                  value={formData.transliteration}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('transliteration')}
                  className={`form-input ${
                      touchedFields.transliteration &&
                      !formData.transliteration.trim() &&
                      !formData.idiom_kashmiri.trim()
                          ? 'border-red-500'
                          : ''
                  }`}
                  placeholder="Enter the transliteration in English"
              />
              <p className="text-sm text-gray-500 mt-1">
                * Either Kashmiri text OR transliteration is required
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="meaning" className="form-label">
                Meaning/Moral *
              </label>
              <textarea
                  id="meaning"
                  name="meaning"
                  value={formData.meaning}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('meaning')}
                  className={`form-textarea ${
                      touchedFields.meaning && !formData.meaning.trim()
                          ? 'border-red-500'
                          : ''
                  }`}
                  placeholder="Explain the meaning, moral, or context of this idiom"
                  rows={4}
                  required
              />
            </div>



            <div className="form-group">
              <label htmlFor="submitter_name" className="form-label">
                Your Name *
              </label>
              <input
                type="text"
                id="submitter_name"
                name="submitter_name"
                value={formData.submitter_name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="submitter_email" className="form-label">
                Email (Optional)
              </label>
              <input
                type="email"
                id="submitter_email"
                name="submitter_email"
                value={formData.submitter_email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your email for updates"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Any additional context or notes about this idiom"
                rows={3}
              />
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit Idiom'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitPage;