/* eslint-disable no-inner-declarations */
import React, { createContext, useState, useContext ,useEffect} from 'react';
import {baseUrl} from '../utils/apiAndDatabase';
import axios from 'axios';
import { useLocation } from "react-router-dom";
export const context = createContext();

export function UseMainContext() {
    return useContext(context);
}
export const ContextProvider = ({children}) => {
    const location = useLocation();
    const [scrollPosition, setScrollPosition] = useState(0);

    const [color, setcolor] = useState('normal');
    const [mainInformationPokemonSelected, setmainInformationPokemonSelected] = useState();
    const [pokemons, setPokemons] = useState([]);
    const [pokemonsDetails, setpokemonsDetails] = useState([]);

    const [isLoading, setisLoading] = useState(true);
	const [searchResults, setSearchResults] = useState([]);

    const [genre, setGenre] = useState('normal');
    const [isShinny, setisShinny] = useState(false)
    const [searchTerm, setSearchTerm] = useState("");
    const handleChange = event => {
        setSearchTerm(event.target.value);
      };
    function handleChooseShiny(){
        setisShinny(!isShinny);
    }
    useEffect(()=>{
        if(pokemonsDetails && searchTerm.length > 0){
           const result =  pokemonsDetails.filter(pokemon => {
                if(pokemon.name.toLowerCase().includes(searchTerm)){
                    return pokemon;
                }
                const frenchName = pokemon.names.find(el => el.language.name === 'fr');
                if(frenchName.name.toLowerCase().includes(searchTerm)){
                    return pokemon;
                }
                const inglishName = pokemon.names.find(el => el.language.name === 'en');
                if(inglishName.name.toLowerCase().includes(searchTerm)){
                    return pokemon;
                }
                if(searchTerm.includes(pokemon.id)){
                    return pokemon;
                }
            });
            setSearchResults(result);
        }else{
            setSearchResults(pokemonsDetails);
        }

    },[pokemonsDetails, searchTerm]);
    useEffect(()=>{
        axios.get(baseUrl+`pokemon-species?offset=0&limit=1050`)
        .then(res =>{
            setPokemons(res.data.results);
        })
        .catch(err => {
            console.error(err);
            setisLoading(false);
        })
    },[]);

    useEffect(()=>{
        if(pokemons.length > 0){
            const urlPokemonUrl= pokemons.map((x, idx) => `https://pokeapi.co/api/v2/pokemon-species/${idx + 1}` );
            function getAllPok (urls){
               return Promise.all(urls.map(fetchData));
            }
            function fetchData(URL){
                    return axios
                      .get(URL)
                      .then(response => {
                         return {
                            success: true,
                            data: response.data
                         }
                      })
                      .catch(function() {
                        return { success: false };
                      })
                  }
            
           getAllPok(urlPokemonUrl).then(
            pok => {
                setisLoading(false);
                return pok.map(pokemonItem => {
                    return {
                        ...pokemonItem.data,
                        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonItem.data.id}.png`
                    }
                })
            }
           ).then( resultPokemon => {
            setpokemonsDetails(resultPokemon)
           }).catch(
                setisLoading(false)
           );
           
        }
    },[pokemons]);

    const handleScroll = () => {
        if(location.pathname === '/' ){
            const position = window.pageYOffset;
            if(position !== 0){
                setScrollPosition(position);
            }
        }
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [location]);
	return (
		<context.Provider
			value={{
                color,
                setcolor,
                setmainInformationPokemonSelected,
				mainInformationPokemonSelected,
				setpokemonsDetails,
				setPokemons,
				pokemonsDetails,
				pokemons,
                handleChooseShiny,
                genre,
                setGenre,
                isShinny,
                isLoading,
                searchResults,
                setSearchResults,
                searchTerm,
                handleChange,
                scrollPosition
			}}
		>
			{children}
		</context.Provider>
	);
};