export interface Idiom {
  id: string;
  idiom_kashmiri: string;
  transliteration: string;
  translation: string;
  meaning: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
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

export interface Suggestion {
  id: string;
  created_at: string;
  idiom_kashmiri: string;
  transliteration: string;
  translation: string;
  meaning: string;
  tags: string[];
  submitter_name: string;
  submitter_email?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SearchFilters {
  query: string;
  tags: string[];
}