import React, { useEffect,useState } from 'react'
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {PokeType} from '../../../type-pokemons';
import EvolutionItem from './EvolutionItem';
import {getNameInOtherLanguage,getPrincipalSpriteFrontPokemon} from '../../utils/transform';
type P = {
    url : string;
    pokemon: PokeType
    }
import {baseUrl} from '../../utils/apiAndDatabase';
import SimpleEvolution from './SimpleEvolution';
function Evolutions({url}:P) {
    const [evolutions, setevolutions] = useState<Array<string>>();
    const [urlToFetch, seturlToFetch] = useState();
    const [getFirst, setgetFirst] = useState<any>();
    useEffect(()=>{
        axios.get(url)
        .then(x => {
            const accu:Array<any> = [];
            function recurse(elem:any) {
                if(elem.evolves_to.length === 0){
                    accu.push({url:elem.species.url, evolution_details: elem.evolution_details, name: elem.species.name});
                    return;
                }
                // elem.evolves_to.map((l:any,idx:number )=> {
                //     if(l.evolves_to.length  ===  0){
                //         accu.push({url:l.species.url, evolution_details: l.evolution_details,name: l.species.name});
                //         recurse(l.evolves_to[idx]);
                //     }else{
                //         accu.push({url:l.species.url, evolution_details: l.evolution_details,name: elem.species.name});
                //         recurse(l.evolves_to[idx])
                //     }
                // })
                if(elem.evolves_to[0].evolves_to.length  ===  0) {
                    accu.push({url:elem.species.url, evolution_details: elem.evolution_details,name: elem.species.name});
                    recurse(elem.evolves_to[0]);
                    
                    } else {
                        accu.push({url:elem.species.url, evolution_details: elem.evolution_details,name: elem.species.name});
                        recurse(elem.evolves_to[0]);
                    }
            }
                recurse(x.data.chain.evolves_to[0]);
                const accuFiltered = accu.map((x,i)=>{
                    if(i === 0){
                        return {...x, isFirst : true}
                    }else{
                        return {...x, isFirst : false}
                    }
                    
                })
                setevolutions(accuFiltered);
     } )
        .catch(err => {
          console.error(err);
      })
      },[url]);
      function getFirstEvolution(finalPokemon:string){
          axios.get(finalPokemon).then(poke => {
            const poke1 = poke.data;
            axios.get(baseUrl+`pokemon/${poke1.id}`).then(poke2 => {
                    poke1.friendlyName = getNameInOtherLanguage(poke1,'fr')
                    const finalPokemon2 = {...poke1,...poke2.data};
                    setgetFirst(finalPokemon2)
            })
    }).catch(err => {
        console.log('🚀🐱 😻 --///** ~ file: EvolutionItem.tsx:42 ~ axios.get ~ err:', err)
    });
      }
      useEffect(()=>{
        if(urlToFetch){
            getFirstEvolution(urlToFetch)
        }

      },[urlToFetch])
      if(!evolutions || evolutions.length === 0){
        return null
      }
  return (
    <div> 
        <h2>Evolutions</h2>
        <div style={{display: 'flex' ,width: '90%', margin: '25px auto',justifyContent: 'center' }}>
          {getFirst &&
          <div>
              <SimpleEvolution datas={getFirst} officialArtWork={getPrincipalSpriteFrontPokemon(getFirst)} id={getFirst.id} /> 
          </div>
            }
            {evolutions?.map((evol:any )=> {
             return   <EvolutionItem evol={evol.url} key={evol.id} evolArray={evol.evolution_details}   isFirst={evol.isFirst} seturlToFetch={seturlToFetch}/>

            })}

        </div>
    </div>
  )
}

export default Evolutions