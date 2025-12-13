import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useForm, SubmitHandler } from 'react-hook-form';
import { submitIdiom } from '../lib/api';
import radixStyles from '../styles/RadixTabs.module.css';

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
          <p className="text-muted-foreground mb-8">Help us preserve Kashmiri culture. All submissions will be reviewed.</p>
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
          <fieldset className={radixStyles.Fieldset}>
            <label htmlFor="idiom_kashmiri" className={radixStyles.Label}>Kashmiri Idiom (in Perso-Arabic script)</label>
            <input id="idiom_kashmiri" {...register("idiom_kashmiri", {
              validate: (value) => {
                const transliterationValue = getValues("transliteration");
                if (!value && !transliterationValue) {
                  return "Please fill in either the Kashmiri or the Transliteration field.";
                }
                return true;
              }
            })}
              className={radixStyles.Input} />
            {errors.idiom_kashmiri && <p className="form-help-text" style={{ color: 'var(--color-danger)' }}>{errors.idiom_kashmiri.message}</p>}
          </fieldset>

          <fieldset className={radixStyles.Fieldset}>
            <label htmlFor="transliteration" className={radixStyles.Label}>Transliteration (in Roman script)</label>
            <input id="transliteration" {...register("transliteration", {
              validate: (value) => {
                const kashmiriValue = getValues("idiom_kashmiri");
                if (!value && !kashmiriValue) {
                  return "Please fill in either the Kashmiri or the Transliteration field.";
                }
                return true;
              }
            })} className={radixStyles.Input} />
          </fieldset>

          <fieldset className={radixStyles.Fieldset}>
            <label htmlFor="translation" className={radixStyles.Label}>Literal English Translation</label>
            <input id="translation" {...register("translation", { required: true })} className={radixStyles.Input} />
          </fieldset>

          <fieldset className={radixStyles.Fieldset}>
            <label htmlFor="meaning" className={radixStyles.Label}>Meaning & Context</label>
            <textarea id="meaning" {...register("meaning", { required: true })} className={radixStyles.Input} rows={4} style={{ height: 'auto', minHeight: '100px', paddingTop: '12px' }} />
            <p className="form-help-text mt-2 text-on-primary text-sm">Explain what the idiom means and when it might be used.</p>
          </fieldset>

          <div className="form-group mb-6">
            <label className={radixStyles.Label}>Tags / Categories (Optional)</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                className={radixStyles.Input}
                placeholder="e.g., Advice, Humor"
              />
              <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition">Add</button>
            </div>
            <div className="tag-display flex flex-wrap gap-2">
              {tags.map(tag => (
                <div key={tag} className="tag-removable bg-blue-600/20 text-blue-200 px-3 py-1 rounded-full flex items-center gap-2 text-sm border border-blue-500/30">
                  <span>{tag}</span>
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-white font-bold">×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 border-t pt-6 border-white/10 dark:border-white/10">
            <fieldset className={radixStyles.Fieldset}>
              <label htmlFor="submitter_name" className={radixStyles.Label}>Your Name (Optional)</label>
              <input id="submitter_name" {...register("submitter_name")} className={radixStyles.Input} />
            </fieldset>
            <fieldset className={radixStyles.Fieldset}>
              <label htmlFor="submitter_email" className={radixStyles.Label}>Your Email (Optional)</label>
              <input id="submitter_email" type="email" {...register("submitter_email")} className={radixStyles.Input} />
            </fieldset>
          </div>

          <div className="mt-8">
            <button type="submit" className={`${radixStyles.Button} ${radixStyles.ButtonBlue} w-full md:w-auto`} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Idiom'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default SubmitPage;