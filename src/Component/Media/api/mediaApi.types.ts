export interface TmdbBaseSearchResultRaw {
  id: number;
  adult?: boolean;
  backdrop_path: string | null;
  genre_ids?: number[];
  original_language?: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  vote_average: number;
  vote_count: number;
}

export interface TmdbMovieSearchResultRaw extends TmdbBaseSearchResultRaw {
  media_type?: 'movie';
  original_title: string;
  release_date: string;
  title: string;
}

export interface TmdbTvSearchResultRaw extends TmdbBaseSearchResultRaw {
  media_type?: 'tv';
  first_air_date: string;
  name: string;
  original_name: string;
}

export interface TmdbCollectionSearchResultRaw {
  id: number;
  adult?: boolean;
  backdrop_path: string | null;
  name: string;
  original_name?: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
}

export interface TmdbSearchResponseRaw<ResultType> {
  page: number;
  results: ResultType[];
  total_pages: number;
  total_results: number;
}

export interface TmdbGenreRaw {
  id: number;
  name: string;
}

export interface TmdbSpokenLanguageRaw {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TmdbProductionCompanyRaw {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface TmdbVideoRaw {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

export interface TmdbVideosResponseRaw {
  results: TmdbVideoRaw[];
}

export interface TmdbMovieDetailRaw {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  popularity: number;
  vote_average: number;
  vote_count: number;
  homepage: string | null;
  tagline: string | null;
  status: string | null;
  genres: TmdbGenreRaw[];
  spoken_languages: TmdbSpokenLanguageRaw[];
  production_companies: TmdbProductionCompanyRaw[];
  runtime: number | null;
  videos?: TmdbVideosResponseRaw;
}

export interface TmdbSeasonSummaryRaw {
  air_date: string | null;
  episode_count: number;
  id: number;
  name: string;
  poster_path: string | null;
  season_number: number;
}

export interface TmdbTvDetailRaw {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  first_air_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  popularity: number;
  vote_average: number;
  vote_count: number;
  homepage: string | null;
  tagline: string | null;
  status: string | null;
  genres: TmdbGenreRaw[];
  spoken_languages: string[];
  production_companies: TmdbProductionCompanyRaw[];
  episode_run_time: number[];
  number_of_episodes: number | null;
  number_of_seasons: number | null;
  seasons: TmdbSeasonSummaryRaw[];
  videos?: TmdbVideosResponseRaw;
}

export interface TmdbCollectionPartRaw {
  adult?: boolean;
  backdrop_path: string | null;
  genre_ids?: number[];
  id: number;
  original_language?: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  title: string;
  vote_average: number;
  vote_count: number;
}

export interface TmdbCollectionDetailRaw {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: TmdbCollectionPartRaw[];
}

export interface TmdbRecommendationsResponseRaw<ResultType> {
  page: number;
  results: ResultType[];
  total_pages: number;
  total_results: number;
}
