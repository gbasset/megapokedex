import { PokemonSpriteCategory, PokemonSpriteOption } from '../types/pokemon-sprites.types';

interface SpriteVariantDefinition {
  key: string;
  label: string;
  category: PokemonSpriteCategory;
  isAnimated: boolean;
  requiresFemale?: boolean;
}

const SHOWDOWN_VARIANTS: SpriteVariantDefinition[] = [
  { key: 'front_default', label: 'Avant animé', category: 'animated', isAnimated: true },
  { key: 'front_female', label: 'Avant femelle animé', category: 'animated', isAnimated: true, requiresFemale: true },
  { key: 'front_shiny', label: 'Avant shiny animé', category: 'animated', isAnimated: true },
  { key: 'front_shiny_female', label: 'Avant femelle shiny animé', category: 'animated', isAnimated: true, requiresFemale: true },
  { key: 'back_default', label: 'Dos animé', category: 'animated', isAnimated: true },
  { key: 'back_female', label: 'Dos femelle animé', category: 'animated', isAnimated: true, requiresFemale: true },
  { key: 'back_shiny', label: 'Dos shiny animé', category: 'animated', isAnimated: true },
  { key: 'back_shiny_female', label: 'Dos femelle shiny animé', category: 'animated', isAnimated: true, requiresFemale: true },
];

const ARTWORK_VARIANTS: SpriteVariantDefinition[] = [
  { key: 'front_default', label: 'Artwork', category: 'artwork', isAnimated: false },
  { key: 'front_female', label: 'Artwork femelle', category: 'artwork', isAnimated: false, requiresFemale: true },
  { key: 'front_shiny', label: 'Artwork shiny', category: 'artwork', isAnimated: false },
  { key: 'front_shiny_female', label: 'Artwork femelle shiny', category: 'artwork', isAnimated: false, requiresFemale: true },
];

const CLASSIC_VARIANTS: SpriteVariantDefinition[] = [
  { key: 'front_default', label: 'Face', category: 'sprite', isAnimated: false },
  { key: 'front_female', label: 'Face femelle', category: 'sprite', isAnimated: false, requiresFemale: true },
  { key: 'front_shiny', label: 'Face shiny', category: 'sprite', isAnimated: false },
  { key: 'front_shiny_female', label: 'Face femelle shiny', category: 'sprite', isAnimated: false, requiresFemale: true },
  { key: 'back_default', label: 'Dos', category: 'sprite', isAnimated: false },
  { key: 'back_female', label: 'Dos femelle', category: 'sprite', isAnimated: false, requiresFemale: true },
  { key: 'back_shiny', label: 'Dos shiny', category: 'sprite', isAnimated: false },
  { key: 'back_shiny_female', label: 'Dos femelle shiny', category: 'sprite', isAnimated: false, requiresFemale: true },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getString(value: unknown): string | null {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function collectSpriteOptions(
  sourceKey: string,
  source: Record<string, unknown>,
  variants: SpriteVariantDefinition[],
  hasGenderDifferences: boolean,
): PokemonSpriteOption[] {
  return variants.flatMap((variant) => {
    if (variant.requiresFemale && !hasGenderDifferences) {
      return [];
    }

    const url = getString(source[variant.key]);

    if (!url) {
      return [];
    }

    return [{
      id: `${sourceKey}-${variant.key}`,
      label: variant.label,
      url,
      category: variant.category,
      isAnimated: variant.isAnimated,
    }];
  });
}

export function buildPokemonSprites(
  spritesData: unknown,
  hasGenderDifferences: boolean,
): PokemonSpriteOption[] {
  const sprites = isRecord(spritesData) ? spritesData : {};
  const other = isRecord(sprites.other) ? sprites.other : {};
  const showdown = isRecord(other.showdown) ? other.showdown : {};
  const officialArtwork = isRecord(other['official-artwork']) ? other['official-artwork'] : {};

  const options = [
    ...collectSpriteOptions('showdown', showdown, SHOWDOWN_VARIANTS, hasGenderDifferences),
    ...collectSpriteOptions('artwork', officialArtwork, ARTWORK_VARIANTS, hasGenderDifferences),
    ...collectSpriteOptions('classic', sprites, CLASSIC_VARIANTS, hasGenderDifferences),
  ];

  const uniqueUrls = new Set<string>();

  return options.filter((option) => {
    if (uniqueUrls.has(option.url)) {
      return false;
    }

    uniqueUrls.add(option.url);
    return true;
  });
}

export function getDefaultSpriteId(sprites: PokemonSpriteOption[]): string {
  const firstAnimated = sprites.find((sprite) => sprite.isAnimated);

  return firstAnimated?.id ?? sprites[0]?.id ?? '';
}

export function getDefaultArtworkSpriteId(sprites: PokemonSpriteOption[]): string {
  const defaultArtwork = sprites.find((sprite) => sprite.id === 'artwork-front_default');

  return defaultArtwork?.id
    ?? sprites.find((sprite) => sprite.category === 'artwork')?.id
    ?? getDefaultSpriteId(sprites);
}

export interface SpritePreferences {
  isShiny: boolean;
  isFemale: boolean;
  isBack: boolean;
  category: PokemonSpriteCategory;
}

export function parseSpritePreferences(spriteId: string): SpritePreferences {
  const id = spriteId.toLowerCase();
  let category: PokemonSpriteCategory = 'sprite';

  if (id.startsWith('showdown')) {
    category = 'animated';
  } else if (id.startsWith('artwork')) {
    category = 'artwork';
  }

  return {
    isShiny: id.includes('shiny'),
    isFemale: id.includes('female'),
    isBack: id.includes('back'),
    category,
  };
}

function spriteMatchesPreferences(sprite: PokemonSpriteOption, options: {
  isShiny: boolean;
  isFemale: boolean;
  preferBack?: boolean;
}): boolean {
  const id = sprite.id.toLowerCase();
  const isBack = id.includes('back');

  if (options.preferBack !== undefined && isBack !== options.preferBack) {
    return false;
  }

  return id.includes('shiny') === options.isShiny && id.includes('female') === options.isFemale;
}

export function findSpriteIdForPreferences(
  sprites: PokemonSpriteOption[],
  options: {
    isShiny: boolean;
    isFemale: boolean;
    category?: PokemonSpriteCategory;
    preferBack?: boolean;
  },
): string {
  const pool = options.category
    ? sprites.filter((sprite) => sprite.category === options.category)
    : sprites;

  const orientedPool = options.preferBack === undefined
    ? pool.filter((sprite) => !sprite.id.includes('back'))
    : pool.filter((sprite) => sprite.id.includes('back') === options.preferBack);

  const searchPool = orientedPool.length > 0
    ? orientedPool
    : pool.filter((sprite) => !sprite.id.includes('back'));

  const exactMatch = searchPool.find((sprite) => spriteMatchesPreferences(sprite, options));

  if (exactMatch) {
    return exactMatch.id;
  }

  if (options.isFemale) {
    const withoutFemale = findSpriteIdForPreferences(sprites, {
      ...options,
      isFemale: false,
    });

    if (withoutFemale) {
      return withoutFemale;
    }
  }

  if (options.category === 'artwork') {
    return getDefaultArtworkSpriteId(sprites);
  }

  if (options.category) {
    const categoryDefault = pool.find((sprite) => !sprite.id.includes('back')) ?? pool[0];

    return categoryDefault?.id ?? getDefaultSpriteId(sprites);
  }

  return getDefaultSpriteId(sprites);
}

export function getLegacySprites(sprites: PokemonSpriteOption[]): { sprite: string; animatedSprite: string } {
  const artwork = sprites.find((sprite) => sprite.category === 'artwork');
  const animated = sprites.find((sprite) => sprite.isAnimated);
  const fallback = sprites[0]?.url ?? '';

  return {
    sprite: artwork?.url ?? fallback,
    animatedSprite: animated?.url ?? fallback,
  };
}
