import React, { useEffect, useState } from 'react'

import styles from './Header.module.css';
import { NavLink,useLocation } from "react-router-dom";
import {UseMainContext} from '../../context/MainContext.jsx';
import {colorByPokemonTypes} from '../../utils/apiAndDatabase'


export default function Header() {

  const location = useLocation();
  const {
    searchTerm,
    handleChange,
    mainInformationPokemonSelected,
    color,
    setcolor,
    setmainInformationPokemonSelected} = UseMainContext();


  useEffect(()=>{
    if(mainInformationPokemonSelected){
      const colorByPoke = colorByPokemonTypes.find(x => x.type === mainInformationPokemonSelected.types[0].type.name);
      if(colorByPoke){
        setcolor(colorByPoke.color)
      }else{
        setcolor('#DBD8B7');
      }
    }
    else{
      setcolor('#DBD8B7');
    }
  },[mainInformationPokemonSelected])

  return (
    <div className={styles.header_contour} style={{backgroundColor: color}}> 

    {location.pathname === '/' &&
    <div className={styles.search}>
      <input
        type="text"
        placeholder="Recherche"
        value={searchTerm}
        onChange={handleChange}
      />
    </div>
    }
    
    <div className='text' >
      {location.pathname !== '/' &&
          <NavLink
          style={{color: 'black'}}
          onClick={()=>setmainInformationPokemonSelected()}
            to="/"
          >
           &#8592;
            </NavLink>
          }
    </div>
         <h1>Poke Project</h1>
         <div></div>
    </div>
  )
}
