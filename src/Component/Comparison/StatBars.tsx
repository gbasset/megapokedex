import { ComparisonPokemon, StatComparison } from './types/comparison.types';
import styles from './Comparison.module.css';

interface StatBarsProps {
  firstPokemon: ComparisonPokemon;
  secondPokemon: ComparisonPokemon;
  statComparisons: StatComparison[];
}

const MAX_STAT = 255;

export default function StatBars({ firstPokemon, secondPokemon, statComparisons }: StatBarsProps) {
  return (
    <div className={styles.chartCard}>
      <div className={styles.sectionTitleBlock}>
        <span>Stat par stat</span>
        <h2>Barres comparatives</h2>
      </div>
      <div className={styles.statRows}>
        {statComparisons.map((stat) => {
          const firstWidth = `${Math.min((stat.firstValue / MAX_STAT) * 100, 100)}%`;
          const secondWidth = `${Math.min((stat.secondValue / MAX_STAT) * 100, 100)}%`;

          return (
            <div key={stat.key} className={styles.statRow}>
              <div className={styles.statHeader}>
                <strong>{stat.label}</strong>
                <span>{stat.firstValue} / {stat.secondValue}</span>
              </div>
              <div className={styles.groupedBars}>
                <span>{firstPokemon.friendlyName}</span>
                <div className={styles.barTrack}>
                  <div
                    className={stat.winner === 'first' ? styles.barWinner : styles.bar}
                    style={{ width: firstWidth }}
                  />
                </div>
                <span>{secondPokemon.friendlyName}</span>
                <div className={styles.barTrack}>
                  <div
                    className={stat.winner === 'second' ? styles.barWinnerSecond : styles.barSecond}
                    style={{ width: secondWidth }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
