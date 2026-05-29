import { useMemo } from 'react';
import { ComparisonPokemon } from './types/comparison.types';
import styles from './Comparison.module.css';

interface RadarChartProps {
  firstPokemon: ComparisonPokemon;
  secondPokemon: ComparisonPokemon;
}

const SVG_SIZE = 300;
const CENTER = SVG_SIZE / 2;
const RADIUS = 110;
const MAX_STAT = 255;

function getPolygonPoints(values: number[]): string {
  return values
    .map((value, index) => {
      const angle = (Math.PI * 2 * index) / values.length - Math.PI / 2;
      const ratio = Math.min(value / MAX_STAT, 1);
      const x = CENTER + Math.cos(angle) * RADIUS * ratio;
      const y = CENTER + Math.sin(angle) * RADIUS * ratio;

      return `${x},${y}`;
    })
    .join(' ');
}

function getAxisPoint(index: number, total: number, radius = RADIUS): { x: number; y: number } {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;

  return {
    x: CENTER + Math.cos(angle) * radius,
    y: CENTER + Math.sin(angle) * radius,
  };
}

export default function RadarChart({ firstPokemon, secondPokemon }: RadarChartProps) {
  const labels = firstPokemon.stats.map((stat) => stat.label);
  const firstPoints = useMemo(() => getPolygonPoints(firstPokemon.stats.map((stat) => stat.value)), [firstPokemon.stats]);
  const secondPoints = useMemo(() => getPolygonPoints(secondPokemon.stats.map((stat) => stat.value)), [secondPokemon.stats]);

  return (
    <div className={styles.chartCard}>
      <div className={styles.sectionTitleBlock}>
        <span>Profil global</span>
        <h2>Radar chart</h2>
      </div>
      <svg className={styles.radarChart} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} role="img" aria-label="Radar des statistiques comparées">
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <polygon
            key={ratio}
            points={labels.map((_, index) => {
              const point = getAxisPoint(index, labels.length, RADIUS * ratio);
              return `${point.x},${point.y}`;
            }).join(' ')}
            className={styles.radarGrid}
          />
        ))}
        {labels.map((label, index) => {
          const point = getAxisPoint(index, labels.length);
          const labelPoint = getAxisPoint(index, labels.length, RADIUS + 24);

          return (
            <g key={label}>
              <line x1={CENTER} y1={CENTER} x2={point.x} y2={point.y} className={styles.radarAxis} />
              <text x={labelPoint.x} y={labelPoint.y} textAnchor="middle" dominantBaseline="middle" className={styles.radarLabel}>
                {label}
              </text>
            </g>
          );
        })}
        <polygon points={firstPoints} className={styles.radarFirst} />
        <polygon points={secondPoints} className={styles.radarSecond} />
      </svg>
      <div className={styles.legend}>
        <span><i className={styles.legendFirst} />{firstPokemon.friendlyName}</span>
        <span><i className={styles.legendSecond} />{secondPokemon.friendlyName}</span>
      </div>
    </div>
  );
}
