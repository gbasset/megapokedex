import { type CSSProperties } from 'react';
import { DamageMultiplier, DamageProfile } from './types/comparison.types';
import styles from './Comparison.module.css';

interface DamageBadgesProps {
  title: string;
  profile: DamageProfile;
}

function formatMultiplier(multiplier: number): string {
  return `x${multiplier.toString().replace('.', ',')}`;
}

function BadgeList({ label, items }: { label: string; items: DamageMultiplier[] }) {
  return (
    <div className={styles.damageGroup}>
      <h3>{label}</h3>
      <div className={styles.damageBadges}>
        {items.length === 0 && <span className={styles.emptyBadge}>Aucun</span>}
        {items.map((item) => (
          <span
            key={`${item.typeName}-${item.multiplier}`}
            className={styles.damageBadge}
            style={{ '--type-color': item.color } as CSSProperties}
          >
            {item.label} <strong>{formatMultiplier(item.multiplier)}</strong>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function DamageBadges({ title, profile }: DamageBadgesProps) {
  return (
    <div className={styles.damageCard}>
      <h2>{title}</h2>
      <BadgeList label="Faiblesses" items={profile.weaknesses} />
      <BadgeList label="Résistances" items={profile.resistances} />
      <BadgeList label="Immunités" items={profile.immunities} />
    </div>
  );
}
