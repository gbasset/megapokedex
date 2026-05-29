export type MediaCategory = 'movie' | 'tv' | 'collection';
export type MediaTypeFilter = 'all' | MediaCategory;
export type MediaSortBy = 'relevance' | 'newest' | 'oldest' | 'rating' | 'popularity' | 'title';

export interface MediaCatalogItem {
  id: string;
  tmdbId: number;
  category: MediaCategory;
  title: string;
  originalTitle: string;
  overview: string;
  releaseDate: string | null;
  releaseYear: number | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  popularity: number;
  voteAverage: number | null;
  voteCount: number | null;
  tmdbUrl: string;
  searchRank: number;
}

export interface MediaSearchResponse {
  items: MediaCatalogItem[];
  hasMore: boolean;
  totalResults: number;
}

export interface MediaFilterOption<ValueType extends string> {
  value: ValueType;
  label: string;
}

export interface MediaDetailVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  publishedAt: string | null;
  url: string | null;
}

export interface MediaRelatedItem {
  id: string;
  tmdbId: number;
  title: string;
  category: MediaCategory;
  posterUrl: string | null;
  releaseYear: number | null;
}

export interface MediaPokemonHighlight {
  pokemonId: number;
  label: string;
  note: string;
}

export interface MediaDetail {
  id: string;
  tmdbId: number;
  category: MediaCategory;
  title: string;
  originalTitle: string;
  overview: string;
  releaseDate: string | null;
  releaseYear: number | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  popularity: number;
  voteAverage: number | null;
  voteCount: number | null;
  tmdbUrl: string;
  homepage: string | null;
  tagline: string | null;
  status: string | null;
  genres: string[];
  spokenLanguages: string[];
  productionCompanies: string[];
  runtimeMinutes: number | null;
  numberOfSeasons: number | null;
  numberOfEpisodes: number | null;
  relatedItems: MediaRelatedItem[];
  videos: MediaDetailVideo[];
}
