
import ProgressBar from '../UI/ProgressBar'


const arrayOfStats: Array<{label: string; key:string;}> = [
    {
        label : 'PV',
        key : 'hp'
    },
    {
        label : 'Attaque',
        key : 'attack'
    },
    {
        label : 'Défense',
        key : 'defense'
    },
    {
        label : 'Attaque Spéciale',
        key : 'special-attack'
    },
    {
        label : 'Défense Spéciale',
        key : 'special-defense'
    },
    {
        label : 'Vitesse',
        key : 'speed'
    },
]
type StatsTypes = {
    stats : [
        {
            base_stat   : number;
            effort : number;
            stat:{
                name : string;
                url: string;
            }
         }],
    color : string
}
export default function Stats({stats, color}:StatsTypes) {
  return (
    <div className='element-stat'>
       
        {stats && stats.map(statElement => {
            const findElement = arrayOfStats.find(e => e.key === statElement.stat.name)
        return <div key={statElement.stat.name}>
           <span style={{color: color}}>{findElement ? findElement.label : ''} {statElement.base_stat}</span>
           <ProgressBar percentRange={statElement.base_stat} color={color} max={255} />
           
        </div>
        }
        )}
    </div>
  )
}
