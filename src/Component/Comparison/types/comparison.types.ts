export type ComparisonStatKey =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'special-attack'
  | 'special-defense'
  | 'speed';

export interface ApiReference {
  name: string;
  url: string;
}

export interface ComparisonStat {
  key: ComparisonStatKey;
  label: string;
  value: number;
}

export interface ComparisonType {
  name: string;
  label: string;
  color: string;
  url: string;
}

export interface ComparisonAbility {
  name: string;
  label: string;
  effect: string;
  isHidden: boolean;
  url: string;
}

export interface ComparisonMove {
  name: string;
  label: string;
  url: string;
}

import type {
  PokemonSpriteCategory,
  PokemonSpriteOption,
} from '../../../types/pokemon-sprites.types';

export type ComparisonSpriteCategory = PokemonSpriteCategory;
export type ComparisonSpriteOption = PokemonSpriteOption;

export interface ComparisonPokemon {
  id: number;
  name: string;
  friendlyName: string;
  sprite: string;
  animatedSprite: string;
  sprites: PokemonSpriteOption[];
  hasGenderDifferences: boolean;
  height: number;
  weight: number;
  baseExperience: number;
  types: ComparisonType[];
  stats: ComparisonStat[];
  abilities: ComparisonAbility[];
  moves: ComparisonMove[];
}

export interface DamageMultiplier {
  typeName: string;
  label: string;
  color: string;
  multiplier: number;
}

export interface DamageProfile {
  weaknesses: DamageMultiplier[];
  resistances: DamageMultiplier[];
  immunities: DamageMultiplier[];
}

export interface StatComparison {
  key: ComparisonStatKey;
  label: string;
  firstValue: number;
  secondValue: number;
  winner: 'first' | 'second' | 'tie';
}

export interface ComparisonVerdict {
  firstTotal: number;
  secondTotal: number;
  firstWins: number;
  secondWins: number;
  ties: number;
  winner: 'first' | 'second' | 'tie';
}

export interface ComparisonDashboard {
  firstPokemon: ComparisonPokemon;
  secondPokemon: ComparisonPokemon;
  firstDamageProfile: DamageProfile;
  secondDamageProfile: DamageProfile;
  statComparisons: StatComparison[];
  verdict: ComparisonVerdict;
  commonMoves: ComparisonMove[];
}

export interface ComparisonService {
  getPokemon: (pokemonId: number) => Promise<ComparisonPokemon>;
  getDamageProfile: (pokemon: ComparisonPokemon) => Promise<DamageProfile>;
}
