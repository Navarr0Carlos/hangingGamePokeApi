
export async function getRandomPokemon() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const randomPokemonName = data.results[randomIndex].name.toUpperCase();
        const randomPokemonUrl = data.results[randomIndex].url;
        const pokemonResponse = await fetch(randomPokemonUrl);
        const pokemonData = await pokemonResponse.json();
        const pokemonImage = pokemonData.sprites.front_default;
        return { name: randomPokemonName, image: pokemonImage };
    } catch (error) {
        //console.error('Error fetching random Pokemon:', error);
        return { name: 'POKÉMON', image: '' }; // En caso de error, devolver un valor predeterminado
    }
}
