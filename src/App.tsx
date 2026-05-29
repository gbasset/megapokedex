import './App.css';
import Header from './Component/Header/Header';
import { Routes, Route } from 'react-router-dom'
import PokeId from './Component/PokeId/PokeId.tsx'
import HomeContainer from './Component/Home/HomeContainer.tsx'
import {ContextProvider} from './context/MainContext.jsx'
import { NavigationProvider } from './Component/Navigation/context/NavigationContext.tsx';
import ComparisonContainer from './Component/Comparison/ComparisonContainer.tsx'
import MediaContainer from './Component/Media/MediaContainer.tsx';
import MediaDetail from './Component/Media/MediaDetail.tsx';
import { MediaProvider } from './Component/Media/context/MediaContext.tsx';
function App() {

  return (
    <>
    <ContextProvider>
      <NavigationProvider>
         <Header />

         <Routes>
            <Route path="/" element={<HomeContainer/>}/> 
            <Route path="/poke/:id" element={<PokeId/>}/> 
            <Route path="/comparison" element={<ComparisonContainer/>}/> 
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
      </NavigationProvider>
    </ContextProvider>
      
    </>
  )
}

export default App
