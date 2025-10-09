import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useForm, SubmitHandler } from 'react-hook-form';
import { submitIdiom } from '../lib/api';

// Define the shape of our form data
type FormInputs = {
  idiom_kashmiri: string;
  transliteration: string;
  translation: string;
  meaning: string;
  submitter_name: string;
  submitter_email: string;
};

const SubmitPage: React.FC = () => {
  const { register, handleSubmit, reset, getValues, formState: { errors } } = useForm<FormInputs>();

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await submitIdiom({ ...data, tags, notes: '' });
      setSubmitStatus('success');
      reset();
      setTags([]);
    } catch (error) {
      setSubmitStatus('error');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag) && tags.length < 5) {
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
      <Layout
          title="Submit an Idiom - Kashmiri Idioms"
          description="Contribute to our collection by submitting a Kashmiri idiom you know."
      >
        <div className="form-container">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Submit an Idiom</h1>
            <p className="text-secondary mb-8">Help us preserve Kashmiri culture. All submissions will be reviewed.</p>
          </div>

          {submitStatus === 'success' && (
              <div className="p-4 mb-6 bg-green-100 text-green-800 rounded-lg text-center">
                Thank you! Your submission has been received.
              </div>
          )}
          {submitStatus === 'error' && (
              <div className="p-4 mb-6 bg-red-100 text-red-800 rounded-lg text-center">
                Something went wrong. Please try submitting again.
              </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="idiom_kashmiri" className="form-label">Kashmiri Idiom (in Perso-Arabic script)</label>
              <input id="idiom_kashmiri" {...register("idiom_kashmiri", {
                // UPDATED: Custom validation logic
                validate: (value) => {
                  const transliterationValue = getValues("transliteration");
                  if (!value && !transliterationValue) {
                    return "Please fill in either the Kashmiri or the Transliteration field.";
                  }
                  return true;
                }
              })}
              className="form-input" />
              {errors.idiom_kashmiri && <p className="form-help-text" style={{color: 'var(--color-danger)'}}>{errors.idiom_kashmiri.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="transliteration" className="form-label">Transliteration (in Roman script)</label>
              <input id="transliteration" {...register("transliteration", {
                // UPDATED: Custom validation logic
                validate: (value) => {
                  const kashmiriValue = getValues("idiom_kashmiri");
                  if (!value && !kashmiriValue) {
                    return "Please fill in either the Kashmiri or the Transliteration field.";
                  }
                  return true;
                }
              })}  className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="translation" className="form-label">Literal English Translation</label>
              <input id="translation" {...register("translation", { required: true })} className="form-input" />
            </div>

            <div className="form-group">
              <label htmlFor="meaning" className="form-label">Meaning & Context</label>
              <textarea id="meaning" {...register("meaning", { required: true })} className="form-textarea" rows={4} />
              <p className="form-help-text">Explain what the idiom means and when it might be used.</p>
            </div>

            <div className="form-group">
              <label className="form-label">Tags / Categories (Optional)</label>
              <div className="tag-input-row">
                <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                    className="form-input"
                    placeholder="e.g., Advice, Humor"
                />
                <button type="button" onClick={handleAddTag} className="btn btn-secondary">Add Tag</button>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-t pt-6 border-gray-200 dark:border-gray-700">
              <div className="form-group">
                <label htmlFor="submitter_name" className="form-label">Your Name (Optional)</label>
                <input id="submitter_name" {...register("submitter_name")} className="form-input" />
              </div>
              <div className="form-group">
                <label htmlFor="submitter_email" className="form-label">Your Email (Optional)</label>
                <input id="submitter_email" type="email" {...register("submitter_email")} className="form-input" />
              </div>
            </div>

            <div className="mt-8">
              <button type="submit" className="btn btn-primary w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Idiom'}
              </button>
            </div>
          </form>
        </div>
      </Layout>
  );
};

export default SubmitPage;