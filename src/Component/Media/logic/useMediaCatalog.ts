import { useCallback, useEffect, useMemo, useState } from 'react';
import { searchPokemonMedia } from '../api/mediaApi';
import type { MediaCatalogItem, MediaSortBy, MediaTypeFilter } from '../types/media.types';

interface UseMediaCatalogArgs {
  mediaTypeFilter: MediaTypeFilter;
  searchTerm: string;
  sortBy: MediaSortBy;
}

export interface UseMediaCatalogReturn {
  errorMessage: string | null;
  hasMore: boolean;
  isInitialLoad: boolean;
  isLoading: boolean;
  loadMore: () => void;
  mediaItems: MediaCatalogItem[];
  totalResults: number;
}

function sortMediaItems(items: MediaCatalogItem[], sortBy: MediaSortBy): MediaCatalogItem[] {
  const sortedItems = [...items];

  sortedItems.sort((firstItem, secondItem) => {
    if (sortBy === 'title') {
      return firstItem.title.localeCompare(secondItem.title, 'fr', { sensitivity: 'base' });
    }

    if (sortBy === 'newest' || sortBy === 'oldest') {
      const firstYear = firstItem.releaseYear ?? 0;
      const secondYear = secondItem.releaseYear ?? 0;

      return sortBy === 'newest' ? secondYear - firstYear : firstYear - secondYear;
    }

    if (sortBy === 'rating') {
      return (secondItem.voteAverage ?? -1) - (firstItem.voteAverage ?? -1);
    }

    if (sortBy === 'popularity') {
      return secondItem.popularity - firstItem.popularity;
    }

    return firstItem.searchRank - secondItem.searchRank;
  });

  return sortedItems;
}

function mergeMediaItems(currentItems: MediaCatalogItem[], incomingItems: MediaCatalogItem[]): MediaCatalogItem[] {
  const itemsById = new Map<string, MediaCatalogItem>();

  currentItems.forEach((item) => {
    itemsById.set(item.id, item);
  });

  incomingItems.forEach((item) => {
    itemsById.set(item.id, item);
  });

  return [...itemsById.values()];
}

export function useMediaCatalog({
  mediaTypeFilter,
  searchTerm,
  sortBy,
}: UseMediaCatalogArgs): UseMediaCatalogReturn {
  const [rawItems, setRawItems] = useState<MediaCatalogItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState<number>(0);

  useEffect(() => {
    setRawItems([]);
    setPage(1);
    setHasMore(false);
    setErrorMessage(null);
    setTotalResults(0);
    setIsInitialLoad(true);
  }, [searchTerm]);

  useEffect(() => {
    let isCancelled = false;

    setIsLoading(true);
    setErrorMessage(null);

    searchPokemonMedia({
      page,
      searchTerm,
      language: 'fr-FR',
    }).then((response) => {
      if (isCancelled) {
        return;
      }

      setRawItems((currentItems) => (
        page === 1 ? response.items : mergeMediaItems(currentItems, response.items)
      ));
      setHasMore(response.hasMore);
      setTotalResults(response.totalResults);
    }).catch((error: unknown) => {
      if (isCancelled) {
        return;
      }

      const message = error instanceof Error
        ? error.message
        : 'Impossible de charger les contenus Poke Media.';

      setErrorMessage(message);
    }).finally(() => {
      if (isCancelled) {
        return;
      }

      setIsLoading(false);
      setIsInitialLoad(false);
    });

    return () => {
      isCancelled = true;
    };
  }, [page, searchTerm]);

  const mediaItems = useMemo(() => {
    const filteredItems = mediaTypeFilter === 'all'
      ? rawItems
      : rawItems.filter((item) => item.category === mediaTypeFilter);

    return sortMediaItems(filteredItems, sortBy);
  }, [mediaTypeFilter, rawItems, sortBy]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) {
      return;
    }

    setPage((currentPage) => currentPage + 1);
  }, [hasMore, isLoading]);

  return {
    mediaItems,
    isLoading,
    isInitialLoad,
    errorMessage,
    hasMore,
    loadMore,
    totalResults,
  };
}
