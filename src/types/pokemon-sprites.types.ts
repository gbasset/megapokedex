export type PokemonSpriteCategory = 'animated' | 'artwork' | 'sprite';

export interface PokemonSpriteOption {
  id: string;
  label: string;
  url: string;
  category: PokemonSpriteCategory;
  isAnimated: boolean;
}
