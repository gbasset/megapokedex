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
import ProgressBar from '../UI/ProgressBar.js';
import Stats from './Stats.js';
import Varieties from './Varieties.js';

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
  const [pokemon, setpokemon] = useState()
  console.log('🚀🐱 😻 --///** ~ file: PokeId.tsx:9 ~ PokeId ~ pokemon:', pokemon)
  const [elementDescription, setelementDescription] = useState([]);
  const [evolutions, setevolutions] = useState({});
  const [officialArtWork, setofficialArtWork] = useState();
  const [isLoading, setisLoading] = useState(true);
  function getFavoriteText (poke, idLanguage: string){
    const txtFav = poke.flavor_text_entries.filter(txt => txt.language.name === idLanguage);
    return txtFav.filter(x => x.version.name === "sword");
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
        }
      )
    })
    .catch(err => {
        console.error(err);
        setisLoading(false);
    })
},[id]);

useEffect(()=>{
  if(pokemon){
    setelementDescription(getFavoriteText(pokemon, 'fr'))
    setofficialArtWork(getPrincipalSpriteFrontPokemon(pokemon));
  }
},[pokemon])
useEffect(()=> {
  if(pokemon){
    if(!pokemon.has_gender_differences){
      if(genre === 'female'){
        setGenre('normal')
      }
    }
  }
},[genre, pokemon,setGenre])

useEffect(()=>{
  axios.get(baseUrl+`evolution-chain/${id}`)
  .then(x => {
    setevolutions(x.data)
  })
  .catch(err => {
    console.error(err);
})
},[]);


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
            <div>
            {elementDescription.map((el,idx) => {
            return <p key={idx}>{el.flavor_text}</p>
          })}
            </div>

           
        </div>
    {!isLoading && <div className={styles.pokemon_card}>
        <div className={styles.element}>
       <Stats stats={pokemon?.stats} color={color} />
        {pokemon?.abilities.length !== 0 && 
        <>
         <h3>Talents</h3>
          {pokemon?.abilities.map((ability, i) => {
          return <Ability key={i} url={ability.ability.url} /> })}
        </>
        }
       
        </div>
        <div className={styles.image_container}>
          {isShinny && 
          <img src={officialArtWork && officialArtWork[genre === 'female' ? 'front_shiny_female': 'front_shiny' ]} alt={pokemon?.friendlyName} className={styles.image_front}/>          
        }
          {!isShinny && 
          <img src={officialArtWork && officialArtWork[genre === 'female' ? 'front_female': 'front_default' ]} alt={pokemon?.friendlyName} className={styles.image_front}/>          
        }
        <div className={styles.containerBtn}>
        <button onClick={()=>handleChooseShiny()} style={{backgroundColor: isShinny ? 'var(--darkyellow)' : 'var(--blue)' }}>   <img src="https://raw.githubusercontent.com/msikma/pokesprite/master/misc/special-attribute/shiny-stars.png" alt="" height={'25px'} /></button>
      {
        pokemon?.has_gender_differences &&
        <button onClick={()=>setGenre(genre === 'female' ? 'normal': 'female')}> 
        {genre === 'female' ? 'Femelle' : 'Male'} 
        {genre !== 'female'  && <svg height='25px' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5631 16.1199C14.871 16.81 13.9885 17.2774 13.0288 17.462C12.0617 17.6492 11.0607 17.5459 10.1523 17.165C8.29113 16.3858 7.07347 14.5723 7.05656 12.5547C7.04683 11.0715 7.70821 9.66348 8.8559 8.72397C10.0036 7.78445 11.5145 7.4142 12.9666 7.71668C13.9237 7.9338 14.7953 8.42902 15.4718 9.14008C16.4206 10.0503 16.9696 11.2996 16.9985 12.6141C17.008 13.9276 16.491 15.1903 15.5631 16.1199Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14.9415 8.60977C14.6486 8.90266 14.6486 9.37754 14.9415 9.67043C15.2344 9.96332 15.7093 9.96332 16.0022 9.67043L14.9415 8.60977ZM18.9635 6.70907C19.2564 6.41617 19.2564 5.9413 18.9635 5.64841C18.6706 5.35551 18.1958 5.35551 17.9029 5.64841L18.9635 6.70907ZM16.0944 5.41461C15.6802 5.41211 15.3424 5.74586 15.3399 6.16007C15.3374 6.57428 15.6711 6.91208 16.0853 6.91458L16.0944 5.41461ZM18.4287 6.92872C18.8429 6.93122 19.1807 6.59747 19.1832 6.18326C19.1857 5.76906 18.8519 5.43125 18.4377 5.42875L18.4287 6.92872ZM19.1832 6.17421C19.1807 5.76001 18.8429 5.42625 18.4287 5.42875C18.0145 5.43125 17.6807 5.76906 17.6832 6.18326L19.1832 6.17421ZM17.6973 8.52662C17.6998 8.94082 18.0377 9.27458 18.4519 9.27208C18.8661 9.26958 19.1998 8.93177 19.1973 8.51756L17.6973 8.52662ZM16.0022 9.67043L18.9635 6.70907L17.9029 5.64841L14.9415 8.60977L16.0022 9.67043ZM16.0853 6.91458L18.4287 6.92872L18.4377 5.42875L16.0944 5.41461L16.0853 6.91458ZM17.6832 6.18326L17.6973 8.52662L19.1973 8.51756L19.1832 6.17421L17.6832 6.18326Z" fill="#ffffff"></path> </g></svg>}
       { genre === 'female' && <svg height={'25px'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M7 9.94172C7.00137 8.96443 7.29495 8.00988 7.843 7.20072C8.39448 6.38448 9.1753 5.7498 10.087 5.37672C11.9541 4.61174 14.0974 5.033 15.536 6.44772C16.5916 7.4896 17.1196 8.95291 16.9724 10.4288C16.8252 11.9047 16.0186 13.2349 14.778 14.0477C13.9477 14.571 12.9812 14.8372 12 14.8127C10.6855 14.84 9.41385 14.3448 8.464 13.4357C7.52845 12.5137 7.00119 11.2553 7 9.94172Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12.75 14.8127C12.75 14.3985 12.4142 14.0627 12 14.0627C11.5858 14.0627 11.25 14.3985 11.25 14.8127H12.75ZM11.25 17.0007C11.25 17.415 11.5858 17.7507 12 17.7507C12.4142 17.7507 12.75 17.415 12.75 17.0007H11.25ZM14 17.7507C14.4142 17.7507 14.75 17.415 14.75 17.0007C14.75 16.5865 14.4142 16.2507 14 16.2507V17.7507ZM12 16.2507C11.5858 16.2507 11.25 16.5865 11.25 17.0007C11.25 17.415 11.5858 17.7507 12 17.7507V16.2507ZM11.25 19.0007C11.25 19.415 11.5858 19.7507 12 19.7507C12.4142 19.7507 12.75 19.415 12.75 19.0007H11.25ZM12.75 17.0007C12.75 16.5865 12.4142 16.2507 12 16.2507C11.5858 16.2507 11.25 16.5865 11.25 17.0007H12.75ZM12 17.7507C12.4142 17.7507 12.75 17.415 12.75 17.0007C12.75 16.5865 12.4142 16.2507 12 16.2507V17.7507ZM10 16.2507C9.58579 16.2507 9.25 16.5865 9.25 17.0007C9.25 17.415 9.58579 17.7507 10 17.7507V16.2507ZM11.25 14.8127V17.0007H12.75V14.8127H11.25ZM14 16.2507H12V17.7507H14V16.2507ZM12.75 19.0007V17.0007H11.25V19.0007H12.75ZM12 16.2507H10V17.7507H12V16.2507Z" fill="#ffffff"></path> </g></svg>}
        </button>
      }
        </div>

        </div>
        <section className={styles.element}>
        <h3>Caractéristiques</h3>
          <div className={styles.container_element}><span>Taille :</span> {calculLabelByHeight(pokemon?.height / 10)}</div>
          <div className={styles.container_element}><span>Poids :</span> {calculLabelByWeight(pokemon?.weight / 10)}</div>
          <div className={styles.container_element}><span>Légendaire :</span> {pokemon?.is_legendary ? 'Oui' : 'Non'}</div>
          <div className={styles.container_element}><span>Fabuleux :</span> {pokemon?.is_mythical ? 'Oui' : 'Non'}</div>
          <div className={styles.container_element}><span> Éxpérience de base:</span> {pokemon?.base_experience}</div>
          <div className={styles.container_element}><span>Bonheur de base:</span> {pokemon?.base_happiness}</div>
          <div className={styles.container_element}><span>Taux de capture:</span> {pokemon?.capture_rate}</div>
          {pokemon?.habitat !== null && <Habitat url={pokemon?.habitat.url}/> }
        </section>
             
    </div>}
      <div>
        {pokemon?.varieties.filter(v => !v.is_default).map(variety => <Varieties key={variety.pokemon.name} variety={variety}></Varieties>)
        }
      </div>
      </div>
  )
}
