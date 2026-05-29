import type {
  TmdbCollectionDetailRaw,
  TmdbCollectionSearchResultRaw,
  TmdbMovieDetailRaw,
  TmdbMovieSearchResultRaw,
  TmdbSpokenLanguageRaw,
  TmdbTvDetailRaw,
  TmdbTvSearchResultRaw,
  TmdbVideoRaw,
} from '../api/mediaApi.types';
import type { MediaCatalogItem, MediaCategory, MediaDetail, MediaDetailVideo, MediaRelatedItem } from '../types/media.types';

const TMDB_POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w780';
const TMDB_SITE_BASE_URL = 'https://www.themoviedb.org';

export function buildTmdbImageUrl(path: string | null, baseUrl: string): string | null {
  return typeof path === 'string' && path.length > 0 ? `${baseUrl}${path}` : null;
}

export function getReleaseYear(releaseDate: string | null): number | null {
  if (!releaseDate) {
    return null;
  }

  const year = Number(releaseDate.slice(0, 4));

  return Number.isFinite(year) ? year : null;
}

function buildMediaItemBase(
  tmdbId: number,
  category: MediaCategory,
  title: string,
  originalTitle: string,
  overview: string,
  releaseDate: string | null,
  posterPath: string | null,
  backdropPath: string | null,
  popularity: number,
  voteAverage: number | null,
  voteCount: number | null,
  searchRank: number,
): MediaCatalogItem {
  return {
    id: `${category}-${tmdbId}`,
    tmdbId,
    category,
    title,
    originalTitle,
    overview,
    releaseDate,
    releaseYear: getReleaseYear(releaseDate),
    posterUrl: buildTmdbImageUrl(posterPath, TMDB_POSTER_BASE_URL),
    backdropUrl: buildTmdbImageUrl(backdropPath, TMDB_BACKDROP_BASE_URL),
    popularity,
    voteAverage,
    voteCount,
    tmdbUrl: `${TMDB_SITE_BASE_URL}/${category}/${tmdbId}`,
    searchRank,
  };
}

function normalizeSpokenLanguages(languages: TmdbSpokenLanguageRaw[] | undefined): string[] {
  if (!languages) {
    return [];
  }

  return languages
    .map((language) => language.english_name || language.name)
    .filter((label): label is string => typeof label === 'string' && label.length > 0);
}

function normalizeVideos(videos: TmdbVideoRaw[] | undefined): MediaDetailVideo[] {
  if (!videos) {
    return [];
  }

  return videos
    .filter((video) => typeof video.key === 'string' && video.key.length > 0)
    .map((video) => ({
      id: video.id,
      key: video.key,
      name: video.name,
      site: video.site,
      type: video.type,
      publishedAt: video.published_at || null,
      url: video.site === 'YouTube' ? `https://www.youtube.com/watch?v=${video.key}` : null,
    }));
}

function normalizeRelatedMovieItem(
  tmdbId: number,
  title: string,
  posterPath: string | null,
  releaseDate: string | null,
): MediaRelatedItem {
  return {
    id: `movie-${tmdbId}`,
    tmdbId,
    title,
    category: 'movie',
    posterUrl: buildTmdbImageUrl(posterPath, TMDB_POSTER_BASE_URL),
    releaseYear: getReleaseYear(releaseDate),
  };
}

export function normalizeMovieFromApi(
  movie: TmdbMovieSearchResultRaw,
  searchRank: number,
): MediaCatalogItem {
  return buildMediaItemBase(
    movie.id,
    'movie',
    movie.title,
    movie.original_title,
    movie.overview,
    movie.release_date || null,
    movie.poster_path,
    movie.backdrop_path,
    movie.popularity,
    movie.vote_average ?? null,
    movie.vote_count ?? null,
    searchRank,
  );
}

export function normalizeTvFromApi(
  tvShow: TmdbTvSearchResultRaw,
  searchRank: number,
): MediaCatalogItem {
  return buildMediaItemBase(
    tvShow.id,
    'tv',
    tvShow.name,
    tvShow.original_name,
    tvShow.overview,
    tvShow.first_air_date || null,
    tvShow.poster_path,
    tvShow.backdrop_path,
    tvShow.popularity,
    tvShow.vote_average ?? null,
    tvShow.vote_count ?? null,
    searchRank,
  );
}

export function normalizeCollectionFromApi(
  collection: TmdbCollectionSearchResultRaw,
  searchRank: number,
): MediaCatalogItem {
  return buildMediaItemBase(
    collection.id,
    'collection',
    collection.name,
    collection.original_name ?? collection.name,
    collection.overview,
    null,
    collection.poster_path,
    collection.backdrop_path,
    collection.popularity,
    null,
    null,
    searchRank,
  );
}

export function normalizeMovieDetailFromApi(movie: TmdbMovieDetailRaw): MediaDetail {
  return {
    id: `movie-${movie.id}`,
    tmdbId: movie.id,
    category: 'movie',
    title: movie.title,
    originalTitle: movie.original_title,
    overview: movie.overview,
    releaseDate: movie.release_date || null,
    releaseYear: getReleaseYear(movie.release_date || null),
    posterUrl: buildTmdbImageUrl(movie.poster_path, TMDB_POSTER_BASE_URL),
    backdropUrl: buildTmdbImageUrl(movie.backdrop_path, TMDB_BACKDROP_BASE_URL),
    popularity: movie.popularity,
    voteAverage: movie.vote_average ?? null,
    voteCount: movie.vote_count ?? null,
    tmdbUrl: `${TMDB_SITE_BASE_URL}/movie/${movie.id}`,
    homepage: movie.homepage,
    tagline: movie.tagline,
    status: movie.status,
    genres: movie.genres.map((genre) => genre.name),
    spokenLanguages: normalizeSpokenLanguages(movie.spoken_languages),
    productionCompanies: movie.production_companies.map((company) => company.name),
    runtimeMinutes: movie.runtime,
    numberOfSeasons: null,
    numberOfEpisodes: null,
    relatedItems: [],
    videos: normalizeVideos(movie.videos?.results),
  };
}

export function normalizeTvDetailFromApi(tvShow: TmdbTvDetailRaw): MediaDetail {
  return {
    id: `tv-${tvShow.id}`,
    tmdbId: tvShow.id,
    category: 'tv',
    title: tvShow.name,
    originalTitle: tvShow.original_name,
    overview: tvShow.overview,
    releaseDate: tvShow.first_air_date || null,
    releaseYear: getReleaseYear(tvShow.first_air_date || null),
    posterUrl: buildTmdbImageUrl(tvShow.poster_path, TMDB_POSTER_BASE_URL),
    backdropUrl: buildTmdbImageUrl(tvShow.backdrop_path, TMDB_BACKDROP_BASE_URL),
    popularity: tvShow.popularity,
    voteAverage: tvShow.vote_average ?? null,
    voteCount: tvShow.vote_count ?? null,
    tmdbUrl: `${TMDB_SITE_BASE_URL}/tv/${tvShow.id}`,
    homepage: tvShow.homepage,
    tagline: tvShow.tagline,
    status: tvShow.status,
    genres: tvShow.genres.map((genre) => genre.name),
    spokenLanguages: normalizeSpokenLanguages(tvShow.spoken_languages),
    productionCompanies: tvShow.production_companies.map((company) => company.name),
    runtimeMinutes: tvShow.episode_run_time[0] ?? null,
    numberOfSeasons: tvShow.number_of_seasons,
    numberOfEpisodes: tvShow.number_of_episodes,
    relatedItems: [],
    videos: normalizeVideos(tvShow.videos?.results),
  };
}

export function normalizeCollectionDetailFromApi(collection: TmdbCollectionDetailRaw): MediaDetail {
  return {
    id: `collection-${collection.id}`,
    tmdbId: collection.id,
    category: 'collection',
    title: collection.name,
    originalTitle: collection.name,
    overview: collection.overview,
    releaseDate: null,
    releaseYear: null,
    posterUrl: buildTmdbImageUrl(collection.poster_path, TMDB_POSTER_BASE_URL),
    backdropUrl: buildTmdbImageUrl(collection.backdrop_path, TMDB_BACKDROP_BASE_URL),
    popularity: 0,
    voteAverage: null,
    voteCount: null,
    tmdbUrl: `${TMDB_SITE_BASE_URL}/collection/${collection.id}`,
    homepage: null,
    tagline: null,
    status: null,
    genres: [],
    spokenLanguages: [],
    productionCompanies: [],
    runtimeMinutes: null,
    numberOfSeasons: null,
    numberOfEpisodes: collection.parts.length,
    relatedItems: collection.parts.map((part) => normalizeRelatedMovieItem(
      part.id,
      part.title,
      part.poster_path,
      part.release_date || null,
    )),
    videos: [],
  };
}
