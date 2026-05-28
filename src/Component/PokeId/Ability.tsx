import { useState, useEffect } from 'react'
import axios from 'axios';
import { flavor_text_entrie } from '../../../type-pokemons';
import styles from './Ability.module.css';

interface AbilityProps {
  name?: string;
  url: string;
}

interface AbilityDetails {
  name: string;
  flavorTexts: flavor_text_entrie[];
}

interface AbilityNameRaw {
  name?: unknown;
  language?: {
    name?: unknown;
  };
}

function getFrenchAbilityName(names: unknown): string {
  if (!Array.isArray(names)) {
    return 'Talent';
  }

  const frenchName = names.find((element: unknown) => {
    const abilityName = element as AbilityNameRaw;
    return abilityName.language?.name === 'fr' && typeof abilityName.name === 'string';
  }) as AbilityNameRaw | undefined;

  return typeof frenchName?.name === 'string' ? frenchName.name : 'Talent';
}

function getFrenchFlavorTexts(flavorTexts: unknown): flavor_text_entrie[] {
  if (!Array.isArray(flavorTexts)) {
    return [];
  }

  return flavorTexts.filter((currentValue: unknown): currentValue is flavor_text_entrie => {
    const flavorText = currentValue as flavor_text_entrie;
    return flavorText.language?.name === 'fr' && typeof flavorText.flavor_text === 'string';
  });
}

export default function Ability({url}: AbilityProps) {
    const [abilityObject, setAbilityObject] = useState<AbilityDetails | undefined>();

    useEffect(()=>{
        axios.get(url)
        .then(x => {
          const data = (x.data ?? {}) as Record<string, unknown>;
          const abilityNewObj = {
            name : getFrenchAbilityName(data.names),
            flavorTexts : getFrenchFlavorTexts(data.flavor_text_entries)
          }
          setAbilityObject(abilityNewObj)
        })
        .catch(err => {
          console.error(err);
        })
      },[url]);

  if (!abilityObject) {
    return null;
  }

  const description = abilityObject.flavorTexts[0]?.flavor_text ?? 'Aucune description disponible.';

  return (
    <article className={styles.abilityCard}>
      <div className={styles.abilityIcon} aria-hidden="true">
        <span />
      </div>
      <div className={styles.abilityContent}>
        <h4 className={styles.abilityName}>{abilityObject.name}</h4>
        <p className={styles.abilityDescription}>{description}</p>
      </div>
    </article>
  )
}
