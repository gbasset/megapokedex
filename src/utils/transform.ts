
import { PokeType,language } from "../../type-pokemons";
export function getNameInOtherLanguage  (pokemon: PokeType,idLanguage: string): string{
    const name = pokemon.names.find((language:language) => language.language.name === idLanguage);
    if(name) return name?.name;
    else return '';
  }
export function getPrincipalSpriteFrontPokemon(pokemon: PokeType | undefined){
     const sprite = pokemon?.sprites?.other['official-artwork'];
     if(sprite){
       sprite.front_female = pokemon?.sprites?.front_female;
       sprite.front_shiny_female = pokemon?.sprites?.front_shiny_female
      return sprite;
     }else return undefined
}
export function getPrincipalSpriteFrontPokemonNonOfficial(pokemon: PokeType | undefined){
     const sprite = pokemon?.sprites;
    return sprite;
}