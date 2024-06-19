import React, { useEffect,useState } from 'react'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {Evolution,PokeType} from '../../../type-pokemons';
import EvolutionItem from './EvolutionItem';
type P = {
    url : string;
    pokemon: PokeType
    }
    
function Evolutions({url,pokemon}:P) {
console.log('🚀🐱 😻 --///** ~ file: Evolutions.tsx:12 ~ Evolutions ~ pokemon:', pokemon)
console.log('🚀🐱 😻 --///** ~ file: Evolutions.tsx:12 ~ Evolutions ~ url:', url)

    const [evolutions, setevolutions] = useState<Array<string>>();
    console.log('🚀🐱 😻 --///** ~ file: Evolutions.tsx:16 ~ Evolutions ~ evolutions:', evolutions)
    const [firstElem, setFirstElem] = useState()
    useEffect(()=>{
        axios.get(url)
        .then(x => {
            const accu:Array<any> = [];
            function recurse(elem:any) {
                console.log('🚀🐱 😻 --///** ~ file: Evolutions.tsx:19 ~ recurse ~ elem:', elem)
                if(elem.evolves_to.length === 0){
                    accu.push({url:elem.species.url, evolution_details: elem.evolution_details});
                    return;
                }
                if(elem.evolves_to[0].evolves_to.length  ===  0) {
                   
                    accu.push({url:elem.species.url, evolution_details: elem.evolution_details});
                    recurse(elem.evolves_to[0]);
                    
                    } else {
                        accu.push({url:elem.species.url, evolution_details: elem.evolution_details});
                        recurse(elem.evolves_to[0]);
                    }
            }
                recurse(x.data.chain.evolves_to[0]);
                setevolutions(accu);
     } )
        .catch(err => {
          console.error(err);
      })
      },[url]);
      
  return (
    <div>
        <h2>Evolutions</h2>
        <div style={{display: 'flex', }}>
            {pokemon?.hasOwnProperty('evolves_from_species') && pokemon?.evolves_from_species !== null ?
                <EvolutionItem evol={pokemon.evolves_from_species?.url} key={uuidv4()} isEvolveFrom={true}  isFirst={false}/> 
                :
                <EvolutionItem evol={''} key={uuidv4()} isEvolveFrom={false} isFirst={true} pokemon={pokemon}/> 
            }
            {evolutions?.map((evol:any )=> {
                return   <EvolutionItem evol={evol.url} key={uuidv4()} evolArray={evol.evolution_details} isEvolveFrom={false}  isFirst={false}/>

            })}

        </div>
    </div>
  )
}

export default Evolutions