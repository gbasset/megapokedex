import React ,{useState, useEffect} from 'react'
import axios from 'axios';
import { flavor_text_entrie } from '../../../type-pokemons';
type Ability = {
    name? : string;
    url : string;
    }
interface ability {
  name : string;
  sumOfAbility : [flavor_text_entrie]
}
export default function Ability({url}: Ability) {
    const [abilityObject, setAbilityObject] = useState<ability| undefined>();

    useEffect(()=>{
        axios.get(url)
        .then(x => {
          const data = x.data;
          const name = data.names.find((el:any) => el.language.name === 'fr');
          const sumOfAbility = data.flavor_text_entries.reduce(
            (accumulator:Array<flavor_text_entrie>, currentValue:flavor_text_entrie) => {
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
      {abilityObject && 
        <p> <span>{abilityObject.name} : </span>
       {Object.prototype.hasOwnProperty.call(abilityObject,'sumOfAbility') && abilityObject?.sumOfAbility[0]?.flavor_text} </p>
      
      }
        </div>
  )
}
