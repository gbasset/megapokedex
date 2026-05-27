import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { PokeType, EvolutionChainNode, EvolutionStep } from '../../../type-pokemons';
import EvolutionItem from './EvolutionItem';
import { getNameInOtherLanguage, getPrincipalSpriteFrontPokemon } from '../../utils/transform';
import { baseUrl } from '../../utils/apiAndDatabase';
import SimpleEvolution from './SimpleEvolution';


function Evolutions({ url }: P) {
    const [evolutions, setevolutions] = useState<Array<EvolutionStep>>();
    const [urlToFetch, seturlToFetch] = useState<string>();
    const [getFirst, setgetFirst] = useState<any>();

    useEffect(() => {
        axios.get(url)
            .then(x => {
                const accu: EvolutionStep[] = [];
                function recurse(arrayToChange: EvolutionStep[], elem: EvolutionChainNode) {
                    arrayToChange.push({ url: elem.species.url, evolution_details: elem.evolution_details, name: elem.species.name });
                    if (elem.evolves_to && elem.evolves_to.length > 0) {
                        for (const evo of elem.evolves_to) {
                            recurse(arrayToChange, evo);
                        }
                    }
                }
                // On commence sur la racine de la chaîne
                recurse(accu, x.data.chain);
                const accuFiltered = accu.map((x, i) => {
                    if (i === 0) {
                        return { ...x, isFirst: true }
                    } else {
                        return { ...x, isFirst: false }
                    }
                })
                setevolutions(accuFiltered);
                const chaining: EvolutionChainNode[] = x.data.chain.evolves_to;
                const allChains: EvolutionChainNode[][] = [];
                function traverseChain(currentChain: EvolutionChainNode[], currentPokemon: EvolutionChainNode) {
                    currentChain.push({
                        species: currentPokemon.species,
                        evolves_to: [],
                        evolution_details: currentPokemon.evolution_details,
                        is_baby: currentPokemon.is_baby
                    });
                    if (currentPokemon.evolves_to.length === 0) {
                        allChains.push([...currentChain]);
                        console.log('Added Chain:', currentChain);
                    } else {
                        for (const nextEvolution of currentPokemon.evolves_to) {
                            traverseChain([...currentChain], nextEvolution);
                        }
                    }
                }
                for (const pokemon of chaining) {
                    traverseChain([], pokemon);
                }
                console.log("🚀 ~ useEffect ~ allChains:", allChains)
            })
            .catch(err => {
                console.error(err);
            })
    }, [url]);

    function getFirstEvolution(finalPokemon: string) {
        axios.get(finalPokemon).then(poke => {
            const poke1 = poke.data;
            axios.get(baseUrl + `pokemon/${poke1.id}`).then(poke2 => {
                poke1.friendlyName = getNameInOtherLanguage(poke1, 'fr')
                const finalPokemon2 = { ...poke1, ...poke2.data };
                setgetFirst(finalPokemon2)
            })
        }).catch(err => {
            console.error(' ~ file: EvolutionItem.tsx:42 ~ axios.get ~ err:', err)
        });
    }
    useEffect(() => {
        if (urlToFetch) {
            getFirstEvolution(urlToFetch)
        }

    }, [urlToFetch])
    if (!evolutions || evolutions.length === 0) {
        return null
    }
    return (
        <div>
            <h2>Evolutions</h2>
            <div style={{ display: 'flex', width: '90%', margin: '25px auto', justifyContent: 'center', flexWrap: 'wrap' }}>
                {getFirst &&
                    <div>
                        <SimpleEvolution datas={getFirst} officialArtWork={getPrincipalSpriteFrontPokemon(getFirst)} id={getFirst.id} />
                    </div>
                }
                {evolutions?.map((evol: EvolutionStep) => (
                    <EvolutionItem
                        evol={evol.url}
                        key={evol.url}
                        evolArray={evol.evolution_details}
                        isFirst={evol.isFirst ?? false}
                        seturlToFetch={seturlToFetch}
                    />
                ))}

            </div>
        </div>
    )
}

export default Evolutions