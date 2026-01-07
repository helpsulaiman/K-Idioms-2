import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useForm, SubmitHandler } from 'react-hook-form';
import { submitIdiom } from '../lib/api';
import { ArrowLeft, ArrowRight, Check, Sparkles, User, Send } from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';

type FormInputs = {
  idiom_kashmiri: string;
  transliteration: string;
  translation: string;
  meaning: string;
  submitter_name: string;
  submitter_email: string;
};

const STEPS = [
  { id: 1, title: 'Idiom', icon: '📝' },
  { id: 2, title: 'Details', icon: '💡' },
  { id: 3, title: 'About You', icon: '👤' },
];

const SubmitPage: React.FC = () => {
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormInputs>();
  const [currentStep, setCurrentStep] = useState(1);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  // Watch form values for live preview
  const watchedValues = watch();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await submitIdiom({ ...data, tags, notes: '' });
      setSubmitStatus('success');
      reset();
      setTags([]);
      setCurrentStep(1);
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

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return watchedValues.idiom_kashmiri || watchedValues.transliteration;
    }
    if (currentStep === 2) {
      return watchedValues.translation && watchedValues.meaning;
    }
    return true;
  };

  return (
    <Layout title="Submit an Idiom - KashWords" fullWidth={true}>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-6 shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Submit an Idiom</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Help preserve Kashmiri culture. Your submission will be reviewed before publishing.
            </p>
          </div>

          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <div className="max-w-2xl mx-auto mb-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Thank You!</h3>
              <p className="text-muted-foreground">Your idiom has been submitted for review.</p>
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="max-w-2xl mx-auto mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-center">
              <p className="text-red-600 dark:text-red-400">Something went wrong. Please try again.</p>
            </div>
          )}

          {/* Step Progress */}
          <div className="max-w-md mx-auto mb-12">
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-border rounded-full" />
              <div
                className="absolute top-5 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />

              {STEPS.map((step) => (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                    disabled={step.id > currentStep}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300 ${step.id === currentStep
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-110'
                      : step.id < currentStep
                        ? 'bg-indigo-500 text-white'
                        : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {step.id < currentStep ? <Check className="w-5 h-5" /> : step.icon}
                  </button>
                  <span className={`mt-2 text-sm font-medium ${step.id === currentStep ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content - Form + Preview */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Form */}
            <div className="order-2 lg:order-1">
              <div className="bg-card border border-border rounded-3xl p-8">
                {/* Step 1: Idiom */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Kashmiri Idiom <span className="text-muted-foreground font-normal">(Perso-Arabic)</span>
                      </label>
                      <input
                        {...register("idiom_kashmiri")}
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-kashmiri"
                        placeholder="کٔشِیر محاورہ"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Transliteration <span className="text-muted-foreground font-normal">(Roman script)</span>
                      </label>
                      <input
                        {...register("transliteration")}
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        placeholder="Koshur mahaavrah"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground bg-muted/50 px-4 py-3 rounded-xl">
                      💡 Fill in at least one of the fields above. If you only know one, that's okay!
                    </p>
                  </div>
                )}

                {/* Step 2: Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Literal Translation <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("translation", { required: true })}
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        placeholder="What does it literally mean in English?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Meaning & Context <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        {...register("meaning", { required: true })}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none"
                        placeholder="Explain when this idiom is used and what it truly means..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Tags <span className="text-muted-foreground font-normal">(optional)</span>
                      </label>
                      <div className="flex gap-2 mb-3">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                          className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                          placeholder="e.g., Advice, Humor"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors"
                        >
                          Add
                        </button>
                      </div>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map(tag => (
                            <span key={tag} className="px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-sm flex items-center gap-2 border border-indigo-500/20">
                              {tag}
                              <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-indigo-800 dark:hover:text-indigo-200">×</button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: About You */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl mb-6">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        This info is optional. We may use it to credit you or follow up.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Your Name</label>
                      <input
                        {...register("submitter_name")}
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        placeholder="How should we know you?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Your Email</label>
                      <input
                        type="email"
                        {...register("submitter_email")}
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-border">
                  <button
                    type="button"
                    onClick={prevStep}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border border-border hover:bg-muted transition-colors ${currentStep === 1 ? 'invisible' : ''
                      }`}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!canProceed()}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 transition-all"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                      <Send className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-24">
              <div className="text-center mb-4">
                <span className="text-sm font-medium text-muted-foreground">Live Preview</span>
              </div>
              <SpotlightCard className="bg-card border border-border rounded-xl p-6">
                <div className="space-y-3">
                  <div className="text-kashmiri text-xl font-bold text-primary" dir="rtl">
                    {watchedValues.idiom_kashmiri || 'کٔشِیر محاورہ'}
                  </div>
                  <div className="text-lg italic text-muted-foreground">
                    {watchedValues.transliteration || 'Transliteration will appear here'}
                  </div>
                  <div className="text-base">
                    {watchedValues.translation || 'Literal translation...'}
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Back of card preview */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">💡 MEANING</h4>
                  <p className="text-sm text-muted-foreground">
                    {watchedValues.meaning || 'The meaning and context will appear here when the card is flipped...'}
                  </p>
                </div>
              </SpotlightCard>
              <p className="text-center text-xs text-muted-foreground mt-4">
                This is how your idiom will appear in the collection
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitPage;