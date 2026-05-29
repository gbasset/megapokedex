import { useCallback } from 'react';
import { useMediaContext } from './context/MediaContext';
import { useMediaCatalog } from './logic/useMediaCatalog';
import MediaView from './MediaView';
import type { MediaSortBy, MediaTypeFilter } from './types/media.types';

export default function MediaContainer() {
  const {
    searchTerm,
    setSearchTerm,
    mediaTypeFilter,
    setMediaTypeFilter,
    sortBy,
    setSortBy,
    resetFilters,
  } = useMediaContext();
  const {
    mediaItems,
    isLoading,
    isInitialLoad,
    errorMessage,
    hasMore,
    loadMore,
    totalResults,
  } = useMediaCatalog({
    searchTerm,
    mediaTypeFilter,
    sortBy,
  });

  const handleSearchTermChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, [setSearchTerm]);

  const handleMediaTypeFilterChange = useCallback((value: MediaTypeFilter) => {
    setMediaTypeFilter(value);
  }, [setMediaTypeFilter]);

  const handleSortByChange = useCallback((value: MediaSortBy) => {
    setSortBy(value);
  }, [setSortBy]);

  return (
    <MediaView
      errorMessage={errorMessage}
      hasMore={hasMore}
      isInitialLoad={isInitialLoad}
      isLoading={isLoading}
      mediaItems={mediaItems}
      mediaTypeFilter={mediaTypeFilter}
      onLoadMore={loadMore}
      onMediaTypeFilterChange={handleMediaTypeFilterChange}
      onResetFilters={resetFilters}
      onSearchTermChange={handleSearchTermChange}
      onSortByChange={handleSortByChange}
      searchTerm={searchTerm}
      sortBy={sortBy}
      totalResults={totalResults}
    />
  );
}
