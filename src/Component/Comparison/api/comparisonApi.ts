import axios from 'axios';
import { baseUrl } from '../../../utils/apiAndDatabase';
import {
  ApiReference,
  ComparisonAbility,
  ComparisonMove,
  ComparisonPokemon,
  ComparisonStat,
  ComparisonType,
  DamageMultiplier,
  DamageProfile,
} from '../types/comparison.types';
import {
  STAT_DEFINITIONS,
  getTypeColor,
  getTypeLabel,
  sortDamageMultipliers,
} from '../utils/comparison-calculations';
import { buildPokemonSprites, getLegacySprites } from '../../../utils/pokemon-sprites';

interface NamedEntry {
  language?: ApiReference;
  name?: string;
}

interface DamageRelationRaw {
  double_damage_from: ApiReference[];
  half_damage_from: ApiReference[];
  no_damage_from: ApiReference[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function getNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' ? value : fallback;
}

function getArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function getReference(value: unknown): ApiReference | null {
  if (!isRecord(value)) {
    return null;
  }

  const name = getString(value.name);
  const url = getString(value.url);

  return name && url ? { name, url } : null;
}

function getFrenchName(names: unknown, fallback: string): string {
  const entries = getArray(names) as NamedEntry[];
  const frenchName = entries.find((entry) => entry.language?.name === 'fr')?.name;

  return frenchName ?? fallback;
}

function formatMoveName(name: string): string {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizeTypes(types: unknown): ComparisonType[] {
  return getArray(types)
    .map((typeSlot) => {
      const typeReference = isRecord(typeSlot) ? getReference(typeSlot.type) : null;

      if (!typeReference) {
        return null;
      }

      return {
        name: typeReference.name,
        label: getTypeLabel(typeReference.name),
        color: getTypeColor(typeReference.name),
        url: typeReference.url,
      };
    })
    .filter((type): type is ComparisonType => Boolean(type));
}

function normalizeStats(stats: unknown): ComparisonStat[] {
  return getArray(stats)
    .map((statSlot) => {
      if (!isRecord(statSlot) || !isRecord(statSlot.stat)) {
        return null;
      }

      const statName = getString(statSlot.stat.name);
      const definition = STAT_DEFINITIONS.find((item) => item.key === statName);

      if (!definition) {
        return null;
      }

      return {
        key: definition.key,
        label: definition.label,
        value: getNumber(statSlot.base_stat),
      };
    })
    .filter((stat): stat is ComparisonStat => Boolean(stat));
}

function normalizeMoves(moves: unknown): ComparisonMove[] {
  return getArray(moves)
    .map((moveSlot) => {
      const moveReference = isRecord(moveSlot) ? getReference(moveSlot.move) : null;

      if (!moveReference) {
        return null;
      }

      return {
        name: moveReference.name,
        label: formatMoveName(moveReference.name),
        url: moveReference.url,
      };
    })
    .filter((move): move is ComparisonMove => Boolean(move));
}

function normalizeAbilities(abilities: unknown): ComparisonAbility[] {
  return getArray(abilities)
    .map((abilitySlot) => {
      if (!isRecord(abilitySlot)) {
        return null;
      }

      const abilityReference = getReference(abilitySlot.ability);

      if (!abilityReference) {
        return null;
      }

      return {
        name: abilityReference.name,
        label: formatMoveName(abilityReference.name),
        effect: '',
        isHidden: abilitySlot.is_hidden === true,
        url: abilityReference.url,
      };
    })
    .filter((ability): ability is ComparisonAbility => Boolean(ability));
}

function normalizeAbilityEffect(data: unknown): string {
  const obj = (data ?? {}) as Record<string, unknown>;
  const effectEntries = getArray(obj.effect_entries);
  const englishEntry = effectEntries.find((entry) => (
    isRecord(entry) && isRecord(entry.language) && entry.language.name === 'en'
  ));

  if (!isRecord(englishEntry)) {
    return '';
  }

  return getString(englishEntry.short_effect, getString(englishEntry.effect));
}

function getDamageRelation(data: unknown): DamageRelationRaw {
  const obj = (data ?? {}) as Record<string, unknown>;
  const damageRelations = isRecord(obj.damage_relations) ? obj.damage_relations : {};

  return {
    double_damage_from: getArray(damageRelations.double_damage_from)
      .map(getReference)
      .filter((reference): reference is ApiReference => Boolean(reference)),
    half_damage_from: getArray(damageRelations.half_damage_from)
      .map(getReference)
      .filter((reference): reference is ApiReference => Boolean(reference)),
    no_damage_from: getArray(damageRelations.no_damage_from)
      .map(getReference)
      .filter((reference): reference is ApiReference => Boolean(reference)),
  };
}

function applyMultiplier(multiplierMap: Map<string, number>, references: ApiReference[], multiplier: number): void {
  references.forEach((reference) => {
    multiplierMap.set(reference.name, (multiplierMap.get(reference.name) ?? 1) * multiplier);
  });
}

async function hydrateAbilityEffects(abilities: ComparisonAbility[]): Promise<ComparisonAbility[]> {
  const hydratedAbilities = await Promise.all(abilities.map(async (ability) => {
    try {
      const response = await axios.get<unknown>(ability.url);

      return {
        ...ability,
        effect: normalizeAbilityEffect(response.data),
      };
    } catch {
      return ability;
    }
  }));

  return hydratedAbilities;
}

export async function fetchComparisonPokemon(pokemonId: number): Promise<ComparisonPokemon> {
  const [pokemonResponse, speciesResponse] = await Promise.all([
    axios.get<unknown>(`${baseUrl}pokemon/${pokemonId}`),
    axios.get<unknown>(`${baseUrl}pokemon-species/${pokemonId}`),
  ]);

  const pokemonData = (pokemonResponse.data ?? {}) as Record<string, unknown>;
  const speciesData = (speciesResponse.data ?? {}) as Record<string, unknown>;
  const name = getString(pokemonData.name, getString(speciesData.name));
  const hasGenderDifferences = speciesData.has_gender_differences === true;
  const sprites = buildPokemonSprites(pokemonData.sprites, hasGenderDifferences);
  const { sprite, animatedSprite } = getLegacySprites(sprites);
  const abilities = await hydrateAbilityEffects(normalizeAbilities(pokemonData.abilities));

  return {
    id: getNumber(pokemonData.id, pokemonId),
    name,
    friendlyName: getFrenchName(speciesData.names, name),
    sprite,
    animatedSprite,
    sprites,
    hasGenderDifferences,
    height: getNumber(pokemonData.height) / 10,
    weight: getNumber(pokemonData.weight) / 10,
    baseExperience: getNumber(pokemonData.base_experience),
    types: normalizeTypes(pokemonData.types),
    stats: normalizeStats(pokemonData.stats),
    abilities,
    moves: normalizeMoves(pokemonData.moves),
  };
}

export async function fetchDamageProfile(pokemon: ComparisonPokemon): Promise<DamageProfile> {
  const typeResponses = await Promise.all(pokemon.types.map((type) => axios.get<unknown>(type.url)));
  const multiplierMap = new Map<string, number>();

  typeResponses.forEach((response) => {
    const relations = getDamageRelation(response.data);

    applyMultiplier(multiplierMap, relations.double_damage_from, 2);
    applyMultiplier(multiplierMap, relations.half_damage_from, 0.5);
    applyMultiplier(multiplierMap, relations.no_damage_from, 0);
  });

  const multipliers = Array.from(multiplierMap.entries()).map<DamageMultiplier>(([typeName, multiplier]) => ({
    typeName,
    label: getTypeLabel(typeName),
    color: getTypeColor(typeName),
    multiplier,
  }));

  return sortDamageMultipliers({
    weaknesses: multipliers.filter((item) => item.multiplier > 1),
    resistances: multipliers.filter((item) => item.multiplier > 0 && item.multiplier < 1),
    immunities: multipliers.filter((item) => item.multiplier === 0),
  });
}
