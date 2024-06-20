import { useState } from 'react'

import './App.css';
import Header from './Component/Header/Header';
import { Routes, Route } from 'react-router-dom'
import PokeId from './Component/PokeId/PokeId.tsx'
import HomeContainer from './Component/Home/HomeContainer.tsx'
import {ContextProvider} from './context/MainContext.jsx'
function App() {

  return (
    <>
    <ContextProvider>

         <Header />

         <Routes>
            <Route path="/" element={<HomeContainer/>}/> 
            <Route path="/poke/:id" element={<PokeId/>}/> 
        </Routes>
    </ContextProvider>
      
    </>
  )
}

export default App
