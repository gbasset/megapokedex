import React, { useEffect,useState } from 'react'
import {PokeType,sprite} from '../../../type-pokemons';
import axios from 'axios';
import {getNameInOtherLanguage,getPrincipalSpriteFrontPokemon} from '../../utils/transform';
import {baseUrl} from '../../utils/apiAndDatabase';
import Image from '../UI/Image.js';
import styles from './PodeId.module.css';
import arrow from '../../assets/right-arrow.png'
type P = {
    evol? : string;
    isEvolveFrom?:boolean,
    evolArray?:any,
    isFirst:boolean,
    pokemon?: PokeType
    }
function EvolutionItem({evol,isEvolveFrom,evolArray,isFirst,pokemon}:P) {
console.log('🚀🐱 😻 --///** ~ file: EvolutionItem.tsx:15 ~ EvolutionItem ~ evol:', evol)
console.log('🚀🐱 😻 --///** ~ file: isEvolveFrom.tsx:14 ~ EvolutionItem ~ evolArray:', evolArray,isEvolveFrom,isFirst)


  const [officialArtWork, setofficialArtWork] = useState<sprite | any>(undefined);
     console.log('🚀🐱 😻 --///** ~ file: EvolutionItem.tsx:10 ~ EvolutionItem ~ officialArtWork:', officialArtWork)
     const [datas, setdatas] = useState<PokeType>();
     console.log('🚀🐱 😻 --///** ~ file: EvolutionItem.tsx:9 ~ EvolutionItem ~ datas:', datas)
  useEffect(
    ()=>{
        if(!isFirst){
            axios.get(evol)
            .then((res:any) =>{
              const d = res.data
              console.log('🚀🐱 😻 --///** ~ file: EvolutionItem.tsx:13 ~ .then ~ d:', d)
              axios.get(baseUrl+`pokemon/${d.id}`).then(poke => {
                  const dat = poke.data;
                  dat.friendlyName = getNameInOtherLanguage(d,'fr')
                  setofficialArtWork(getPrincipalSpriteFrontPokemon(dat));
                  setdatas({...dat,...d});
              }).catch(err => {
                console.error(err);
              })
            })
            .catch(err => {
                console.error(err);
            });
        }else{
            setdatas(pokemon);
            setofficialArtWork(getPrincipalSpriteFrontPokemon(pokemon));
        }
},[isFirst]);

  return (
    <div style={{display: 'flex', margin: 'auto' }}>
   
    {!isEvolveFrom && evolArray && !isFirst  &&
        <div style={{display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center'}}>
           <span> Level +  {evolArray[0]?.min_level}</span>
            <img className={styles.image_container_img_mini}  alt={'arrow'} src={arrow} />
        </div>
        }
    <div className={styles.image_container}>
        <div className={styles.image_container_boxes}>
          <span> {datas?.friendlyName}</span>
          {
            <Image
            className={styles.image_container_img_small}
            placeholderImg='https://via.placeholder.com/479x479.png/f9f9f9/FFF?text=Chargement+du+media'
            errorImg='https://via.placeholder.com/479x479.png/f9f9f9/FFF?text=Chargement+du+media'
            src={officialArtWork && officialArtWork['front_default' ]}
          />        
        }

        </div>
       
        </div>
    </div>
  )
}

export default EvolutionItem