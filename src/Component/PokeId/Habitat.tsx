import { Fragment, useEffect ,useState} from 'react'
import axios from 'axios';
import styles from './PokemonProfile.module.css';

type Habitat = {
  name? : string;
  url : string;
  }

interface HabitatName {
  name?: unknown;
  language?: {
    name?: unknown;
  };
}
  
  export default function Habitat({url} : Habitat) {
      const [habitat, setHabitat] = useState<string[]>([]);
     

    useEffect(()=>{
      axios.get(url)
      .then(x => {
        const response = (x.data ?? {}) as Record<string, unknown>;
        const data = Array.isArray(response.names) ? response.names : [];
        const sumOfHabit = data.reduce(
          (accumulator:Array<string>, currentValue: unknown) => {
            const habitatName = currentValue as HabitatName;
            if(habitatName.language?.name === 'fr' && typeof habitatName.name === 'string'){
              if(accumulator !== undefined){
                return accumulator = [...accumulator, habitatName.name];
              }else{
                accumulator = [habitatName.name];
              }
            }
            return accumulator;
       
          },
          [],
        );
      
        setHabitat(sumOfHabit);
      })
      .catch(err => {
        console.error(err);
      })
    },[]);
    if(!url || habitat.length === 0){
      return null;
    }
    
    return (
     
      <div className={styles.characteristicItem}>
        <span className={styles.characteristicLabel}>Habitat :</span>
        <span className={styles.characteristicValue}>
          {habitat.map((x, i) => {
            return <Fragment key={i}>{x}</Fragment>
          })}
        </span>
      </div>
      )
    }
