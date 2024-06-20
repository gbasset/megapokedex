import React, { useEffect,useState } from 'react'
import {PokeType,sprite} from '../../../type-pokemons';
import axios from 'axios';
import {getNameInOtherLanguage,getPrincipalSpriteFrontPokemon} from '../../utils/transform';
import {baseUrl} from '../../utils/apiAndDatabase';

import styles from './PodeId.module.css';
import arrow from '../../assets/right-arrow.png'
import SimpleEvolution from './SimpleEvolution';
type P = {
    evol? : string;
    isEvolveFrom?:boolean,
    evolArray?:any,
    isFirst:boolean,
    seturlToFetch?: any;
    }
function EvolutionItem({evol,evolArray,isFirst,seturlToFetch}:P) {

  const [officialArtWork, setofficialArtWork] = useState<sprite | any>(undefined);
     const [datas, setdatas] = useState<PokeType>();
     console.log('🚀🐱 😻 --///** ~ file: EvolutionItem.tsx:21 ~ EvolutionItem ~ datas:', datas)
     const [id, setid] = useState<string>()
  useEffect(()=>{
        axios.get(evol)
        .then((res:any) =>{
            const d = res.data
            setid(d.id)
        axios.get(baseUrl+`pokemon/${d.id}`)
        .then(poke => {
             const dat = poke.data;
                dat.friendlyName = getNameInOtherLanguage(d,'fr')
                setofficialArtWork(getPrincipalSpriteFrontPokemon(dat));
                const finalPokemon = {...dat,...d};
                setdatas(finalPokemon);
                if(isFirst){
                    if(finalPokemon?.evolves_from_species){
                        seturlToFetch(finalPokemon.evolves_from_species.url)
                        }
                }
              }).catch(err => {
                console.error(err);
              });
            })
            .catch(err => {
                console.error(err);
            });
    
},[]);


  return (
    <div style={{display: 'flex' ,alignItems: 'center' }}>
   
    {evolArray &&
        <div style={{display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', width: '200px'}}>
           <strong> Level +  {evolArray[0]?.min_level}</strong>
            <img className={styles.image_container_img_mini}  alt={'arrow'} src={arrow} />
        </div>
        }
        {id && datas&& 
        <SimpleEvolution officialArtWork={officialArtWork} datas={datas} id={id} />
    
        }
    </div>
  )
}

export default EvolutionItem