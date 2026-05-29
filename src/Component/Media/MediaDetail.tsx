import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigationContext } from '../Navigation/context/NavigationContext';
import Box from '../UI/Box';
import { UseMainContext } from '../../context/MainContext';
import { getNameInOtherLanguage } from '../../utils/transform';
import type { PokeType } from '../../../type-pokemons';
import { useMediaDetail } from './logic/useMediaDetail';
import styles from './MediaDetail.module.css';
import type { MediaCategory, MediaDetail as MediaDetailType } from './types/media.types';
import { getFeaturedPokemonForMedia } from './utils/media-pokemon-links';

const CATEGORY_LABELS: Record<MediaCategory, string> = {
  movie: 'Film',
  tv: 'Serie',
  collection: 'Collection',
};

function isMediaCategory(value: string | undefined): value is MediaCategory {
  return value === 'movie' || value === 'tv' || value === 'collection';
}

function formatScore(detail: MediaDetailType): string {
  if (typeof detail.voteAverage === 'number') {
    return `${detail.voteAverage.toFixed(1)} / 10`;
  }

  return 'Non renseigne';
}

export default function MediaDetail() {
  const { category, id } = useParams();
  const { pokemonsDetails } = UseMainContext();
  const { setPageTitle, setPageCategoryLabel } = useNavigationContext();

  const isValidRoute = useMemo(() => {
    return isMediaCategory(category) && typeof id === 'string' && /^\d+$/.test(id);
  }, [category, id]);
  const validatedCategory = isMediaCategory(category) ? category : null;
  const validatedId = typeof id === 'string' && /^\d+$/.test(id) ? Number(id) : null;
  const {
    mediaDetail,
    contextualMedia,
    errorMessage,
    isLoading,
  } = useMediaDetail({
    category: isValidRoute ? validatedCategory : null,
    tmdbId: isValidRoute ? validatedId : null,
  });
  const featuredPokemon = useMemo(() => {
    if (!mediaDetail) {
      return [];
    }

    return getFeaturedPokemonForMedia(mediaDetail.id).map((highlight) => {
      const pokemon = pokemonsDetails.find((item) => item.id === highlight.pokemonId);

      if (!pokemon) {
        return null;
      }

      return {
        ...highlight,
        pokemon,
      };
    }).filter((item): item is {
      note: string;
      label: string;
      pokemon: PokeType;
      pokemonId: number;
    } => item !== null);
  }, [mediaDetail, pokemonsDetails]);
  const primaryVideo = useMemo(() => {
    return mediaDetail?.videos.find((video) => video.site === 'YouTube' && video.url) ?? mediaDetail?.videos[0] ?? null;
  }, [mediaDetail]);

  useEffect(() => {
    if (!mediaDetail) {
      return;
    }

    setPageTitle(mediaDetail.title);
    setPageCategoryLabel(CATEGORY_LABELS[mediaDetail.category]);
  }, [mediaDetail, setPageCategoryLabel, setPageTitle]);

  if (isLoading) {
    return (
      <section className={styles.page}>
        <div className={styles.feedbackCard}>
          <strong>Chargement de la fiche media...</strong>
          <span>On recupere les details complets depuis TMDB.</span>
        </div>
      </section>
    );
  }

  if (!mediaDetail || errorMessage) {
    return (
      <section className={styles.page}>
        <div className={styles.feedbackCard} role="alert">
          <strong>Impossible d'afficher cette fiche.</strong>
          <span>{errorMessage ?? 'Aucune information disponible.'}</span>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div
        className={styles.hero}
        style={mediaDetail.backdropUrl ? { backgroundImage: `url(${mediaDetail.backdropUrl})` } : undefined}
      >
        <div className={styles.heroOverlay}>
          <div className={styles.posterColumn}>
            {mediaDetail.posterUrl ? (
              <img
                src={mediaDetail.posterUrl}
                alt={mediaDetail.title}
                className={styles.poster}
              />
            ) : (
              <div className={styles.posterFallback}>{CATEGORY_LABELS[mediaDetail.category]}</div>
            )}
          </div>

          <div className={styles.heroContent}>
            <div className={styles.badges}>
              <span className={styles.badge}>{CATEGORY_LABELS[mediaDetail.category]}</span>
              {mediaDetail.releaseYear && <span className={styles.badge}>{mediaDetail.releaseYear}</span>}
              {mediaDetail.status && <span className={styles.badge}>{mediaDetail.status}</span>}
            </div>

            <h2 className={styles.title}>{mediaDetail.title}</h2>
            {mediaDetail.originalTitle !== mediaDetail.title && (
              <p className={styles.originalTitle}>{mediaDetail.originalTitle}</p>
            )}
            {mediaDetail.tagline && <p className={styles.tagline}>{mediaDetail.tagline}</p>}

            <p className={styles.overview}>
              {mediaDetail.overview || 'Aucun synopsis disponible pour ce contenu.'}
            </p>

            <div className={styles.heroActions}>
              <a
                href={mediaDetail.tmdbUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.externalLink}
              >
                Ouvrir sur TMDB
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <article className={styles.panel}>
          <h3>Infos clefs</h3>
          <dl className={styles.definitionList}>
            <div>
              <dt>Note</dt>
              <dd>{formatScore(mediaDetail)}</dd>
            </div>
            <div>
              <dt>Popularite</dt>
              <dd>{Math.round(mediaDetail.popularity)}</dd>
            </div>
            {mediaDetail.runtimeMinutes && (
              <div>
                <dt>Duree</dt>
                <dd>{mediaDetail.runtimeMinutes} min</dd>
              </div>
            )}
            {mediaDetail.numberOfSeasons && (
              <div>
                <dt>Saisons</dt>
                <dd>{mediaDetail.numberOfSeasons}</dd>
              </div>
            )}
            {mediaDetail.numberOfEpisodes && (
              <div>
                <dt>Episodes / elements</dt>
                <dd>{mediaDetail.numberOfEpisodes}</dd>
              </div>
            )}
            {mediaDetail.voteCount && (
              <div>
                <dt>Votes</dt>
                <dd>{mediaDetail.voteCount}</dd>
              </div>
            )}
          </dl>
        </article>

        {mediaDetail.genres.length > 0 && (
          <article className={styles.panel}>
            <h3>Genres</h3>
            <div className={styles.chipGroup}>
              {mediaDetail.genres.map((genre) => (
                <span key={genre} className={styles.chip}>{genre}</span>
              ))}
            </div>
          </article>
        )}

        {mediaDetail.spokenLanguages.length > 0 && (
          <article className={styles.panel}>
            <h3>Langues</h3>
            <div className={styles.chipGroup}>
              {mediaDetail.spokenLanguages.map((language) => (
                <span key={language} className={styles.chip}>{language}</span>
              ))}
            </div>
          </article>
        )}

        {mediaDetail.productionCompanies.length > 0 && (
          <article className={styles.panel}>
            <h3>Studios / production</h3>
            <div className={styles.chipGroup}>
              {mediaDetail.productionCompanies.map((company) => (
                <span key={company} className={styles.chip}>{company}</span>
              ))}
            </div>
          </article>
        )}
      </div>

      {contextualMedia.length > 0 && (
        <article className={styles.panel}>
          <h3>Autres medias Pokemon proches</h3>
          <div className={styles.contextualGrid}>
            {contextualMedia.map((item) => (
              <Link
                key={item.id}
                to={`/poke-media/${item.category}/${item.tmdbId}`}
                className={styles.contextualCard}
              >
                {item.posterUrl ? (
                  <img src={item.posterUrl} alt={item.title} className={styles.contextualPoster} />
                ) : (
                  <div className={styles.contextualFallback}>{item.title.slice(0, 1)}</div>
                )}
                <div className={styles.contextualContent}>
                  <strong>{item.title}</strong>
                  <span>
                    {CATEGORY_LABELS[item.category]}
                    {item.releaseYear ? ` · ${item.releaseYear}` : ''}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </article>
      )}

      {featuredPokemon.length > 0 && (
        <article className={styles.panel}>
          <h3>Pokemon presents / mis en avant</h3>
          <div className={styles.pokemonGrid}>
            {featuredPokemon.map((item) => (
              <div key={`${mediaDetail.id}-${item.pokemonId}`} className={styles.pokemonHighlightCard}>
                <Box pokemon={item.pokemon}>
                  <span className={styles.pokemonRoleBadge}>{item.label}</span>
                </Box>
                <div className={styles.pokemonHighlightContent}>
                  <strong>{getNameInOtherLanguage(item.pokemon, 'fr') || item.pokemon.name}</strong>
                  <p>{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      )}

      {mediaDetail.relatedItems.length > 0 && (
        <article className={styles.panel}>
          <h3>{mediaDetail.category === 'collection' ? 'Films de la collection' : 'Saisons et contenus lies'}</h3>
          <div className={styles.relatedGrid}>
            {mediaDetail.relatedItems.map((item) => (
              <Link
                key={item.id}
                to={`/poke-media/${item.category}/${item.tmdbId}`}
                className={styles.relatedCard}
              >
                {item.posterUrl ? (
                  <img src={item.posterUrl} alt={item.title} className={styles.relatedPoster} />
                ) : (
                  <div className={styles.relatedFallback}>{item.title.slice(0, 1)}</div>
                )}
                <div className={styles.relatedContent}>
                  <strong>{item.title}</strong>
                  {item.releaseYear && <span>{item.releaseYear}</span>}
                </div>
              </Link>
            ))}
          </div>
        </article>
      )}

      {mediaDetail.videos.length > 0 && (
        <article className={styles.panel}>
          <h3>Videos</h3>
          {primaryVideo?.site === 'YouTube' && (
            <div className={styles.videoHero}>
              <iframe
                src={`https://www.youtube.com/embed/${primaryVideo.key}`}
                title={primaryVideo.name}
                className={styles.videoFrame}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          <div className={styles.videoList}>
            {mediaDetail.videos.slice(0, 6).map((video) => (
              <a
                key={video.id}
                href={video.url ?? mediaDetail.tmdbUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.videoLink}
              >
                {video.site === 'YouTube' && (
                  <img
                    src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                    alt={video.name}
                    className={styles.videoThumb}
                    loading="lazy"
                  />
                )}
                <strong>{video.name}</strong>
                <span>{video.type} · {video.site}</span>
              </a>
            ))}
          </div>
        </article>
      )}
    </section>
  );
}
