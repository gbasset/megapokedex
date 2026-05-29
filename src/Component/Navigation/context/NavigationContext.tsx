import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import type { NavigationContextValue } from '../types/navigation.types';

const NavigationContext = createContext<NavigationContextValue | null>(null);

interface NavigationProviderProps {
  children: ReactNode;
}

function NavigationRouteReset() {
  const location = useLocation();
  const { resetPageMeta } = useNavigationContext();

  useEffect(() => {
    resetPageMeta();
  }, [location.pathname, resetPageMeta]);

  return null;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [pageTitle, setPageTitleState] = useState<string | null>(null);
  const [pageCategoryLabel, setPageCategoryLabelState] = useState<string | null>(null);

  const setPageTitle = useCallback((title: string | null) => {
    setPageTitleState(title);
  }, []);

  const setPageCategoryLabel = useCallback((label: string | null) => {
    setPageCategoryLabelState(label);
  }, []);

  const resetPageMeta = useCallback(() => {
    setPageTitleState(null);
    setPageCategoryLabelState(null);
  }, []);

  const value = useMemo<NavigationContextValue>(() => ({
    pageTitle,
    pageCategoryLabel,
    setPageTitle,
    setPageCategoryLabel,
    resetPageMeta,
  }), [pageCategoryLabel, pageTitle, resetPageMeta, setPageCategoryLabel, setPageTitle]);

  return (
    <NavigationContext.Provider value={value}>
      <NavigationRouteReset />
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext(): NavigationContextValue {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }

  return context;
}
