import { useCallback, type ChangeEvent } from 'react';
import { Button } from '../UI/Button';
import MediaCard from './MediaCard';
import styles from './MediaView.module.css';
import type { MediaCatalogItem, MediaSortBy, MediaTypeFilter } from './types/media.types';

interface MediaViewProps {
  errorMessage: string | null;
  hasMore: boolean;
  isInitialLoad: boolean;
  isLoading: boolean;
  mediaItems: MediaCatalogItem[];
  mediaTypeFilter: MediaTypeFilter;
  onLoadMore: () => void;
  onMediaTypeFilterChange: (value: MediaTypeFilter) => void;
  onResetFilters: () => void;
  onSearchTermChange: (value: string) => void;
  onSortByChange: (value: MediaSortBy) => void;
  searchTerm: string;
  sortBy: MediaSortBy;
  totalResults: number;
}

const MEDIA_TYPE_OPTIONS: Array<{ label: string; value: MediaTypeFilter }> = [
  { value: 'all', label: 'Tout' },
  { value: 'movie', label: 'Films' },
  { value: 'tv', label: 'Series' },
  { value: 'collection', label: 'Collections' },
];

const SORT_OPTIONS: Array<{ label: string; value: MediaSortBy }> = [
  { value: 'relevance', label: 'Pertinence' },
  { value: 'newest', label: 'Plus recent' },
  { value: 'oldest', label: 'Plus ancien' },
  { value: 'rating', label: 'Meilleure note' },
  { value: 'popularity', label: 'Popularite' },
  { value: 'title', label: 'Titre A-Z' },
];

export default function MediaView({
  errorMessage,
  hasMore,
  isInitialLoad,
  isLoading,
  mediaItems,
  mediaTypeFilter,
  onLoadMore,
  onMediaTypeFilterChange,
  onResetFilters,
  onSearchTermChange,
  onSortByChange,
  searchTerm,
  sortBy,
  totalResults,
}: MediaViewProps) {
  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onSearchTermChange(event.target.value);
  }, [onSearchTermChange]);

  const handleMediaTypeChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    onMediaTypeFilterChange(event.target.value as MediaTypeFilter);
  }, [onMediaTypeFilterChange]);

  const handleSortChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    onSortByChange(event.target.value as MediaSortBy);
  }, [onSortByChange]);

  const hasActiveFilters = searchTerm.length > 0 || mediaTypeFilter !== 'all' || sortBy !== 'relevance';

  return (
    <section className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.kicker}>Poke Media</span>
          <h2 className={styles.title}>Films, series et collections Pokemon via TMDB</h2>
          <p className={styles.description}>
            La recherche ajoute automatiquement <strong>pokemon</strong> a chaque requete
            pour rester concentre sur la franchise.
          </p>
        </div>

        <div className={styles.controlsCard}>
          <label className={styles.field} htmlFor="media-search">
            <span>Recherche surchargee</span>
            <input
              id="media-search"
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Exemple : mewtwo, horizons, jirachi..."
              className={styles.searchInput}
            />
          </label>

          <div className={styles.filtersRow}>
            <label className={styles.field} htmlFor="media-type-filter">
              <span>Type</span>
              <select
                id="media-type-filter"
                value={mediaTypeFilter}
                onChange={handleMediaTypeChange}
                className={styles.select}
              >
                {MEDIA_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field} htmlFor="media-sort">
              <span>Trier par</span>
              <select
                id="media-sort"
                value={sortBy}
                onChange={handleSortChange}
                className={styles.select}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.actions}>
            <Button
              variant="secondary"
              size="medium"
              onClick={onResetFilters}
              disabled={!hasActiveFilters}
            >
              Reinitialiser
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.resultsHeader}>
        <div>
          <strong>{mediaItems.length}</strong> resultat{mediaItems.length > 1 ? 's' : ''}
          {totalResults > mediaItems.length ? ` affiches sur environ ${totalResults}` : ''}
        </div>
        {isLoading && !isInitialLoad && <span className={styles.loadingInline}>Chargement...</span>}
      </div>

      {errorMessage && (
        <div className={styles.feedbackCard} role="alert">
          <strong>TMDB indisponible.</strong>
          <span>{errorMessage}</span>
        </div>
      )}

      {!errorMessage && isInitialLoad && (
        <div className={styles.feedbackCard}>
          <strong>Chargement des contenus Pokemon...</strong>
          <span>On recupere films, series et collections depuis TMDB.</span>
        </div>
      )}

      {!errorMessage && !isInitialLoad && mediaItems.length === 0 && (
        <div className={styles.feedbackCard}>
          <strong>Aucun contenu trouve.</strong>
          <span>Essaie un autre terme, la requete garde toujours le prefixe pokemon.</span>
        </div>
      )}

      {mediaItems.length > 0 && (
        <div className={styles.grid}>
          {mediaItems.map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {!errorMessage && hasMore && mediaItems.length > 0 && (
        <div className={styles.loadMore}>
          <Button variant="primary" size="large" onClick={onLoadMore} disabled={isLoading}>
            {isLoading ? 'Chargement...' : 'Charger plus'}
          </Button>
        </div>
      )}
    </section>
  );
}
