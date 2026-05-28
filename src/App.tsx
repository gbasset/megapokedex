import './App.css';
import Header from './Component/Header/Header';
import { Routes, Route } from 'react-router-dom'
import PokeId from './Component/PokeId/PokeId.tsx'
import HomeContainer from './Component/Home/HomeContainer.tsx'
import {ContextProvider} from './context/MainContext.jsx'
import ComparisonContainer from './Component/Comparison/ComparisonContainer.tsx'
function App() {

  return (
    <>
    <ContextProvider>

         <Header />

         <Routes>
            <Route path="/" element={<HomeContainer/>}/> 
            <Route path="/poke/:id" element={<PokeId/>}/> 
            <Route path="/comparison" element={<ComparisonContainer/>}/> 
        </Routes>
    </ContextProvider>
      
    </>
  )
}

export default App
