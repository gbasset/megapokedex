import { useEffect, useState } from 'react';
import { getContextualPokemonMedia, getMediaDetail } from '../api/mediaApi';
import type { MediaCatalogItem, MediaCategory, MediaDetail } from '../types/media.types';

interface UseMediaDetailArgs {
  category: MediaCategory | null;
  tmdbId: number | null;
}

export interface UseMediaDetailReturn {
  contextualMedia: MediaCatalogItem[];
  errorMessage: string | null;
  isLoading: boolean;
  mediaDetail: MediaDetail | null;
}

export function useMediaDetail({
  category,
  tmdbId,
}: UseMediaDetailArgs): UseMediaDetailReturn {
  const [mediaDetail, setMediaDetail] = useState<MediaDetail | null>(null);
  const [contextualMedia, setContextualMedia] = useState<MediaCatalogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!category || tmdbId === null) {
      setMediaDetail(null);
      setContextualMedia([]);
      setErrorMessage('Ce contenu media est introuvable.');
      setIsLoading(false);
      return;
    }

    let isCancelled = false;

    setIsLoading(true);
    setErrorMessage(null);

    Promise.all([
      getMediaDetail({
        category,
        tmdbId,
        language: 'fr-FR',
      }),
      getContextualPokemonMedia({
        category,
        tmdbId,
        language: 'fr-FR',
      }),
    ]).then(([detail, nearbyMedia]) => {
      if (isCancelled) {
        return;
      }

      setMediaDetail(detail);
      setContextualMedia(nearbyMedia);
    }).catch((error: unknown) => {
      if (isCancelled) {
        return;
      }

      setErrorMessage(error instanceof Error ? error.message : 'Impossible de charger cette fiche media.');
    }).finally(() => {
      if (isCancelled) {
        return;
      }

      setIsLoading(false);
    });

    return () => {
      isCancelled = true;
    };
  }, [category, tmdbId]);

  return {
    mediaDetail,
    contextualMedia,
    isLoading,
    errorMessage,
  };
}
