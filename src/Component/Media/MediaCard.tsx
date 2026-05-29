import { useCallback, type CSSProperties, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import type { MediaCatalogItem } from './types/media.types';
import { truncateText } from './utils/media-text';
import styles from './MediaCard.module.css';

interface MediaCardProps {
  item: MediaCatalogItem;
}

const CATEGORY_LABELS: Record<MediaCatalogItem['category'], string> = {
  movie: 'Film',
  tv: 'Serie',
  collection: 'Collection',
};

const MEDIA_COLOR_BY_CATEGORY: Record<MediaCatalogItem['category'], string> = {
  movie: '#d63031',
  tv: '#0984e3',
  collection: '#6c5ce7',
};

function getScoreLabel(item: MediaCatalogItem): string {
  if (typeof item.voteAverage === 'number') {
    return `${item.voteAverage.toFixed(1)} / 10`;
  }

  return 'Sans note';
}

function getVotesLabel(item: MediaCatalogItem): string {
  if (typeof item.voteCount === 'number' && item.voteCount > 0) {
    return `${Intl.NumberFormat('fr-FR').format(item.voteCount)} votes`;
  }

  return 'Pas de vote';
}

function getPopularityLabel(item: MediaCatalogItem): string {
  return `Pop. ${Math.round(item.popularity)}`;
}

export default function MediaCard({ item }: MediaCardProps) {
  const truncatedOverview = truncateText(
    item.overview || 'Aucun synopsis disponible pour ce contenu.',
    150,
  );
  const cardStyle = {
    '--media-color': MEDIA_COLOR_BY_CATEGORY[item.category],
  } as CSSProperties;
  const handlePointerEnter = useCallback((event: PointerEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const distances = {
      top: pointerY,
      right: rect.width - pointerX,
      bottom: rect.height - pointerY,
      left: pointerX,
    };
    const entrySide = Object.entries(distances).reduce((closest, current) => (
      current[1] < closest[1] ? current : closest
    ));
    const entryCoordinatesBySide: Record<string, { x: string; y: string }> = {
      top: { x: `${pointerX}px`, y: '0px' },
      right: { x: `${rect.width}px`, y: `${pointerY}px` },
      bottom: { x: `${pointerX}px`, y: `${rect.height}px` },
      left: { x: '0px', y: `${pointerY}px` },
    };
    const entryCoordinates = entryCoordinatesBySide[entrySide[0]];

    card.style.setProperty('--entry-x', entryCoordinates.x);
    card.style.setProperty('--entry-y', entryCoordinates.y);
  }, []);

  return (
    <article
      className={styles.card}
      style={cardStyle}
      onPointerEnter={handlePointerEnter}
    >
      <div className={styles.content}>
        <div className={styles.topRow}>
          <span className={styles.number}>{CATEGORY_LABELS[item.category]}</span>
          <div className={styles.topActions}>
            <span className={styles.scorePill}>{getScoreLabel(item)}</span>
            <a
              href={item.tmdbUrl}
              target="_blank"
              rel="noreferrer"
              className={styles.actionLink}
              aria-label={`Ouvrir ${item.title} sur TMDB`}
            >
              TMDB
            </a>
          </div>
        </div>
        <h2 className={styles.title}>{item.title}</h2>
        {item.originalTitle !== item.title && (
          <p className={styles.originalTitle}>{item.originalTitle}</p>
        )}

        <Link
          to={`/poke-media/${item.category}/${item.tmdbId}`}
          className={styles.artLink}
          aria-label={`Voir la fiche media ${item.title}`}
        >
          <div className={styles.artStage}>
            {item.posterUrl ? (
              <img
                src={item.posterUrl}
                alt={item.title}
                className={styles.poster}
                loading="lazy"
              />
            ) : (
              <div className={styles.posterFallback} aria-hidden="true">
                {item.category === 'collection' ? 'COLLECTION' : 'POKE MEDIA'}
              </div>
            )}
          </div>
        </Link>

        <div className={styles.meta}>
          {item.releaseYear && <span className={styles.metaItem}>{item.releaseYear}</span>}
          <span className={styles.metaItem}>{getPopularityLabel(item)}</span>
          <span className={styles.metaItem}>{getVotesLabel(item)}</span>
        </div>

        <div className={styles.overviewBlock}>
          <p className={styles.overview}>{truncatedOverview.text}</p>
          {truncatedOverview.wasTruncated && (
            <Link to={`/poke-media/${item.category}/${item.tmdbId}`} className={styles.moreInline}>
              Voir plus
            </Link>
          )}
        </div>

        <div className={styles.footer}>
          <Link to={`/poke-media/${item.category}/${item.tmdbId}`} className={styles.footerLink}>
            <span>Voir la fiche detaillee</span>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
