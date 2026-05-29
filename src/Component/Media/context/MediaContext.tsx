/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import type { MediaSortBy, MediaTypeFilter } from '../types/media.types';

const MEDIA_STORAGE_KEY = 'poke-media-preferences';
const DEFAULT_MEDIA_TYPE_FILTER: MediaTypeFilter = 'all';
const DEFAULT_MEDIA_SORT: MediaSortBy = 'relevance';

interface MediaPreferencesStorage {
  mediaTypeFilter: MediaTypeFilter;
  searchTerm: string;
  sortBy: MediaSortBy;
}

interface MediaInitialState {
  mediaTypeFilter: MediaTypeFilter;
  searchTerm: string;
  sortBy: MediaSortBy;
}

export interface MediaContextValue {
  mediaTypeFilter: MediaTypeFilter;
  searchTerm: string;
  setMediaTypeFilter: Dispatch<SetStateAction<MediaTypeFilter>>;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setSortBy: Dispatch<SetStateAction<MediaSortBy>>;
  sortBy: MediaSortBy;
  resetFilters: () => void;
}

const MediaContext = createContext<MediaContextValue | null>(null);

function sanitizeSearchTerm(value: string | null | undefined): string {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
}

function sanitizeMediaTypeFilter(value: string | null | undefined): MediaTypeFilter {
  return value === 'movie' || value === 'tv' || value === 'collection' ? value : DEFAULT_MEDIA_TYPE_FILTER;
}

function sanitizeMediaSortBy(value: string | null | undefined): MediaSortBy {
  return value === 'newest' ||
    value === 'oldest' ||
    value === 'rating' ||
    value === 'popularity' ||
    value === 'title'
    ? value
    : DEFAULT_MEDIA_SORT;
}

function getStoredPreferences(): MediaPreferencesStorage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawPreferences = window.localStorage.getItem(MEDIA_STORAGE_KEY);

  if (!rawPreferences) {
    return null;
  }

  try {
    const parsedPreferences = JSON.parse(rawPreferences) as Partial<MediaPreferencesStorage>;

    return {
      searchTerm: sanitizeSearchTerm(parsedPreferences.searchTerm),
      mediaTypeFilter: sanitizeMediaTypeFilter(parsedPreferences.mediaTypeFilter),
      sortBy: sanitizeMediaSortBy(parsedPreferences.sortBy),
    };
  } catch {
    return null;
  }
}

function getInitialState(searchParams: URLSearchParams): MediaInitialState {
  const storedPreferences = getStoredPreferences();

  return {
    searchTerm: sanitizeSearchTerm(searchParams.get('q')) || storedPreferences?.searchTerm || '',
    mediaTypeFilter: sanitizeMediaTypeFilter(searchParams.get('type') ?? storedPreferences?.mediaTypeFilter),
    sortBy: sanitizeMediaSortBy(searchParams.get('sort') ?? storedPreferences?.sortBy),
  };
}

export function useMediaContext(): MediaContextValue {
  const contextValue = useContext(MediaContext);

  if (!contextValue) {
    throw new Error('useMediaContext must be used inside MediaProvider.');
  }

  return contextValue;
}

interface MediaProviderProps {
  children: ReactNode;
}

export function MediaProvider({ children }: MediaProviderProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialState] = useState<MediaInitialState>(() => getInitialState(searchParams));
  const [searchTerm, setSearchTerm] = useState<string>(initialState.searchTerm);
  const [mediaTypeFilter, setMediaTypeFilter] = useState<MediaTypeFilter>(initialState.mediaTypeFilter);
  const [sortBy, setSortBy] = useState<MediaSortBy>(initialState.sortBy);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const preferencesToStore: MediaPreferencesStorage = {
      searchTerm,
      mediaTypeFilter,
      sortBy,
    };

    window.localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(preferencesToStore));
  }, [searchTerm, mediaTypeFilter, sortBy]);

  useEffect(() => {
    const nextSearchParams = new URLSearchParams();

    if (searchTerm.length > 0) {
      nextSearchParams.set('q', searchTerm);
    }

    if (mediaTypeFilter !== DEFAULT_MEDIA_TYPE_FILTER) {
      nextSearchParams.set('type', mediaTypeFilter);
    }

    if (sortBy !== DEFAULT_MEDIA_SORT) {
      nextSearchParams.set('sort', sortBy);
    }

    if (nextSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(nextSearchParams, { replace: true });
    }
  }, [mediaTypeFilter, searchParams, searchTerm, setSearchParams, sortBy]);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setMediaTypeFilter(DEFAULT_MEDIA_TYPE_FILTER);
    setSortBy(DEFAULT_MEDIA_SORT);
  }, []);

  const contextValue = useMemo<MediaContextValue>(() => ({
    searchTerm,
    setSearchTerm,
    mediaTypeFilter,
    setMediaTypeFilter,
    sortBy,
    setSortBy,
    resetFilters,
  }), [
    searchTerm,
    mediaTypeFilter,
    sortBy,
    resetFilters,
  ]);

  return (
    <MediaContext.Provider value={contextValue}>
      {children}
    </MediaContext.Provider>
  );
}
