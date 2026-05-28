
import { useCallback, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom'
import { PokeType } from '../../../type-pokemons';
import {getNameInOtherLanguage} from '../../utils/transform';
import styles from './Box.module.css';

const POKEMON_COLOR_BY_SPECIES_COLOR: Record<string, string> = {
  black: '#2d3436',
  blue: '#0984e3',
  brown: '#92501b',
  gray: '#636e72',
  green: '#00b894',
  pink: '#fd79a8',
  purple: '#6c5ce7',
  red: '#d63031',
  white: '#b2bec3',
  yellow: '#fdcb6e',
};

interface Props {
  pokemon: PokeType,
  children?: ReactNode
}

export default function Box({pokemon, children} : Props) {

  const name = getNameInOtherLanguage(pokemon, 'fr');
  const pokemonColor = POKEMON_COLOR_BY_SPECIES_COLOR[pokemon.color] ?? '#ff7675';
  const cardStyle = {
    '--pokemon-color': pokemonColor,
  } as CSSProperties;
  const handlePointerEnter = useCallback((event: PointerEvent<HTMLAnchorElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    const distances = {
      top: pointerY,
      right: rect.width - pointerX,
      bottom: rect.height - pointerY,
      left: pointerX,
    };
    const entrySide = Object.entries(distances).reduce((closest, current) => (
      current[1] < closest[1] ? current : closest
    ));

    const entryCoordinatesBySide: Record<string, { x: string; y: string }> = {
      top: { x: `${pointerX}px`, y: '0px' },
      right: { x: `${rect.width}px`, y: `${pointerY}px` },
      bottom: { x: `${pointerX}px`, y: `${rect.height}px` },
      left: { x: '0px', y: `${pointerY}px` },
    };
    const entryCoordinates = entryCoordinatesBySide[entrySide[0]];

    card.style.setProperty('--entry-x', entryCoordinates.x);
    card.style.setProperty('--entry-y', entryCoordinates.y);
  }, []);

  return (
    <Link
      to={"poke/" + pokemon.id}
      className={styles.card}
      style={cardStyle}
      aria-label={`Voir le Pokémon ${name}`}
      onPointerEnter={handlePointerEnter}
    >
      <div className={styles.content}>
        <span className={styles.number}>#{pokemon.id.toString().padStart(3, '0')}</span>
        <h2 className={styles.name}>
          {name}
        </h2>
        <div className={styles.artStage}>
          <img className={styles.pokemonImage} src={pokemon.img ?? ''} alt={name} loading="lazy" />
        </div>
        <div className={styles.footer}>
          <span>Voir le Pokémon</span>
          <span className={styles.arrow} aria-hidden="true">→</span>
        </div>
        {children}
      </div>
    </Link>
  )
}
