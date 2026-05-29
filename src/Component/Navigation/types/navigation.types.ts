export type AppSection = 'pokedex' | 'media';

export interface BreadcrumbItem {
  label: string;
  to?: string;
  current?: boolean;
}

export interface RouteNavigationConfig {
  section: AppSection;
  depth: number;
  backTo: string | null;
  backLabel: string | null;
  breadcrumbs: BreadcrumbItem[];
  showBreadcrumbs: boolean;
}

export interface NavigationState extends RouteNavigationConfig {
  isHome: boolean;
  currentPokeId: number | null;
}

export interface NavigationContextValue {
  pageTitle: string | null;
  pageCategoryLabel: string | null;
  setPageTitle: (title: string | null) => void;
  setPageCategoryLabel: (label: string | null) => void;
  resetPageMeta: () => void;
}
