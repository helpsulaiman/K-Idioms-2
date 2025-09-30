// types/idiom.ts

export interface Idiom {
  id: string; // Changed to string to match Supabase UUID
  idiom_kashmiri: string;
  transliteration: string;
  translation: string;
  meaning: string;
  tags: string[];
  audio_url?: string;
  created_at?: string;
  status?: 'approved' | 'pending' | 'rejected';

  // Optional fields from the suggestions table
  submitter_name?: string;
  submitter_email?: string;
  notes?: string;
}

export interface IdiomSubmission {
  idiom_kashmiri: string;
  transliteration: string;
  translation: string;
  meaning: string;
  tags: string[];
  submitter_name: string;
  submitter_email: string;
  notes: string;
}

// You can now remove the separate Suggestion type if you wish,
// as the updated Idiom type can handle both cases.
export interface Suggestion extends Idiom {}

export interface SearchFilters {
  query: string;
  tags: string[];
}