import { type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ComparisonDashboard } from './types/comparison.types';
import DamageBadges from './DamageBadges';
import PokemonSpritePicker from '../UI/PokemonSpritePicker';
import RadarChart from './RadarChart';
import StatBars from './StatBars';
import styles from './Comparison.module.css';

interface ComparisonViewProps {
  dashboard: ComparisonDashboard;
}

function formatSize(value: number, unit: string): string {
  return `${value.toLocaleString('fr-FR')} ${unit}`;
}

export default function ComparisonView({ dashboard }: ComparisonViewProps) {
  const {
    firstPokemon,
    secondPokemon,
    firstDamageProfile,
    secondDamageProfile,
    statComparisons,
    verdict,
    commonMoves,
  } = dashboard;
  const winnerName = verdict.winner === 'tie'
    ? 'Égalité'
    : verdict.winner === 'first'
      ? firstPokemon.friendlyName
      : secondPokemon.friendlyName;
  const comparisonColor = firstPokemon.types[0]?.color ?? '#DBD8B7';

  return (
    <div className={styles.dashboard} style={{ '--comparison-color': comparisonColor } as CSSProperties}>
      <section className={styles.heroGrid}>
        {[firstPokemon, secondPokemon].map((pokemon) => (
          <article key={pokemon.id} className={styles.pokemonHero}>
            <PokemonSpritePicker
              sprites={pokemon.sprites}
              pokemonId={pokemon.id}
              friendlyName={pokemon.friendlyName}
              accentColor={pokemon.types[0]?.color}
            />
            <div className={styles.pokemonHeroInfo}>
              <span>#{pokemon.id.toString().padStart(3, '0')}</span>
              <h2>{pokemon.friendlyName}</h2>
              <div className={styles.typeList}>
                {pokemon.types.map((type) => (
                  <span key={type.name} style={{ '--type-color': type.color } as CSSProperties}>
                    {type.label}
                  </span>
                ))}
              </div>
              <Link
                to={`/poke/${pokemon.id}`}
                className={styles.pokemonHeroCta}
                aria-label={`Voir la fiche de ${pokemon.friendlyName}`}
              >
                Voir le pokémon →
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.metaGrid}>
        <article>
          <span>Total stats</span>
          <strong>{verdict.firstTotal} - {verdict.secondTotal}</strong>
        </article>
        <article>
          <span>Stats gagnées</span>
          <strong>{verdict.firstWins} - {verdict.secondWins}</strong>
        </article>
        <article>
          <span>Verdict</span>
          <strong>{winnerName}</strong>
        </article>
        <article>
          <span>Égalités</span>
          <strong>{verdict.ties}</strong>
        </article>
      </section>

      <section className={styles.chartsGrid}>
        <RadarChart firstPokemon={firstPokemon} secondPokemon={secondPokemon} />
        <StatBars firstPokemon={firstPokemon} secondPokemon={secondPokemon} statComparisons={statComparisons} />
      </section>

      <section className={styles.detailsGrid}>
        <article className={styles.infoCard}>
          <h2>Mensurations & expérience</h2>
          <div className={styles.infoRows}>
            <span>{firstPokemon.friendlyName}</span>
            <strong>{formatSize(firstPokemon.height, 'm')} / {formatSize(firstPokemon.weight, 'kg')} / XP {firstPokemon.baseExperience}</strong>
            <span>{secondPokemon.friendlyName}</span>
            <strong>{formatSize(secondPokemon.height, 'm')} / {formatSize(secondPokemon.weight, 'kg')} / XP {secondPokemon.baseExperience}</strong>
          </div>
        </article>

        <article className={styles.infoCard}>
          <h2>Talents</h2>
          {[firstPokemon, secondPokemon].map((pokemon) => (
            <div key={pokemon.id} className={styles.abilityBlock}>
              <strong>{pokemon.friendlyName}</strong>
              {pokemon.abilities.map((ability) => (
                <p key={ability.name}>
                  <span>{ability.label}{ability.isHidden ? ' caché' : ''}</span>
                  {ability.effect || 'Effet non disponible.'}
                </p>
              ))}
            </div>
          ))}
        </article>
      </section>

      <section className={styles.damageGrid}>
        <DamageBadges title={firstPokemon.friendlyName} profile={firstDamageProfile} />
        <DamageBadges title={secondPokemon.friendlyName} profile={secondDamageProfile} />
      </section>

      <section className={styles.infoCard}>
        <h2>Capacités communes</h2>
        <div className={styles.moveList}>
          {commonMoves.length === 0 && <span>Aucune capacité commune détectée.</span>}
          {commonMoves.map((move) => <span key={move.name}>{move.label}</span>)}
        </div>
      </section>
    </div>
  );
}
