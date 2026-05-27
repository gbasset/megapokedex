import React, { useEffect, useState } from 'react';
import { PokeType, sprite } from '../../../type-pokemons';
import axios from 'axios';
import { getNameInOtherLanguage, getPrincipalSpriteFrontPokemon } from '../../utils/transform';
import { baseUrl } from '../../utils/apiAndDatabase';

import styles from './PodeId.module.css';
import arrow from '../../assets/right-arrow.png';
import SimpleEvolution from './SimpleEvolution';

type P = {
  evol?: string;
  isEvolveFrom?: boolean;
  evolArray?: any;
  isFirst: boolean;
  seturlToFetch?: (url: string) => void;
};

function EvolutionItem({ evol, evolArray, isFirst, seturlToFetch }: P) {
  const [officialArtWork, setofficialArtWork] = useState<sprite['other']['official-artwork'] | undefined>(undefined);
  const [datas, setdatas] = useState<PokeType | undefined>();
  const [id, setid] = useState<string | undefined>();

  useEffect(() => {
    if (!evol) return;

    axios.get<PokeType>(evol)
      .then((res) => {
        const d = res.data;
        setid(d.id?.toString());
        axios.get<PokeType>(baseUrl + `pokemon/${d.id}`)
          .then((poke) => {
            const dat = poke.data;
            dat.friendlyName = getNameInOtherLanguage(d, 'fr');
            setofficialArtWork(getPrincipalSpriteFrontPokemon(dat));
            const finalPokemon = { ...dat, ...d };
            setdatas(finalPokemon);
            if (isFirst && finalPokemon?.evolves_from_species && seturlToFetch) {
              seturlToFetch(finalPokemon.evolves_from_species.url);
            }
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  }, [evol, isFirst, seturlToFetch]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {!isFirst && evolArray && (
        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', width: '200px' }}>
          <strong> Level +  {evolArray[0]?.min_level}</strong>
          <img className={styles.image_container_img_mini} alt={'arrow'} src={arrow} />
        </div>
      )}
      {id && datas && (
        <SimpleEvolution officialArtWork={officialArtWork} datas={datas} id={id} />
      )}
    </div>
  );
}

export default EvolutionItem;