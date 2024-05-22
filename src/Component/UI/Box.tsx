
import {getNameInOtherLanguage} from '../../utils/transform';

import { Link } from 'react-router-dom'
import { PokeType } from '../../../type-pokemons';
export default function Box({pokemon}) {
  const name = getNameInOtherLanguage(pokemon, 'fr');

 
  return (
    <Link to={"poke/" + pokemon.id} className='box'>
    <div >
        <h2> 
            {name}
           </h2>
        <img src={pokemon.img} alt={name} loading="lazy" style={{height: '150px'}}/>
        <p>{pokemon.id}</p>
       </div>
       </Link>
  )
}
