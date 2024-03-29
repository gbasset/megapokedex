import React, { Fragment, useEffect ,useState} from 'react'
import axios from 'axios';
import styles from './PodeId.module.css';
 type Habitat = {
  name? : string;
  url : string;
  }
  
  export default function Habitat({url} : Habitat) {
    const [habitat, setHabitat] = useState([]);

    useEffect(()=>{
      axios.get(url)
      .then(x => {
        const data = x.data.names;
        const sumOfHabit = data.reduce(
          (accumulator:[] | [string] | undefined, currentValue: any) => {
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
    return (
     
      <div className={styles.container_element}>
      <span>Habitat : </span>  {habitat.map((x, i) => {
        return <Fragment key={i}>{x}</Fragment>
      })} 
      
      </div>
      )
    }
    Habitat.propTypes = {
      objectElement: Habitat
    };
