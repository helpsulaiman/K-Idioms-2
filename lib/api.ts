import { supabase } from './supabase';
import { Idiom, IdiomSubmission, SearchFilters, Suggestion } from '../types/idiom';

export class ApiError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Fetch all idioms
export async function fetchIdioms(): Promise<Idiom[]> {
  try {
    const { data, error } = await supabase
      .from('idioms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new ApiError(`Failed to fetch idioms: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching idioms:', error);
    throw error instanceof ApiError ? error : new ApiError('Failed to fetch idioms');
  }
}

// Search idioms
export async function searchIdioms(filters: SearchFilters): Promise<Idiom[]> {
  try {
    let query = supabase
      .from('idioms')
      .select('*')
      .order('created_at', { ascending: false });

    // Search across multiple fields
    if (filters.query.trim()) {
      const searchTerm = `%${filters.query.trim()}%`;
      query = query.or(
        `idiom_kashmiri.ilike.${searchTerm},transliteration.ilike.${searchTerm},translation.ilike.${searchTerm},meaning.ilike.${searchTerm}`
      );
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      query = query.overlaps('tags', filters.tags);
    }

    const { data, error } = await query;

    if (error) {
      throw new ApiError(`Failed to search idioms: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error searching idioms:', error);
    throw error instanceof ApiError ? error : new ApiError('Failed to search idioms');
  }
}

// Get unique tags
export async function fetchTags(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('idioms')
      .select('tags');

    if (error) {
      throw new ApiError(`Failed to fetch tags: ${error.message}`);
    }

    // Extract unique tags from all idioms
    const allTags = new Set<string>();
    data?.forEach(idiom => {
      if (Array.isArray(idiom.tags)) {
        idiom.tags.forEach(tag => allTags.add(tag));
      }
    });

    return Array.from(allTags).sort();
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error instanceof ApiError ? error : new ApiError('Failed to fetch tags');
  }
}

// Submit new idiom suggestion
export async function submitIdiom(submission: IdiomSubmission): Promise<void> {
  try {
    const { error } = await supabase
      .from('suggestions')
      .insert([{
        idiom_kashmiri: submission.idiom_kashmiri,
        transliteration: submission.transliteration,
        translation: submission.translation,
        meaning: submission.meaning,
        tags: submission.tags,
        submitter_name: submission.submitter_name,
        submitter_email: submission.submitter_email,
        notes: submission.notes,
        status: 'pending'
      }]);

    if (error) {
      throw new ApiError(`Failed to submit idiom: ${error.message}`);
    }
  } catch (error) {
    console.error('Error submitting idiom:', error);
    throw error instanceof ApiError ? error : new ApiError('Failed to submit idiom');
  }
}

// Get idiom by ID
export async function fetchIdiomById(id: string): Promise<Idiom | null> {
  try {
    const { data, error } = await supabase
      .from('idioms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new ApiError(`Failed to fetch idiom: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching idiom by ID:', error);
    throw error instanceof ApiError ? error : new ApiError('Failed to fetch idiom');
  }
}

// Fetch all suggestions (for dashboard)
export async function fetchSuggestions(): Promise<Suggestion[]> {
  try {
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new ApiError(`Failed to fetch suggestions: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error instanceof ApiError ? error : new ApiError('Failed to fetch suggestions');
  }
}

// Update suggestion status
export async function updateSuggestionStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
  try {
    const { error } = await supabase
      .from('suggestions')
      .update({ status })
      .eq('id', id);

    if (error) {
      throw new ApiError(`Failed to update suggestion: ${error.message}`);
    }
  } catch (error) {
    console.error('Error updating suggestion:', error);
    throw error instanceof ApiError ? error : new ApiError('Failed to update suggestion');
  }
}