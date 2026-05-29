import type { AppSection, BreadcrumbItem, RouteNavigationConfig } from '../types/navigation.types';

const HOME_LABEL = 'Accueil';
const MEDIA_LIST_LABEL = 'Poke Media';
const COMPARISON_LABEL = 'Comparaison';

const MEDIA_CATEGORY_LABELS: Record<string, string> = {
  movie: 'Film',
  tv: 'Serie',
  collection: 'Collection',
};

interface BuildRouteNavigationParams {
  pathname: string;
  pageTitle?: string | null;
  pageCategoryLabel?: string | null;
}

function getMediaCategoryLabel(category: string | undefined, override?: string | null): string | null {
  if (override) {
    return override;
  }

  if (!category) {
    return null;
  }

  return MEDIA_CATEGORY_LABELS[category] ?? null;
}

export function buildRouteNavigation({
  pathname,
  pageTitle,
  pageCategoryLabel,
}: BuildRouteNavigationParams): RouteNavigationConfig {
  if (pathname === '/') {
    return {
      section: 'pokedex',
      depth: 0,
      backTo: null,
      backLabel: null,
      breadcrumbs: [],
      showBreadcrumbs: false,
    };
  }

  const pokeMatch = pathname.match(/^\/poke\/(\d+)$/);
  if (pokeMatch) {
    const pokemonLabel = pageTitle ?? `Pokemon #${pokeMatch[1]}`;

    return {
      section: 'pokedex',
      depth: 1,
      backTo: '/',
      backLabel: HOME_LABEL,
      showBreadcrumbs: true,
      breadcrumbs: [
        { label: HOME_LABEL, to: '/' },
        { label: pokemonLabel, current: true },
      ],
    };
  }

  if (pathname === '/comparison') {
    return {
      section: 'pokedex',
      depth: 1,
      backTo: '/',
      backLabel: HOME_LABEL,
      showBreadcrumbs: true,
      breadcrumbs: [
        { label: HOME_LABEL, to: '/' },
        { label: COMPARISON_LABEL, current: true },
      ],
    };
  }

  if (pathname === '/poke-media') {
    return {
      section: 'media',
      depth: 1,
      backTo: '/',
      backLabel: HOME_LABEL,
      showBreadcrumbs: true,
      breadcrumbs: [
        { label: HOME_LABEL, to: '/' },
        { label: MEDIA_LIST_LABEL, current: true },
      ],
    };
  }

  const mediaDetailMatch = pathname.match(/^\/poke-media\/([^/]+)\/(\d+)$/);
  if (mediaDetailMatch) {
    const category = mediaDetailMatch[1];
    const categoryLabel = getMediaCategoryLabel(category, pageCategoryLabel);
    const detailLabel = pageTitle ?? 'Fiche media';
    const breadcrumbs: BreadcrumbItem[] = [
      { label: HOME_LABEL, to: '/' },
      { label: MEDIA_LIST_LABEL, to: '/poke-media' },
    ];

    if (categoryLabel) {
      breadcrumbs.push({ label: categoryLabel });
    }

    breadcrumbs.push({ label: detailLabel, current: true });

    return {
      section: 'media',
      depth: 2,
      backTo: '/poke-media',
      backLabel: MEDIA_LIST_LABEL,
      showBreadcrumbs: true,
      breadcrumbs,
    };
  }

  const section: AppSection = pathname.startsWith('/poke-media') ? 'media' : 'pokedex';

  return {
    section,
    depth: 1,
    backTo: '/',
    backLabel: HOME_LABEL,
    showBreadcrumbs: true,
    breadcrumbs: [
      { label: HOME_LABEL, to: '/' },
      { label: pathname, current: true },
    ],
  };
}
