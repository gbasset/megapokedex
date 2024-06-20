import React, { Fragment, useEffect ,useState} from 'react'
import axios from 'axios';
import styles from './PodeId.module.css';
 type Habitat = {
  name? : string;
  url : string;
  }
  
  export default function Habitat({url} : Habitat) {
      console.log('🚀🐱 😻 --///** ~ file: Habitat.tsx:10 ~ Habitat ~ url:', url)
      const [habitat, setHabitat] = useState([]);
     

    useEffect(()=>{
      axios.get(url)
      .then(x => {
        const data = x.data.names;
        const sumOfHabit = data.reduce(
          (accumulator:Array<string>, currentValue: any) => {
            if(currentValue.language.name === 'fr'){
              if(accumulator !== undefined){
                return accumulator = [...accumulator, currentValue.name];
              }else{
                accumulator = [currentValue.name];
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
     
      <div className={styles.container_element}>
      <span>Habitat : </span>  {habitat.map((x, i) => {
        return <Fragment key={i}>{x}</Fragment>
      })} 
      
      </div>
      )
    }
