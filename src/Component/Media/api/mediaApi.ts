import axios, { type AxiosRequestConfig } from 'axios';
import type {
  TmdbCollectionDetailRaw,
  TmdbCollectionSearchResultRaw,
  TmdbMovieDetailRaw,
  TmdbMovieSearchResultRaw,
  TmdbRecommendationsResponseRaw,
  TmdbSearchResponseRaw,
  TmdbTvDetailRaw,
  TmdbTvSearchResultRaw,
} from './mediaApi.types';
import type { MediaCatalogItem, MediaCategory, MediaDetail, MediaSearchResponse } from '../types/media.types';
import {
  normalizeCollectionDetailFromApi,
  normalizeCollectionFromApi,
  normalizeMovieDetailFromApi,
  normalizeMovieFromApi,
  normalizeTvDetailFromApi,
  normalizeTvFromApi,
} from '../utils/media-normalizers';
import { buildPokemonMediaQuery } from '../utils/media-query';

const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';
const MAX_PAGE_COUNT = 10;

interface SearchPokemonMediaParams {
  page: number;
  searchTerm: string;
  language: string;
}

interface GetMediaDetailParams {
  category: MediaCategory;
  language: string;
  tmdbId: number;
}

interface GetContextualPokemonMediaParams {
  category: MediaCategory;
  language: string;
  tmdbId: number;
}

function getTmdbApiKey(): string | undefined {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY?.trim();

  return apiKey ? apiKey : undefined;
}

function getTmdbAccessToken(): string | undefined {
  const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN?.trim();

  return accessToken ? accessToken : undefined;
}

function getTmdbRequestConfig(language: string, page: number): AxiosRequestConfig {
  const accessToken = getTmdbAccessToken();
  const apiKey = getTmdbApiKey();

  if (!accessToken && !apiKey) {
    throw new Error('TMDB credentials are missing. Add VITE_TMDB_API_KEY or VITE_TMDB_ACCESS_TOKEN.');
  }

  const params: Record<string, string | number | boolean> = {
    include_adult: false,
    language,
    page,
  };

  if (apiKey) {
    params.api_key = apiKey;
  }

  return {
    params,
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined,
  };
}

function mergeUniqueMediaItems(currentItems: MediaCatalogItem[], incomingItems: MediaCatalogItem[]): MediaCatalogItem[] {
  const itemsById = new Map<string, MediaCatalogItem>();

  [...currentItems, ...incomingItems].forEach((item) => {
    itemsById.set(item.id, item);
  });

  return [...itemsById.values()];
}

export async function searchPokemonMedia({
  page,
  searchTerm,
  language,
}: SearchPokemonMediaParams): Promise<MediaSearchResponse> {
  const query = buildPokemonMediaQuery(searchTerm);
  const requestConfig = getTmdbRequestConfig(language, page);

  const [movieResponse, tvResponse, collectionResponse] = await Promise.all([
    axios.get<TmdbSearchResponseRaw<TmdbMovieSearchResultRaw>>(`${TMDB_API_BASE_URL}/search/movie`, {
      ...requestConfig,
      params: {
        ...requestConfig.params,
        query,
      },
    }),
    axios.get<TmdbSearchResponseRaw<TmdbTvSearchResultRaw>>(`${TMDB_API_BASE_URL}/search/tv`, {
      ...requestConfig,
      params: {
        ...requestConfig.params,
        query,
      },
    }),
    axios.get<TmdbSearchResponseRaw<TmdbCollectionSearchResultRaw>>(`${TMDB_API_BASE_URL}/search/collection`, {
      ...requestConfig,
      params: {
        ...requestConfig.params,
        query,
      },
    }),
  ]);

  const movieItems = movieResponse.data.results.map((movie, index) => normalizeMovieFromApi(movie, index + 1));
  const tvItems = tvResponse.data.results.map((tvShow, index) => normalizeTvFromApi(tvShow, index + 1));
  const collectionItems = collectionResponse.data.results.map((collection, index) => (
    normalizeCollectionFromApi(collection, index + 1)
  ));

  const items = mergeUniqueMediaItems([], [...movieItems, ...tvItems, ...collectionItems]);
  const totalPages = Math.min(
    MAX_PAGE_COUNT,
    Math.max(
      movieResponse.data.total_pages,
      tvResponse.data.total_pages,
      collectionResponse.data.total_pages,
    ),
  );
  const totalResults =
    movieResponse.data.total_results +
    tvResponse.data.total_results +
    collectionResponse.data.total_results;

  return {
    items,
    hasMore: page < totalPages,
    totalResults,
  };
}

export async function getMediaDetail({
  category,
  language,
  tmdbId,
}: GetMediaDetailParams): Promise<MediaDetail> {
  const requestConfig = getTmdbRequestConfig(language, 1);

  if (category === 'movie') {
    const response = await axios.get<TmdbMovieDetailRaw>(`${TMDB_API_BASE_URL}/movie/${tmdbId}`, {
      ...requestConfig,
      params: {
        ...requestConfig.params,
        append_to_response: 'videos',
      },
    });

    return normalizeMovieDetailFromApi(response.data);
  }

  if (category === 'tv') {
    const response = await axios.get<TmdbTvDetailRaw>(`${TMDB_API_BASE_URL}/tv/${tmdbId}`, {
      ...requestConfig,
      params: {
        ...requestConfig.params,
        append_to_response: 'videos',
      },
    });

    return normalizeTvDetailFromApi(response.data);
  }

  const response = await axios.get<TmdbCollectionDetailRaw>(`${TMDB_API_BASE_URL}/collection/${tmdbId}`, requestConfig);

  return normalizeCollectionDetailFromApi(response.data);
}

function isPokemonMediaTitle(title: string): boolean {
  return /pok(?:e|é)mon/i.test(title);
}

export async function getContextualPokemonMedia({
  category,
  language,
  tmdbId,
}: GetContextualPokemonMediaParams): Promise<MediaCatalogItem[]> {
  const requestConfig = getTmdbRequestConfig(language, 1);

  if (category === 'collection') {
    return [];
  }

  if (category === 'movie') {
    const [recommendationsResponse, similarResponse] = await Promise.all([
      axios.get<TmdbRecommendationsResponseRaw<TmdbMovieSearchResultRaw>>(
        `${TMDB_API_BASE_URL}/movie/${tmdbId}/recommendations`,
        requestConfig,
      ),
      axios.get<TmdbRecommendationsResponseRaw<TmdbMovieSearchResultRaw>>(
        `${TMDB_API_BASE_URL}/movie/${tmdbId}/similar`,
        requestConfig,
      ),
    ]);

    return mergeUniqueMediaItems(
      recommendationsResponse.data.results
        .filter((item) => item.id !== tmdbId && isPokemonMediaTitle(item.title))
        .map((movie, index) => normalizeMovieFromApi(movie, index + 1)),
      similarResponse.data.results
        .filter((item) => item.id !== tmdbId && isPokemonMediaTitle(item.title))
        .map((movie, index) => normalizeMovieFromApi(movie, index + 1)),
    ).slice(0, 8);
  }

  const [recommendationsResponse, similarResponse] = await Promise.all([
    axios.get<TmdbRecommendationsResponseRaw<TmdbTvSearchResultRaw>>(
      `${TMDB_API_BASE_URL}/tv/${tmdbId}/recommendations`,
      requestConfig,
    ),
    axios.get<TmdbRecommendationsResponseRaw<TmdbTvSearchResultRaw>>(
      `${TMDB_API_BASE_URL}/tv/${tmdbId}/similar`,
      requestConfig,
    ),
  ]);

  return mergeUniqueMediaItems(
    recommendationsResponse.data.results
      .filter((item) => item.id !== tmdbId && isPokemonMediaTitle(item.name))
      .map((tvShow, index) => normalizeTvFromApi(tvShow, index + 1)),
    similarResponse.data.results
      .filter((item) => item.id !== tmdbId && isPokemonMediaTitle(item.name))
      .map((tvShow, index) => normalizeTvFromApi(tvShow, index + 1)),
  ).slice(0, 8);
}
