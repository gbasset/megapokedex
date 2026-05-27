import React from 'react';
import { PokeType, flavor_text_entrie } from '../../../type-pokemons.ts';
import { colorByPokemonTypes } from '../../utils/apiAndDatabase';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import styles from './PokemonHeader.module.css';

interface PokemonHeaderProps {
  pokemon: PokeType | undefined;
  flavorText: [flavor_text_entrie | []] | flavor_text_entrie[];
}

export default function PokemonHeader({ pokemon, flavorText }: PokemonHeaderProps) {
  if (!pokemon) return null;

  // Get the first type for background color
  const primaryType = (pokemon as any).types[0]?.type?.name;
  const typeData = colorByPokemonTypes.find(t => t.type === primaryType);
  const bgColor = typeData?.color || '#f5f5f5';

  // Function to get type data
  const getTypeData = (element: any) => {
    return colorByPokemonTypes.find((x: any) => x.type === element.type.name);
  };

  return (
    <div 
      className={styles.headerContainer}
      style={{ '--bg-color': bgColor } as React.CSSProperties}
    >
      <div className={styles.nameSection}>
        <h1 className={styles.pokemonName}>{pokemon.friendlyName}</h1>
        <span className={styles.pokemonId}>#{pokemon.id.toString().padStart(3, '0')}</span>
      </div>

      <div className={styles.typesContainer}>
        {pokemon.types.map((x, i) => {
          const type = getTypeData(x);
          const idV = uuidv4();
          return (
            <div 
              key={i} 
              className={styles.typeBadge}
              style={{ backgroundColor: type?.color || '#ccc' }}
              data-tooltip-id={idV}
              data-tooltip-content={type?.label}
            >
              <ReactTooltip
                id={idV}
                place="bottom"
                delayShow={600}
                style={{ backgroundColor: type?.color || '#ccc', color: '#fff' }}
              />
              <img src={type?.image} alt={type?.label} className={styles.typeIcon} />
              <span className={styles.typeLabel}>{type?.label}</span>
            </div>
          );
        })}
      </div>

      <div className={styles.flavorTextContainer}>
        {flavorText && flavorText.length > 0 ? (
          flavorText.map((el: flavor_text_entrie | any, idx) => (
            <p key={idx} className={styles.flavorText}>
              {el.flavor_text}
            </p>
          ))
        ) : (
          <p className={styles.flavorText}>Aucune description disponible</p>
        )}
      </div>
    </div>
  );
}
