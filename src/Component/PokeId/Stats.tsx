import React from 'react'
import ProgressBar from '../UI/ProgressBar'


const arrayOfStats = [
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
export default function Stats({stats, color}) {
  return (
    <div className='element-stat'>
       
        {stats && stats.map(statElement =>
        <div key={statElement.stat.name}>
           <span style={{color: color}}>{arrayOfStats.find(e => e.key === statElement.stat.name).label}</span>
           <ProgressBar percentRange={statElement.base_stat} color={color} max={255} />
        </div>
        )}
    </div>
  )
}
