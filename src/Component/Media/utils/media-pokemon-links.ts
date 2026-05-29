import type { MediaPokemonHighlight } from '../types/media.types';

const MEDIA_POKEMON_HIGHLIGHTS: Record<string, MediaPokemonHighlight[]> = {
  'movie-10228': [
    { pokemonId: 25, label: 'Mascotte', note: 'Pikachu reste la figure centrale de cette premiere aventure cinema.' },
    { pokemonId: 150, label: 'Antagoniste', note: 'Mewtwo est au coeur du conflit et de la thematique du film.' },
    { pokemonId: 151, label: 'Mystere', note: 'Mew porte la dimension mythique et originelle du recit.' },
  ],
  'movie-12599': [
    { pokemonId: 25, label: 'Compagnon', note: 'Pikachu accompagne toujours Sacha au centre du recit.' },
    { pokemonId: 249, label: 'Legendaire', note: 'Lugia est la creature emblematique de Pokemon 2000.' },
    { pokemonId: 144, label: 'Gardien', note: 'Artikodin fait partie des legendaires au coeur de l equilibre du monde.' },
    { pokemonId: 145, label: 'Gardien', note: 'Electhor participe a l intrigue autour des iles et des forces elementaires.' },
    { pokemonId: 146, label: 'Gardien', note: 'Sulfura complete le trio legendaire majeur du film.' },
  ],
  'movie-10991': [
    { pokemonId: 244, label: 'Legendaire', note: 'Entei est la figure emotionnelle et spectaculaire du troisieme film.' },
    { pokemonId: 201, label: 'Mystere', note: 'Les Zarbi pilotent l atmosphere et les illusions du recit.' },
  ],
  'movie-12600': [
    { pokemonId: 251, label: 'Legendaire', note: 'Celebi est l element central du voyage temporel de Pokemon 4Ever.' },
    { pokemonId: 250, label: 'Gardien', note: 'Ho-Oh renforce la dimension mythique du film.' },
  ],
  'movie-33875': [
    { pokemonId: 380, label: 'Duo legendaire', note: 'Latias protege la ville et occupe une place forte dans le film.' },
    { pokemonId: 381, label: 'Duo legendaire', note: 'Latios partage le coeur du recit avec Latias.' },
  ],
  'movie-36218': [
    { pokemonId: 385, label: 'Wish maker', note: 'Jirachi donne son identite et son emotion au film.' },
    { pokemonId: 384, label: 'Legendaire', note: 'Rayquaza sert de force spectaculaire face a la menace.' },
  ],
  'movie-34065': [
    { pokemonId: 386, label: 'Legendaire', note: 'Deoxys porte toute la tension du film et sa dimension extraterrestre.' },
    { pokemonId: 384, label: 'Rival legendaire', note: 'Rayquaza oppose sa puissance a Deoxys.' },
  ],
  'movie-34067': [
    { pokemonId: 448, label: 'Hero legendaire', note: 'Lucario est la figure majeure et la plus memorable du film.' },
    { pokemonId: 151, label: 'Mew', note: 'Mew structure la quete et les revelations autour de l arbre originel.' },
  ],
  'movie-16808': [
    { pokemonId: 490, label: 'Prince des mers', note: 'Manaphy est au centre du film et de sa dimension maritime.' },
    { pokemonId: 25, label: 'Mascotte', note: 'Pikachu garde sa place de repere affectif dans l aventure.' },
  ],
  'movie-494407': [
    { pokemonId: 249, label: 'Legendaire', note: 'Lugia lie l intrigue au festival et a la ville de Fula.' },
    { pokemonId: 25, label: 'Mascotte', note: 'Pikachu accompagne la dynamique de groupe du film.' },
    { pokemonId: 243, label: 'Presence marquee', note: 'Raikou fait partie des Pokemon mis en avant dans l univers du film.' },
  ],
  'movie-571891': [
    { pokemonId: 150, label: 'Version moderne', note: 'Cette relecture remet Mewtwo au tout premier plan.' },
    { pokemonId: 151, label: 'Origine', note: 'Mew conserve sa place de contrepoint mystique face a Mewtwo.' },
  ],
  'movie-662708': [
    { pokemonId: 893, label: 'Hero sauvage', note: 'Zarude est la creature symbolique de Secrets of the Jungle.' },
    { pokemonId: 25, label: 'Mascotte', note: 'Pikachu reste le fil rouge affectif de l aventure.' },
    { pokemonId: 251, label: 'Presences forestieres', note: 'Celebi est souvent associe a cet imaginaire de foret legendaire.' },
  ],
  'movie-447404': [
    { pokemonId: 25, label: 'Detective', note: 'Detective Pikachu repose evidemment sur Pikachu comme star absolue.' },
    { pokemonId: 54, label: 'Comic relief', note: 'Psykokwak marque beaucoup de scenes memorables du film live action.' },
    { pokemonId: 150, label: 'Intrigue', note: 'Mewtwo reste central dans les revelations et la menace finale.' },
    { pokemonId: 6, label: 'Icone live-action', note: 'Dracaufeu apporte une scene de combat devenue emblematiques du film.' },
  ],
  'tv-60572': [
    { pokemonId: 25, label: 'Compagnon iconique', note: 'Pikachu definit toute l identite de la serie classique.' },
    { pokemonId: 6, label: 'Fan favorite', note: 'Dracaufeu est l un des Pokemon les plus marquants du parcours de Sacha.' },
    { pokemonId: 1, label: 'Equipe historique', note: 'Bulbizarre fait partie des premiers piliers de l anime.' },
    { pokemonId: 7, label: 'Equipe historique', note: 'Carapuce reste un visage fort des debuts de la serie.' },
    { pokemonId: 133, label: 'Mascotte secondaire', note: 'Evoli traverse de nombreuses generations et evolutions de la serie.' },
  ],
  'tv-220150': [
    { pokemonId: 906, label: 'Starter phare', note: 'Poussacha est l une des signatures visuelles de Pokemon Horizons.' },
    { pokemonId: 909, label: 'Starter phare', note: 'Chochodile fait partie du nouveau trio marquant.' },
    { pokemonId: 912, label: 'Starter phare', note: 'Coiffeton complete la nouvelle generation mise en avant.' },
    { pokemonId: 384, label: 'Legendaire', note: 'Rayquaza chromatique sert de grand repere mystique a la serie.' },
  ],
  'tv-221301': [
    { pokemonId: 54, label: 'Relaxation', note: 'Psykokwak est l un des Pokemon les plus visibles et affectifs de Concierge.' },
    { pokemonId: 149, label: 'Majestueux', note: 'Dracolosse participe a l atmosphere douce et prestigieuse de la serie.' },
    { pokemonId: 133, label: 'Cute factor', note: 'Evoli s integre parfaitement a l ambiance cocon de Pokemon Concierge.' },
  ],
};

export function getFeaturedPokemonForMedia(mediaId: string): MediaPokemonHighlight[] {
  return MEDIA_POKEMON_HIGHLIGHTS[mediaId] ?? [];
}
