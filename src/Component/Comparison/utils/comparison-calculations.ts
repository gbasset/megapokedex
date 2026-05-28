import { colorByPokemonTypes } from '../../../utils/apiAndDatabase';
import {
  ComparisonDashboard,
  ComparisonMove,
  ComparisonPokemon,
  ComparisonStat,
  ComparisonStatKey,
  ComparisonVerdict,
  DamageMultiplier,
  DamageProfile,
  StatComparison,
} from '../types/comparison.types';

export const STAT_DEFINITIONS: Array<{ key: ComparisonStatKey; label: string }> = [
  { key: 'hp', label: 'PV' },
  { key: 'attack', label: 'Attaque' },
  { key: 'defense', label: 'Défense' },
  { key: 'special-attack', label: 'Atk. Spé.' },
  { key: 'special-defense', label: 'Déf. Spé.' },
  { key: 'speed', label: 'Vitesse' },
];

const TYPE_LABELS = colorByPokemonTypes.reduce<Record<string, { label: string; color: string }>>((acc, typeConfig) => {
  acc[typeConfig.type] = {
    label: typeConfig.label,
    color: typeConfig.color,
  };

  return acc;
}, {});

export function getTypeLabel(typeName: string): string {
  return TYPE_LABELS[typeName]?.label ?? typeName;
}

export function getTypeColor(typeName: string): string {
  return TYPE_LABELS[typeName]?.color ?? '#636e72';
}

export function compareStats(firstStats: ComparisonStat[], secondStats: ComparisonStat[]): StatComparison[] {
  return STAT_DEFINITIONS.map((definition) => {
    const firstValue = firstStats.find((stat) => stat.key === definition.key)?.value ?? 0;
    const secondValue = secondStats.find((stat) => stat.key === definition.key)?.value ?? 0;

    return {
      key: definition.key,
      label: definition.label,
      firstValue,
      secondValue,
      winner: firstValue === secondValue ? 'tie' : firstValue > secondValue ? 'first' : 'second',
    };
  });
}

export function buildVerdict(statComparisons: StatComparison[]): ComparisonVerdict {
  return statComparisons.reduce<ComparisonVerdict>((verdict, stat) => {
    const nextVerdict = {
      ...verdict,
      firstTotal: verdict.firstTotal + stat.firstValue,
      secondTotal: verdict.secondTotal + stat.secondValue,
    };

    if (stat.winner === 'first') {
      nextVerdict.firstWins += 1;
    } else if (stat.winner === 'second') {
      nextVerdict.secondWins += 1;
    } else {
      nextVerdict.ties += 1;
    }

    nextVerdict.winner = nextVerdict.firstTotal === nextVerdict.secondTotal
      ? 'tie'
      : nextVerdict.firstTotal > nextVerdict.secondTotal
        ? 'first'
        : 'second';

    return nextVerdict;
  }, {
    firstTotal: 0,
    secondTotal: 0,
    firstWins: 0,
    secondWins: 0,
    ties: 0,
    winner: 'tie',
  });
}

export function getCommonMoves(firstMoves: ComparisonMove[], secondMoves: ComparisonMove[]): ComparisonMove[] {
  const secondMoveNames = new Set(secondMoves.map((move) => move.name));

  return firstMoves
    .filter((move) => secondMoveNames.has(move.name))
    .slice(0, 18);
}

export function sortDamageMultipliers(profile: DamageProfile): DamageProfile {
  const sortByMultiplier = (items: DamageMultiplier[]) => (
    [...items].sort((a, b) => b.multiplier - a.multiplier || a.label.localeCompare(b.label))
  );

  return {
    weaknesses: sortByMultiplier(profile.weaknesses),
    resistances: sortByMultiplier(profile.resistances),
    immunities: sortByMultiplier(profile.immunities),
  };
}

export function buildComparisonDashboard(
  firstPokemon: ComparisonPokemon,
  secondPokemon: ComparisonPokemon,
  firstDamageProfile: DamageProfile,
  secondDamageProfile: DamageProfile,
): ComparisonDashboard {
  const statComparisons = compareStats(firstPokemon.stats, secondPokemon.stats);

  return {
    firstPokemon,
    secondPokemon,
    firstDamageProfile,
    secondDamageProfile,
    statComparisons,
    verdict: buildVerdict(statComparisons),
    commonMoves: getCommonMoves(firstPokemon.moves, secondPokemon.moves),
  };
}
