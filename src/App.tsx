import './App.css';
import { useEffect, useState } from 'react';
import Header from './Component/Header/Header';
import { Routes, Route, useLocation } from 'react-router-dom';
import PokeId from './Component/PokeId/PokeId.tsx';
import HomeContainer from './Component/Home/HomeContainer.tsx';
import { ContextProvider } from './context/MainContext.jsx';
import { NavigationProvider } from './Component/Navigation/context/NavigationContext.tsx';
import ComparisonContainer from './Component/Comparison/ComparisonContainer.tsx';
import MediaContainer from './Component/Media/MediaContainer.tsx';
import MediaDetail from './Component/Media/MediaDetail.tsx';
import { MediaProvider } from './Component/Media/context/MediaContext.tsx';
import styles from './App.module.css';

function isMediaPath(pathname: string): boolean {
  return pathname.startsWith('/poke-media');
}

function AppRoutes() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isMedia = isMediaPath(location.pathname);
  const [keepHomeMounted, setKeepHomeMounted] = useState(isHome);

  useEffect(() => {
    if (isHome) {
      setKeepHomeMounted(true);
      return;
    }

    if (!isMedia) {
      setKeepHomeMounted(false);
    }
  }, [isHome, isMedia]);

  const showHomeLayer = isHome || keepHomeMounted;

  return (
    <>
      <Header />

      {showHomeLayer && (
        <div className={isHome ? undefined : styles.hiddenRoute} aria-hidden={!isHome}>
          <HomeContainer isActive={isHome} />
        </div>
      )}

      {!isHome && (
        <Routes>
          <Route path="/poke/:id" element={<PokeId />} />
          <Route path="/comparison" element={<ComparisonContainer />} />
          <Route
            path="/poke-media"
            element={(
              <MediaProvider>
                <MediaContainer />
              </MediaProvider>
            )}
          />
          <Route path="/poke-media/:category/:id" element={<MediaDetail />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <ContextProvider>
      <NavigationProvider>
        <AppRoutes />
      </NavigationProvider>
    </ContextProvider>
  );
}

export default App
