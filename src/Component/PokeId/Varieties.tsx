import React ,{useState, useEffect} from 'react'
import axios from 'axios';
import styles from './PodeId.module.css';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { v4 as uuidv4 } from 'uuid';
import {baseUrl, colorByPokemonTypes} from '../../utils/apiAndDatabase';
export default function Varieties({variety}) {
    function getTypeData (element: any){
        const elementType = colorByPokemonTypes.find( x=> x.type === element.type.name) ;
        return elementType;
      }
    const [pokemonCurrent, setpokemonCurrent] = useState()
    useEffect(()=>{
        axios.get(variety.pokemon.url)
        .then(x => {
          const data = x.data;
          console.log('🚀🐱 😻 --///** ~ file: Varieties.tsx:9 ~ useEffect ~ data:', data)
          setpokemonCurrent(x.data)
        
        })
        .catch(err => {
          console.error(err);
        })
      },[]);
  return (
    <div>
        <h3>Vartiétés</h3>
       {variety.pokemon.name}
       <h3># {pokemonCurrent?.id}</h3>
       <div className={styles.types}>
             {pokemonCurrent?.types.map((x ,i)=> {
              const type  = getTypeData(x);
              const idV = uuidv4();
                return <div key={i} className={styles.pokemon_types} data-tooltip-id={idV}
                data-tooltip-content={type?.label}
                >
                <ReactTooltip
                  id={idV}
                  backgroundColor="black"
                  effect="solid"
                  place="bottom"
                  globalEventOff="click"
                  delayShow={600}
				        />
                  <img src={type?.image} alt={type?.label} />
                  </div>
              }
            )}
             </div>
       <img src={pokemonCurrent?.sprites.front_default} alt="" />
       <img src={pokemonCurrent?.sprites.front_shiny} alt="" />
        </div>
  )
}
