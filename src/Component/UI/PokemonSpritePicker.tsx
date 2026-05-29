import { type CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import {
  PokemonSpriteCategory,
  PokemonSpriteOption,
} from '../../types/pokemon-sprites.types';
import {
  findSpriteIdForPreferences,
  getDefaultSpriteId,
  parseSpritePreferences,
} from '../../utils/pokemon-sprites';
import styles from './PokemonSpritePicker.module.css';

export interface PokemonSpritePickerProps {
  sprites: PokemonSpriteOption[];
  pokemonId: number;
  friendlyName: string;
  showPreview?: boolean;
  expandOptions?: boolean;
  selectedSpriteId?: string;
  defaultSpriteId?: string;
  onSpriteChange?: (sprite: PokemonSpriteOption) => void;
  accentColor?: string;
}

const CATEGORY_LABELS: Record<PokemonSpriteCategory, string> = {
  animated: 'Animés',
  artwork: 'Artworks',
  sprite: 'Classiques',
};

const CATEGORY_ORDER: PokemonSpriteCategory[] = ['animated', 'artwork', 'sprite'];

export default function PokemonSpritePicker({
  sprites,
  pokemonId,
  friendlyName,
  showPreview = true,
  expandOptions = false,
  selectedSpriteId,
  defaultSpriteId,
  onSpriteChange,
  accentColor,
}: PokemonSpritePickerProps) {
  const resolvedDefaultId = defaultSpriteId ?? getDefaultSpriteId(sprites);
  const [internalSpriteId, setInternalSpriteId] = useState(resolvedDefaultId);
  const [activeCategory, setActiveCategory] = useState<PokemonSpriteCategory>('animated');
  const isControlled = selectedSpriteId !== undefined;
  const currentSpriteId = isControlled ? selectedSpriteId : internalSpriteId;

  useEffect(() => {
    const nextDefaultId = defaultSpriteId ?? getDefaultSpriteId(sprites);

    if (!isControlled) {
      setInternalSpriteId(nextDefaultId);
    }

    const defaultSprite = sprites.find((sprite) => sprite.id === nextDefaultId);

    if (defaultSprite) {
      setActiveCategory(defaultSprite.category);
    }
  }, [pokemonId, sprites, defaultSpriteId, isControlled]);

  const selectedSprite = useMemo(
    () => sprites.find((sprite) => sprite.id === currentSpriteId) ?? sprites[0],
    [sprites, currentSpriteId],
  );

  const spritesByCategory = useMemo(() => (
    CATEGORY_ORDER.reduce<Record<PokemonSpriteCategory, PokemonSpriteOption[]>>((groups, category) => {
      groups[category] = sprites.filter((sprite) => sprite.category === category);
      return groups;
    }, { animated: [], artwork: [], sprite: [] })
  ), [sprites]);

  const availableCategories = useMemo(
    () => CATEGORY_ORDER.filter((category) => spritesByCategory[category].length > 0),
    [spritesByCategory],
  );

  useEffect(() => {
    if (!availableCategories.includes(activeCategory) && availableCategories[0]) {
      setActiveCategory(availableCategories[0]);
    }
  }, [activeCategory, availableCategories]);

  useEffect(() => {
    if (selectedSprite) {
      setActiveCategory(selectedSprite.category);
    }
  }, [currentSpriteId, selectedSprite]);

  const visibleSprites = spritesByCategory[activeCategory];

  const handleSelectSprite = useCallback((sprite: PokemonSpriteOption) => {
    if (!isControlled) {
      setInternalSpriteId(sprite.id);
    }

    setActiveCategory(sprite.category);
    onSpriteChange?.(sprite);
  }, [isControlled, onSpriteChange]);

  const handleSelectCategory = useCallback((category: PokemonSpriteCategory) => {
    setActiveCategory(category);

    const preferences = parseSpritePreferences(currentSpriteId);
    const nextSpriteId = findSpriteIdForPreferences(sprites, {
      isShiny: preferences.isShiny,
      isFemale: preferences.isFemale,
      category,
      preferBack: preferences.isBack,
    });
    const nextSprite = sprites.find((sprite) => sprite.id === nextSpriteId) ?? spritesByCategory[category][0];

    if (nextSprite) {
      handleSelectSprite(nextSprite);
    }
  }, [currentSpriteId, handleSelectSprite, sprites, spritesByCategory]);

  if (!selectedSprite || sprites.length === 0) {
    return null;
  }

  const pickerStyle = accentColor
    ? ({ '--sprite-accent': accentColor } as CSSProperties)
    : undefined;

  return (
    <div className={styles.spritePicker} style={pickerStyle}>
      {showPreview && (
        <div className={styles.spritePreview} aria-live="polite">
          <img
            src={selectedSprite.url}
            alt={`${friendlyName} — ${selectedSprite.label}`}
            className={selectedSprite.isAnimated ? styles.spritePreviewAnimated : undefined}
          />
          <span className={styles.spritePreviewLabel}>{selectedSprite.label}</span>
        </div>
      )}

      {availableCategories.length > 1 && (
        <div className={styles.spriteCategoryTabs} role="tablist" aria-label="Catégories de sprites">
          {availableCategories.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              className={activeCategory === category ? styles.spriteCategoryTabActive : styles.spriteCategoryTab}
              onClick={() => handleSelectCategory(category)}
            >
              {CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>
      )}

      {visibleSprites.length > 0 && (
        <div
          className={expandOptions ? `${styles.spriteOptions} ${styles.spriteOptionsExpanded}` : styles.spriteOptions}
          role="tabpanel"
          aria-label={`Sprites ${CATEGORY_LABELS[activeCategory].toLowerCase()} de ${friendlyName}`}
        >
          {visibleSprites.map((sprite) => (
            <button
              key={sprite.id}
              type="button"
              className={sprite.id === currentSpriteId ? styles.spriteOptionActive : styles.spriteOption}
              onClick={() => handleSelectSprite(sprite)}
              aria-label={sprite.label}
              aria-pressed={sprite.id === currentSpriteId}
              title={sprite.label}
            >
              <img src={sprite.url} alt="" />
              <span>{sprite.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
