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
  console.log('🚀🐱 😻 --///** ~ file: Stats.tsx:32 ~ Stats ~ stats:', stats)
  return (
    <div className='element-stat'>
        <h3>Statistiques de bases</h3>
        {stats && stats.map(statElement =>
        <>
           <span style={{color: color}}>{arrayOfStats.find(e => e.key === statElement.stat.name).label}</span>
           <ProgressBar percentRange={statElement.base_stat} color={color} max={255} />
        </>
        )}
    </div>
  )
}
