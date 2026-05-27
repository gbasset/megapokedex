export type Habitat = {
  name: string;
  url: string;
}
export type Ability = {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}
export type Variety = {
  is_default: boolean;
  pokemon: {
    name: string;
    url: string;
  }
}

export type flavor_text_entrie = {
  flavor_text: string;
  language: {
    name: string;
    url: string;
  };
  version: {
    name: string;
    url: string;
  };
}
export type language = {
  language: {
    name: string;
    url: string;
  };
  name: string;
}

export type sprite = {
  back_default: string | null;
  back_female: string | null;
  back_shiny: string | null;
  back_shiny_female: string | null | undefined;
  front_default: string | null | undefined;
  front_female: string | null | undefined;
  front_shiny: string | null | undefined;
  front_shiny_female: string | null | undefined;
  other: {
    'official-artwork': {
      front_default: string | null;
      front_female: string | null | undefined;
      front_shiny: string | null | undefined;
      front_shiny_female: string | null | undefined;
    }
    showdown: {
      back_default: string | null;
      back_female: string | null;
      back_shiny: string | null;
      back_shiny_female: string | null | undefined;
      front_default: string | null;
      front_female: string | null;
      front_shiny: string | null | undefined;
      front_shiny_female: string | null | undefined;
    };
  }
};

export type PokeType = {
  abilities: [Ability];
  base_experience: number;
  base_happiness: number;
  capture_rate: number;
  color: string;
  name: string;
  url: string;
  img?: string;
  cries: object;
  evolution_chain: { url: string };
  evolves_from_species: { url: string, name: string };
  flavor_text_entries: [flavor_text_entrie | []];
  form_descriptions: [];
  forms: [object];
  forms_switchable: boolean;
  friendlyName: string;
  game_indices: [object];
  gender_rate: number;
  genera: [object];
  generation: object;
  growth_rate: object;
  habitat: Habitat;
  has_gender_differences: boolean;
  hatch_counter: number;
  height: number;
  held_items: [];
  is_baby: boolean;
  id: number;
  is_default: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  location_area_encounters: string;
  moves: [object];
  names: [language];
  order: number;
  pal_park_encounters: [object];
  past_abilities: [];
  past_types: [];
  pokedex_numbers: [object];
  shape: object;
  stats: [{
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    }
  }];
  types: object[];
  varieties: [Variety];
  weight: number;
  sprites?: sprite
}
export type Evolution = {
  baby_trigger_item: any,
  chain: {
    evolution_details: [any],
    evolves_to: Array<Evolution>,
    is_baby: boolean,
    species: {
      name: string,
      url: string
    }
  },
  species: {
    name: string,
    url: string
  },
  id: number

}


export type EvolutionDetail = {
  gender: number | null;
  held_item: { name: string; url: string } | null;
  item: { name: string; url: string } | null;
  known_move: any;
  known_move_type: { name: string; url: string } | null;
  location: { name: string; url: string } | null;
  min_affection: number | null;
  min_beauty: number | null;
  min_happiness: number | null;
  min_level: number | null;
  needs_overworld_rain: boolean;
  party_species: any;
  party_type: any;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: any;
  trigger: { name: string; url: string };
  turn_upside_down: boolean;
};

export type EvolutionChainNode = {
  species: { name: string; url: string };
  evolution_details: EvolutionDetail[];
  evolves_to: EvolutionChainNode[];
  is_baby: boolean;
};

export type EvolutionStep = {
  url: string;
  evolution_details: EvolutionDetail[];
  name: string;
  isFirst?: boolean;
};