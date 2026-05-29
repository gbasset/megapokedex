/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-inner-declarations */
import {
    createContext,
    useCallback,
    useMemo,
    useState,
    useContext,
    useEffect,
    type ReactNode,
    type ChangeEvent,
    type Dispatch,
    type SetStateAction
} from 'react';
import {baseUrl} from '../utils/apiAndDatabase';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import { PokeType,language } from '../../type-pokemons';

interface PokemonSpeciesListItem {
    name: string;
    url: string;
}

export interface MainContextValue {
    color: string;
    setcolor: Dispatch<SetStateAction<string>>;
    setmainInformationPokemonSelected: (pokemon?: PokeType) => void;
    mainInformationPokemonSelected: PokeType | undefined;
    setpokemonsDetails: Dispatch<SetStateAction<PokeType[]>>;
    setPokemons: Dispatch<SetStateAction<PokemonSpeciesListItem[]>>;
    pokemonsDetails: PokeType[];
    pokemons: PokemonSpeciesListItem[];
    isLoading: boolean;
    searchResults: PokeType[];
    setSearchResults: Dispatch<SetStateAction<PokeType[]>>;
    searchTerm: string;
    setSearchTerm: Dispatch<SetStateAction<string>>;
    handleChange: (event: ChangeEvent) => void;
    scrollPosition: number;
    comparisonPokemonIds: number[];
    toggleComparisonPokemon: (pokemonId: number) => void;
    setComparisonFirstPokemon: (pokemonId: number) => void;
    clearComparisonPokemons: () => void;
}

export const context = createContext<MainContextValue | null>(null);

export function UseMainContext() {
    const contextValue = useContext(context);

    if (!contextValue) {
        throw new Error('UseMainContext must be used inside ContextProvider');
    }

    return contextValue;
}
type cxt = {
    children : ReactNode;
}
interface PokemonSpeciesFetchSuccess {
    success: true;
    data: PokeType;
}

interface PokemonSpeciesFetchFailure {
    success: false;
}

type PokemonSpeciesFetchResult = PokemonSpeciesFetchSuccess | PokemonSpeciesFetchFailure;

export const ContextProvider = ({children}:cxt) => {
    const location = useLocation();
    const [scrollPosition, setScrollPosition] = useState<number>(0);
    const [color, setcolor] = useState<string>('normal');
    const [mainInformationPokemonSelected, setmainInformationPokemonSelected] = useState<PokeType | undefined>(undefined);
    const [pokemons, setPokemons] = useState<PokemonSpeciesListItem[]>([]);
    const [pokemonsDetails, setpokemonsDetails] = useState<Array<PokeType>| []>([]);
    const [isLoading, setisLoading] = useState<boolean>(true);
	const [searchResults, setSearchResults] = useState<Array<PokeType>>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [comparisonPokemonIds, setComparisonPokemonIds] = useState<number[]>([]);
    const setSelectedPokemonInformation = useCallback((pokemon?: PokeType) => {
        setmainInformationPokemonSelected(pokemon);
    }, []);
    const handleChange = useCallback((event:ChangeEvent) => {
        const target = event.target as HTMLTextAreaElement;
        if(target){
            setSearchTerm(target?.value);
        }
      }, []);
    const toggleComparisonPokemon = useCallback((pokemonId: number) => {
        setComparisonPokemonIds(currentIds => {
            if (currentIds.includes(pokemonId)) {
                return currentIds.filter(id => id !== pokemonId);
            }

            if (currentIds.length >= 2) {
                return [currentIds[1], pokemonId];
            }

            return [...currentIds, pokemonId];
        });
    }, []);

    const setComparisonFirstPokemon = useCallback((pokemonId: number) => {
        setComparisonPokemonIds((currentIds) => {
            const secondId = currentIds.find((id) => id !== pokemonId);

            return secondId ? [pokemonId, secondId] : [pokemonId];
        });
    }, []);

    const clearComparisonPokemons = useCallback(() => {
        setComparisonPokemonIds([]);
    }, []);
    useEffect(()=>{
        if(pokemonsDetails && searchTerm.length > 0){
           const result:Array<PokeType> =  pokemonsDetails.filter((pokemon:PokeType) => {
                if(pokemon.name.toLowerCase().includes(searchTerm)){
                    return pokemon;
                }
                const frenchName = pokemon.names.find((el:language) => el.language.name === 'fr');
                if(frenchName?.name.toLowerCase().includes(searchTerm)){
                    return pokemon;
                }
                const inglishName = pokemon.names.find((el:language) => el.language.name === 'en');
                if(inglishName?.name.toLowerCase().includes(searchTerm)){
                    return pokemon;
                }
                if(searchTerm.includes(pokemon.id.toString())){
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
            const urlPokemonUrl= pokemons.map((_pokemon, idx) => `https://pokeapi.co/api/v2/pokemon-species/${idx + 1}` );
            function getAllPok (urls:Array<string>){
               return Promise.all(urls.map(fetchData));
            }
            function fetchData(URL:string): Promise<PokemonSpeciesFetchResult>{
                    return axios
                      .get(URL)
                      .then(response => {
                         return {
                            success: true,
                            data: response.data
                         } as PokemonSpeciesFetchSuccess
                      })
                      .catch(function() {
                        return { success: false };
                      })
                  }
            
           getAllPok(urlPokemonUrl).then(
            pok => {
                setisLoading(false);
                return pok.filter((pokemonItem): pokemonItem is PokemonSpeciesFetchSuccess => pokemonItem.success).map(pokemonItem => {
                    return {
                        ...pokemonItem.data,
                        img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonItem.data.id}.png`
                    }
                })
            }
           ).then( resultPokemon => {
            setpokemonsDetails(resultPokemon)
           }).catch( err => {
               setisLoading(false);
               console.log(err)
           }
           );
           
        }
    },[pokemons]);

    const handleScroll = useCallback(() => {
        if(location.pathname === '/' ){
            const position = window.pageYOffset;
            if(position !== 0){
                setScrollPosition(position);
            }
        }
    }, [location.pathname]);
    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
    
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    const contextValue = useMemo(() => ({
        color,
        setcolor,
        setmainInformationPokemonSelected: setSelectedPokemonInformation,
        mainInformationPokemonSelected,
        setpokemonsDetails,
        setPokemons,
        pokemonsDetails,
        pokemons,
        isLoading,
        searchResults,
        setSearchResults,
        searchTerm,
        setSearchTerm,
        handleChange,
        scrollPosition,
        comparisonPokemonIds,
        toggleComparisonPokemon,
        setComparisonFirstPokemon,
        clearComparisonPokemons
    }), [
        color,
        mainInformationPokemonSelected,
        pokemonsDetails,
        pokemons,
        isLoading,
        searchResults,
        searchTerm,
        handleChange,
        scrollPosition,
        comparisonPokemonIds,
        toggleComparisonPokemon,
        setComparisonFirstPokemon,
        clearComparisonPokemons,
        setSelectedPokemonInformation
    ]);
	return (
		<context.Provider
			value={contextValue}
		>
			{children}
		</context.Provider>
	);
};