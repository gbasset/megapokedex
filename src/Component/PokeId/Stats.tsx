import ProgressBar from '../UI/ProgressBar'
import styles from './Stats.module.css'

const arrayOfStats: Array<{label: string; key: string;}> = [
    { label: 'PV', key: 'hp' },
    { label: 'Attaque', key: 'attack' },
    { label: 'Défense', key: 'defense' },
    { label: 'Attaque Spéciale', key: 'special-attack' },
    { label: 'Défense Spéciale', key: 'special-defense' },
    { label: 'Vitesse', key: 'speed' },
]

type StatsTypes = {
    stats: [{
        base_stat: number;
        effort: number;
        stat: {
            name: string;
            url: string;
        }
    }];
    color: string
}

export default function Stats({ stats, color }: StatsTypes) {
    return (
        <div className={styles.elementStatContainer}>
            {stats && stats.map(statElement => {
                const findElement = arrayOfStats.find(e => e.key === statElement.stat.name)
                return (
                    <div key={statElement.stat.name} className={styles.statItem}>
                        <div className={styles.statLabel} style={{ color: color }}>
                            <span>{findElement ? findElement.label : ''}</span>
                            <span>{statElement.base_stat}</span>
                        </div>
                        <div className={styles.progressContainer}>
                            <ProgressBar percentRange={statElement.base_stat} color={color} max={255} />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
