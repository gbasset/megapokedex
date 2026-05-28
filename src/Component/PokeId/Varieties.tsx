import { useState, useEffect } from 'react'
import axios from 'axios';
import styles from './Varieties.module.css';
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { colorByPokemonTypes} from '../../utils/apiAndDatabase';
import { Variety ,PokeType} from '../../../type-pokemons';

interface PropsVariety {
  variety: Variety;
}

interface PokemonTypeSlot {
  type?: {
    name?: unknown;
  };
}

function getPokemonTypeName(element: object): string | undefined {
  const typeSlot = element as PokemonTypeSlot;
  return typeof typeSlot.type?.name === 'string' ? typeSlot.type.name : undefined;
}

export default function Varieties({variety}:PropsVariety) {
    function getTypeData (element: object){
        const elementType = colorByPokemonTypes.find( x=> x.type === getPokemonTypeName(element)) ;
        return elementType;
      }
    const [pokemonCurrent, setpokemonCurrent] = useState<PokeType>()
    useEffect(()=>{
        axios.get(variety.pokemon.url)
        .then(x => {
          setpokemonCurrent(x.data as PokeType)
        
        })
        .catch(err => {
          console.error(err);
        })
      },[variety.pokemon.url]);

  const defaultSprite = pokemonCurrent?.sprites?.front_default;
  const shinySprite = pokemonCurrent?.sprites?.front_shiny;

  return (
    <article className={styles.varietyCard}>
        <div className={styles.varietyInfo}>
          <span className={styles.varietyName}>{variety.pokemon.name}</span>
          {pokemonCurrent?.id && <span className={styles.varietyId}>#{pokemonCurrent.id.toString().padStart(3, '0')}</span>}
        </div>
       <div className={styles.types}>
             {pokemonCurrent?.types.map((x ,i)=> {
              const type  = getTypeData(x);
              const idV = `variety-type-${pokemonCurrent.id}-${i}`;
                return <div key={i} className={styles.pokemonTypes} data-tooltip-id={idV}
                data-tooltip-content={type?.label}
                >
                <ReactTooltip
                  id={idV}
                  place="bottom"
                  delayShow={600}/>
                  <img src={type?.image} alt={type?.label}  />
                  </div>
              }
            )}
             </div>
             {pokemonCurrent &&
                <div className={styles.sprites}>
                { defaultSprite &&
                <img src={defaultSprite} alt={`${variety.pokemon.name} normal`} className={styles.sprite} />}
              { shinySprite &&
                <img src={shinySprite} alt={`${variety.pokemon.name} shiny`} className={styles.sprite} />}
                </div>
             }
        </article>
  )
}
