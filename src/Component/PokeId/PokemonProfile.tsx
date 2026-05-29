import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PokeType } from '../../../type-pokemons.ts';
import Image from '../UI/Image.js';
import { Button } from '../UI/Button';
import PokemonSpritePicker from '../UI/PokemonSpritePicker';
import Stats from './Stats.js';
import Habitat from './Habitat.js';
import { PokemonSpriteOption } from '../../types/pokemon-sprites.types';
import {
  buildPokemonSprites,
  findSpriteIdForPreferences,
  getDefaultArtworkSpriteId,
  parseSpritePreferences,
} from '../../utils/pokemon-sprites';
import styles from './PokemonProfile.module.css';

interface PokemonProfileProps {
  pokemon: PokeType | undefined;
  color: string;
  hasGenderDifferences: boolean;
}

function calculLabelByHeight(element: number) {
  if (element <= 0.99) {
    return element * 100 + ' cm';
  }

  if (element === 1) {
    return element + ' mètre';
  }

  return element + ' mètres';
}

function calculLabelByWeight(element: number) {
  if (element <= 0.99) {
    return element * 100 + ' gramme';
  }

  if (element === 1) {
    return element + ' kilo';
  }

  return element + ' kilos';
}

const SvgMale = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 11.8 12.8 14 10 14V16H8V14C5.2 14 3 11.8 3 9V7H2V9C2 12.9 5.2 16 9 16V18H15V16C18.8 16 22 12.9 22 9Z" fill="currentColor"/>
  </svg>
);

const SvgFemale = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2C14.2 2 16 4 16 6C16 8 14.2 10 12 10C9.8 10 8 8 8 6C8 4 9.8 2 12 2ZM12 12C15.3 12 18 14.7 18 18V20H6V18C6 14.7 8.7 12 12 12Z" fill="currentColor"/>
  </svg>
);

export default function PokemonProfile({
  pokemon,
  color,
  hasGenderDifferences,
}: PokemonProfileProps) {
  const sprites = useMemo(
    () => (pokemon ? buildPokemonSprites(pokemon.sprites, hasGenderDifferences) : []),
    [pokemon, hasGenderDifferences],
  );

  const [selectedSpriteId, setSelectedSpriteId] = useState('');

  useEffect(() => {
    setSelectedSpriteId(getDefaultArtworkSpriteId(sprites));
  }, [pokemon?.id, sprites]);

  const selectedSprite = useMemo(
    () => sprites.find((sprite) => sprite.id === selectedSpriteId) ?? sprites[0],
    [sprites, selectedSpriteId],
  );

  const spritePreferences = useMemo(
    () => parseSpritePreferences(selectedSprite?.id ?? ''),
    [selectedSprite?.id],
  );

  const applySpritePreferences = useCallback((nextPreferences: {
    isShiny: boolean;
    isFemale: boolean;
    category?: PokemonSpriteOption['category'];
    preferBack?: boolean;
  }) => {
    const nextSpriteId = findSpriteIdForPreferences(sprites, nextPreferences);

    setSelectedSpriteId(nextSpriteId);
  }, [sprites]);

  const handleToggleShiny = useCallback(() => {
    applySpritePreferences({
      isShiny: !spritePreferences.isShiny,
      isFemale: spritePreferences.isFemale,
      category: spritePreferences.category,
      preferBack: spritePreferences.isBack,
    });
  }, [applySpritePreferences, spritePreferences]);

  const handleToggleGender = useCallback(() => {
    applySpritePreferences({
      isShiny: spritePreferences.isShiny,
      isFemale: !spritePreferences.isFemale,
      category: spritePreferences.category,
      preferBack: spritePreferences.isBack,
    });
  }, [applySpritePreferences, spritePreferences]);

  const handleSpriteChange = useCallback((sprite: PokemonSpriteOption) => {
    setSelectedSpriteId(sprite.id);
  }, []);

  if (!pokemon || !selectedSprite) {
    return null;
  }

  const categoryLabel = selectedSprite.category === 'animated'
    ? 'Animé'
    : selectedSprite.category === 'artwork'
      ? 'Artwork'
      : 'Classique';

  return (
    <div className={styles.profileContainer} style={{ '--pokemon-color': color } as React.CSSProperties}>
      <div className={styles.mainContent}>
        <div className={styles.statsSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Statistiques de base</h3>
          </div>
          <div className={styles.statsContainer}>
            <Stats stats={pokemon.stats} color={color} />
          </div>
        </div>

        <div className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <Image
              className={selectedSprite.isAnimated ? `${styles.pokemonImage} ${styles.pokemonImageAnimated}` : styles.pokemonImage}
              placeholderImg='https://via.placeholder.com/479x479.png/f9f9f9/FFF?text=Chargement+du+media'
              errorImg='https://via.placeholder.com/479x479.png/f9f9f9/FFF?text=Chargement+du+media'
              src={selectedSprite.url}
            />
            <span className={styles.selectedSpriteLabel}>
              {selectedSprite.label}
              <span className={styles.selectedSpriteMeta}>
                {categoryLabel}
                {spritePreferences.isShiny ? ' · Shiny' : ''}
                {spritePreferences.isFemale ? ' · Femelle' : ''}
              </span>
            </span>
          </div>

          <div className={styles.variantControls}>
            <span className={styles.variantControlsTitle}>Variantes</span>
            <div className={styles.buttonsContainer}>
              <Button
                variant={spritePreferences.isShiny ? 'shiny' : 'ghost'}
                size="medium"
                onClick={handleToggleShiny}
                aria-pressed={spritePreferences.isShiny}
                aria-label={spritePreferences.isShiny ? 'Désactiver le mode shiny' : 'Activer le mode shiny'}
              >
                <img
                  className={styles.shinyButtonIcon}
                  src="https://raw.githubusercontent.com/msikma/pokesprite/master/misc/special-attribute/shiny-stars.png"
                  alt=""
                  height={22}
                />
                Shiny
              </Button>

              {hasGenderDifferences && (
                <Button
                  variant={spritePreferences.isFemale ? 'genderFemale' : 'gender'}
                  size="medium"
                  onClick={handleToggleGender}
                  aria-pressed={spritePreferences.isFemale}
                  aria-label={spritePreferences.isFemale ? 'Afficher la version mâle' : 'Afficher la version femelle'}
                >
                  {spritePreferences.isFemale ? <SvgFemale /> : <SvgMale />}
                  {spritePreferences.isFemale ? 'Femelle' : 'Mâle'}
                </Button>
              )}
            </div>
          </div>

          <PokemonSpritePicker
            sprites={sprites}
            pokemonId={pokemon.id}
            friendlyName={pokemon.friendlyName}
            showPreview={false}
            expandOptions
            selectedSpriteId={selectedSpriteId}
            defaultSpriteId={getDefaultArtworkSpriteId(sprites)}
            onSpriteChange={handleSpriteChange}
            accentColor={color}
          />
        </div>

        <div className={styles.characteristicsSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Caractéristiques</h3>
          </div>
          <div className={styles.characteristicsContainer}>
            <div className={styles.characteristicItem}>
              <span className={styles.characteristicLabel}>Taille :</span>
              <span className={styles.characteristicValue}>{calculLabelByHeight(pokemon.height / 10)}</span>
            </div>
            <div className={styles.characteristicItem}>
              <span className={styles.characteristicLabel}>Poids :</span>
              <span className={styles.characteristicValue}>{calculLabelByWeight(pokemon.weight / 10)}</span>
            </div>
            <div className={styles.characteristicItem}>
              <span className={styles.characteristicLabel}>Légendaire :</span>
              <span className={styles.characteristicValue}>{pokemon.is_legendary ? 'Oui' : 'Non'}</span>
            </div>
            <div className={styles.characteristicItem}>
              <span className={styles.characteristicLabel}>Fabuleux :</span>
              <span className={styles.characteristicValue}>{pokemon.is_mythical ? 'Oui' : 'Non'}</span>
            </div>
            <div className={styles.characteristicItem}>
              <span className={styles.characteristicLabel}>Expérience :</span>
              <span className={styles.characteristicValue}>{pokemon.base_experience}</span>
            </div>
            <div className={styles.characteristicItem}>
              <span className={styles.characteristicLabel}>Bonheur :</span>
              <span className={styles.characteristicValue}>{pokemon.base_happiness}</span>
            </div>
            <div className={styles.characteristicItem}>
              <span className={styles.characteristicLabel}>Capture :</span>
              <span className={styles.characteristicValue}>{pokemon.capture_rate}</span>
            </div>
            {pokemon.habitat?.url && <Habitat url={pokemon.habitat.url} />}
          </div>
        </div>
      </div>
    </div>
  );
}
