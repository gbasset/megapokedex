export function getNameInOtherLanguage  (pokemon: any,idLanguage: string){
    const name = pokemon.names.find(language => language.language.name === idLanguage);
    return name.name;
  }
export function getPrincipalSpriteFrontPokemon(pokemon: any){
     const sprite = pokemon.sprites.other['official-artwork'];
     sprite.front_female = pokemon.sprites.front_female;
     sprite.front_shiny_female = pokemon.sprites.front_shiny_female
    return sprite;
}
export function getPrincipalSpriteFrontPokemonNonOfficial(pokemon: any){
     const sprite = pokemon.sprites;
    return sprite;
}