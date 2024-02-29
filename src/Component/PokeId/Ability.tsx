import React ,{useState, useEffect} from 'react'
import axios from 'axios';
type Ability = {
    name? : string;
    url : string;
    }
export default function Ability({url}: Ability) {
    const [abilityObject, setAbilityObject] = useState([]);

    useEffect(()=>{
        axios.get(url)
        .then(x => {
          const data = x.data;
          const name = data.names.find(el => el.language.name === 'fr');
          const sumOfAbility = data.flavor_text_entries.reduce(
            (accumulator, currentValue) => {
              if(currentValue.language.name === 'fr'){
                return accumulator = [...accumulator, currentValue]
              }
              return accumulator
         
            },
            [],
          );
          const abilityNewObj = {
            name : name.name,
            sumOfAbility : sumOfAbility
          }
          setAbilityObject(abilityNewObj)
        })
        .catch(err => {
          console.error(err);
        })
      },[]);
  return (
    <div className='ability'>
        <p> <span>{abilityObject.name} : </span>
       {abilityObject.hasOwnProperty('sumOfAbility') && abilityObject?.sumOfAbility[0]?.flavor_text} </p>
        </div>
  )
}
