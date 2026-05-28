import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { EvolutionChainNode, EvolutionDetail, PokeType } from '../../../type-pokemons';
import { getNameInOtherLanguage } from '../../utils/transform';
import { baseUrl } from '../../utils/apiAndDatabase';
import DecorativeCard from '../UI/DecorativeCard';
import styles from './Evolutions.module.css';

interface EvolutionsProps {
    url: string;
    pokemon: PokeType;
    color: string;
}

interface EvolutionPokemon {
    children: EvolutionPokemon[];
    details: EvolutionDetail[];
    friendlyName: string;
    id: number;
    name: string;
    spriteUrl: string | null;
    speciesUrl: string;
}

interface EvolutionChainResponse {
    chain: EvolutionChainNode;
}

function formatApiName(name: string): string {
    return name
        .split('-')
        .filter(Boolean)
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

function formatEvolutionDetails(details: EvolutionDetail[]): string {
    const detail = details[0];

    if (!detail) {
        return 'Forme de base';
    }

    if (typeof detail.min_level === 'number') {
        return `Niv. ${detail.min_level}`;
    }

    if (detail.item) {
        return formatApiName(detail.item.name);
    }

    if (detail.held_item) {
        return `Objet tenu: ${formatApiName(detail.held_item.name)}`;
    }

    if (detail.min_happiness) {
        return `Bonheur ${detail.min_happiness}+`;
    }

    if (detail.min_affection) {
        return `Affection ${detail.min_affection}+`;
    }

    if (detail.min_beauty) {
        return `Beauté ${detail.min_beauty}+`;
    }

    if (detail.location) {
        return formatApiName(detail.location.name);
    }

    if (detail.known_move_type) {
        return `Capacité ${formatApiName(detail.known_move_type.name)}`;
    }

    if (detail.trigger?.name === 'trade') {
        return 'Échange';
    }

    return formatApiName(detail.trigger?.name ?? 'Évolution');
}

async function hydrateEvolutionNode(node: EvolutionChainNode): Promise<EvolutionPokemon> {
    const speciesResponse = await axios.get<PokeType>(node.species.url);
    const pokemonResponse = await axios.get<PokeType>(`${baseUrl}pokemon/${speciesResponse.data.id}`);
    const children = await Promise.all(node.evolves_to.map(hydrateEvolutionNode));
    const spriteUrl = pokemonResponse.data.sprites?.other['official-artwork'].front_default ?? pokemonResponse.data.sprites?.front_default ?? null;

    return {
        children,
        details: node.evolution_details,
        friendlyName: getNameInOtherLanguage(speciesResponse.data, 'fr') || formatApiName(node.species.name),
        id: speciesResponse.data.id,
        name: node.species.name,
        spriteUrl,
        speciesUrl: node.species.url,
    };
}

interface EvolutionCardProps {
    currentPokemonId: number;
    node: EvolutionPokemon;
}

function EvolutionCard({ currentPokemonId, node }: EvolutionCardProps) {
    const isActive = node.id === currentPokemonId;
    const className = [
        styles.evolutionCard,
        isActive ? styles.activeEvolutionCard : '',
    ].filter(Boolean).join(' ');

    return (
        <Link
            aria-current={isActive ? 'page' : undefined}
            aria-label={`Voir la fiche de ${node.friendlyName}`}
            className={className}
            to={`/poke/${node.id}`}
        >
            {isActive && <span className={styles.activeLabel}>Actuel</span>}
            <span className={styles.pokemonId}>#{node.id.toString().padStart(3, '0')}</span>
            <span className={styles.spriteFrame}>
                {node.spriteUrl ? (
                    <img className={styles.sprite} src={node.spriteUrl} alt={node.friendlyName} />
                ) : (
                    <span className={styles.spriteFallback}>{node.friendlyName.charAt(0)}</span>
                )}
            </span>
            <span className={styles.pokemonName}>{node.friendlyName}</span>
        </Link>
    );
}

function containsCurrentPokemon(node: EvolutionPokemon, currentPokemonId: number): boolean {
    return node.id === currentPokemonId || node.children.some(child => containsCurrentPokemon(child, currentPokemonId));
}

interface EvolutionNodeProps {
    currentPokemonId: number;
    isRoot?: boolean;
    node: EvolutionPokemon;
}

function EvolutionNode({ currentPokemonId, isRoot = false, node }: EvolutionNodeProps) {
    const isInActivePath = containsCurrentPokemon(node, currentPokemonId);
    const connectorClassName = [
        styles.connector,
        isInActivePath ? styles.activeConnector : '',
    ].filter(Boolean).join(' ');

    return (
        <li className={styles.node}>
            <div className={styles.nodeMain}>
                {!isRoot && (
                    <div className={connectorClassName} aria-label={`Condition: ${formatEvolutionDetails(node.details)}`}>
                        <span className={styles.connectorLine} />
                        <span className={styles.conditionBadge}>{formatEvolutionDetails(node.details)}</span>
                    </div>
                )}
                <EvolutionCard currentPokemonId={currentPokemonId} node={node} />
            </div>

            {node.children.length > 0 && (
                <ul className={styles.children}>
                    {node.children.map(child => (
                        <EvolutionNode
                            currentPokemonId={currentPokemonId}
                            key={child.speciesUrl}
                            node={child}
                        />
                    ))}
                </ul>
            )}
        </li>
    );
}

function Evolutions({ url, pokemon, color }: EvolutionsProps) {
    const [evolutionTree, setEvolutionTree] = useState<EvolutionPokemon | undefined>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        axios.get<EvolutionChainResponse>(url)
            .then(response => hydrateEvolutionNode(response.data.chain))
            .then(tree => {
                if (isMounted) {
                    setEvolutionTree(tree);
                    setIsLoading(false);
                }
            })
            .catch(err => {
                console.error(err);
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [url]);

    if (isLoading) {
        return (
            <DecorativeCard color={color} contentClassName={styles.evolutionsContent} pattern="cardShapes">
                <div className={styles.header}>
                    <span className={styles.eyebrow}>Lignée Pokémon</span>
                    <h2>Évolutions</h2>
                </div>
                <div className={styles.loadingState}>Chargement de la chaîne...</div>
            </DecorativeCard>
        );
    }

    if (!evolutionTree) {
        return null;
    }

    return (
        <DecorativeCard color={color} contentClassName={styles.evolutionsContent} pattern="cardShapes">
            <div className={styles.header}>
                <span className={styles.eyebrow}>Lignée Pokémon</span>
                <h2>Évolutions</h2>
                <p>
                    La sphère marquée <strong>Actuel</strong> indique où se situe {pokemon.friendlyName} dans sa chaîne.
                </p>
            </div>

            <div className={styles.treeViewport}>
                <ul className={styles.tree}>
                    <EvolutionNode currentPokemonId={pokemon.id} isRoot node={evolutionTree} />
                </ul>
            </div>
        </DecorativeCard>
    );
}

export default Evolutions;