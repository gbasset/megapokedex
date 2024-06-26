import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {baseUrl, colorByPokemonTypes} from '../../utils/apiAndDatabase';
import {getNameInOtherLanguage,getPrincipalSpriteFrontPokemon} from '../../utils/transform';
import styles from './PodeId.module.css';
import {UseMainContext} from '../../context/MainContext.jsx';
import PokeLoader from '../UI/PokeLoader.js';
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { v4 as uuidv4 } from 'uuid';
import Habitat from './Habitat.js';
import Ability from './Ability.js';

import Stats from './Stats.js';
import Varieties from './Varieties.js';
import Image from '../UI/Image.js';

import {
  flavor_text_entrie,
  PokeType,
  sprite} from '../../../type-pokemons.ts';
import SvgMal from './SvgMal.tsx';
import SvgFemale from './SvgFemale.tsx';
import Evolutions from './Evolutions.tsx';


 function calculLabelByHeight (element : number) {
  if(element <= 0.99){
    return element * 100 + ' cm'
  }else{
    if(element === 1){
      return element + ' mètre'
    }else{
      return element + ' mètres';
    }
  }
 }
 function calculLabelByWeight (element : number) {
  if(element <= 0.99){
    return element * 100 + ' gramme'
  }else{
    if(element === 1){
      return element + ' kilo'
    }else{
      return element + ' kilos';
    }
  }
 }
 function getTypeData (element: any){
   const elementType = colorByPokemonTypes.find( x=> x.type === element.type.name) ;
   return elementType;
 }
export default function PokeId() {
  const {
    setmainInformationPokemonSelected,
    handleChooseShiny,
    genre,
    setGenre,
    isShinny,
    color
  } = UseMainContext();

  const {id} = useParams();
  const [pokemon, setpokemon] = useState<PokeType | undefined>()
  console.log('🚀🐱 😻 --///** ~ file: PokeId.tsx:9 ~ PokeId ~ pokemon:', pokemon)
  const [elementDescription, setelementDescription] = useState<[flavor_text_entrie | []]>([]);


  const [officialArtWork, setofficialArtWork] = useState<sprite | any>(undefined);
  const [isLoading, setisLoading] = useState(true);
  function getFavoriteText (poke: PokeType | any, idLanguage: string){
    const txtFav = poke.flavor_text_entries.filter((txt:flavor_text_entrie )=> txt.language.name === idLanguage);
    return txtFav.filter((x:flavor_text_entrie )=> x.version.name === "sword");
  }
 
  useEffect(()=>{
    axios.get(baseUrl+`pokemon-species/${id}`)
    .then(res =>{
      const poke = res.data
      axios.get(baseUrl+`pokemon/${poke.id}`)
      .then(x => {
       return{
        ...poke,
        ...x.data
       }
      }).then(
        elementPoke => {
          elementPoke.friendlyName = getNameInOtherLanguage(elementPoke,'fr')
          setisLoading(false);
          setpokemon(elementPoke);
          setmainInformationPokemonSelected(elementPoke);
        setelementDescription(getFavoriteText(elementPoke, 'fr'))
        setofficialArtWork(getPrincipalSpriteFrontPokemon(elementPoke));
        }
      )
    })
    .catch(err => {
        console.error(err);
        setisLoading(false);
    })
},[id,setpokemon,setisLoading,setmainInformationPokemonSelected]);


useEffect(()=> {
  if(pokemon){
    if(!pokemon.has_gender_differences){
      if(genre === 'female'){
        setGenre('normal')
      }
    }
  }
},[genre, pokemon,setGenre])



  return (
    <div>
       {isLoading && <PokeLoader />}

        <div className={styles.name}>
             <h1>{pokemon?.friendlyName}</h1> 
             <h3># {pokemon?.id}</h3>
             <div className={styles.types}>
             {pokemon?.types.map((x ,i)=> {
              const type  = getTypeData(x);
              const idV = uuidv4();
                return <div key={i} className={styles.pokemon_types} data-tooltip-id={idV}
                data-tooltip-content={type?.label}
                >
                <ReactTooltip
                  id={idV}
                  place="bottom"
                  delayShow={600} />
                  <img src={type?.image} alt={type?.label} />
                  </div>
              }
            )}
             </div>
            <div>
            {elementDescription && elementDescription.map((el:flavor_text_entrie | any,idx) => {
            return <p key={idx}>{el.flavor_text}</p>
          })}
            </div>

           
        </div>
    {!isLoading && <div className={styles.pokemon_card}>
    {pokemon &&

       <section className={styles.element}>
        <div className={styles.element_container}>
        <h3>Statistiques de bases</h3>
       <Stats stats={pokemon.stats} color={color} />
      
       </div>
       </section>}

        <div className={styles.image_container}>
        <div className={styles.image_container_boxes}>
          {isShinny && genre === 'female' &&
            <Image
            className={styles.image_container_img}
            placeholderImg='https://via.placeholder.com/479x479.png/f9f9f9/FFF?text=Chargement+du+media'
            errorImg='https://via.placeholder.com/479x479.png/f9f9f9/FFF?text=Chargement+du+media'
            src={officialArtWork && officialArtWork['front_shiny_female']}
          />       
        }
          {isShinny && genre !== 'female' &&
            <Image
            className={styles.image_container_img}
            placeholderImg='https://via.placeholder.com/479x479.png/f9f9f9/FFF?text=Chargement+du+media'
            errorImg='https://via.placeholder.com/479x479.png/f9f9f9/FFF?text=Chargement+du+media'
            src={officialArtWork && officialArtWork['front_shiny']}
          />       
        }
          {!isShinny && genre === 'female' &&
            <Image
            className={styles.image_container_img}
            placeholderImg='https://via.placeholder.com/479x479.png/f9f9f9/FFF?text=Chargement+du+media'
            errorImg='https://via.placeholder.com/479x479.png/f9f9f9/FFF?text=Chargement+du+media'
            src={officialArtWork && officialArtWork['front_female' ]}
          />        
        }
          {!isShinny && genre !== 'female' &&
            <Image
            className={styles.image_container_img}
            placeholderImg='https://via.placeholder.com/479x479.png/f9f9f9/FFF?text=Chargement+du+media'
            errorImg='https://via.placeholder.com/479x479.png/f9f9f9/FFF?text=Chargement+du+media'
            src={officialArtWork && officialArtWork['front_default' ]}
          />        
        }
        </div>

        <div className={styles.containerBtn}>
        <button onClick={()=>handleChooseShiny()} style={{backgroundColor: isShinny ? 'var(--darkyellow)' : 'var(--blue)' }}>   <img className={styles.imageBtn}src="https://raw.githubusercontent.com/msikma/pokesprite/master/misc/special-attribute/shiny-stars.png" alt="" height={'25px'} /></button>
      {
        pokemon?.has_gender_differences &&
        <button onClick={()=>setGenre(genre === 'female' ? 'normal': 'female')}> 
        {genre === 'female' ? 'Femelle' : 'Male'} 
        {genre !== 'female'  && <SvgMal/>}
       { genre === 'female' && <SvgFemale/> }
        </button>
      }
        </div>
        </div>
        <section className={styles.element}>
        {pokemon && <>
        <div className={styles.element_container}>
        <h3>Caractéristiques</h3>
          <div className={styles.container_element}><span>Taille :</span> {calculLabelByHeight(pokemon?.height / 10)}</div>
          <div className={styles.container_element}><span>Poids :</span> {calculLabelByWeight(pokemon?.weight / 10)}</div>
          <div className={styles.container_element}><span>Légendaire :</span> {pokemon?.is_legendary ? 'Oui' : 'Non'}</div>
          <div className={styles.container_element}><span>Fabuleux :</span> {pokemon?.is_mythical ? 'Oui' : 'Non'}</div>
          <div className={styles.container_element}><span> Éxpérience de base:</span> {pokemon?.base_experience}</div>
          <div className={styles.container_element}><span>Bonheur de base:</span> {pokemon?.base_happiness}</div>
          <div className={styles.container_element}><span>Taux de capture:</span> {pokemon?.capture_rate}</div>
          { <Habitat url={pokemon?.habitat?.url}/> }
        </div>
        </>
      }
        </section>
             
    </div>}
    {pokemon && pokemon?.abilities?.length > 0 && 
         <section className={styles.element}>
        <div className={styles.element_container}>
         <h3>Talents</h3>
          {pokemon?.abilities.map((ability, i) => {
          return <Ability key={i} url={ability.ability.url} /> })}
        </div>
        </section>
        }
    {pokemon &&  <div>
        {pokemon?.varieties.filter(v => !v.is_default).map(variety => <Varieties key={variety.pokemon.name} variety={variety}></Varieties>)
        }
        <Evolutions url={pokemon.evolution_chain.url} pokemon={pokemon}/>
      </div>}
      </div>
  )
}
