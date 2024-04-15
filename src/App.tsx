import { useEffect, useState } from "react";
import { getRandomPokemon } from "./helpers/getRandomWord";
import { letters } from "./helpers/letters";
import './App.css';
import { HangImage } from "./components/HangImage";

interface Pokemon {
  name: string;
  image: string;
}

function App() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [hiddenWord, setHiddenWord] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [lose, setLose] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const newPokemon = await getRandomPokemon();
      setPokemon(newPokemon);
      setHiddenWord('_ '.repeat(newPokemon.name.length));
      setAttempts(0);
      setLose(false);
      setWon(false);
    } catch (error) {
      //console.error('Error fetching random Pokemon:', error);
      const defaultPokemon: Pokemon = { name: 'POKÉMON', image: '' };
      setPokemon(defaultPokemon);
      setHiddenWord('_ '.repeat(7)); 
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (attempts >= 9) {
      setLose(true);
    }
  }, [attempts]);

  useEffect(() => {
    const currentHiddenWord = hiddenWord.split(' ').join('');
    if (currentHiddenWord === pokemon?.name) {
      setWon(true);
    }
  }, [hiddenWord, pokemon?.name]);

  const checkLetter = (letter: string) => {
    if (lose || won) return;

    if (!pokemon?.name.includes(letter)) {
      setAttempts(Math.min(attempts + 1, 9));
      return;
    }

    const hiddenWordArray = hiddenWord.split(' ');

    for (let i = 0; i < pokemon.name.length; i++) {
      if (pokemon.name[i] === letter) {
        hiddenWordArray[i] = letter;
      }
    }

    setHiddenWord(hiddenWordArray.join(' '));
  };

  const newGame = async () => {
    await fetchData();
    setWon(false);
    setLose(false);
  };

  return (
    
    <div className="App">
      <HangImage imageNumber={attempts} />
      {(!lose && !won) && <h3>¿Quién es ese Pokémon?</h3>}
      <h3>{hiddenWord}</h3>
      <h3>Intentos: {attempts}/9</h3>
      {lose && (
        <div>
          <h2>Perdiste, el Pokémon es {pokemon?.name}.</h2>
          <img src={pokemon?.image} alt={pokemon?.name} />
          <br /><br />
          <button onClick={newGame}>Volver a jugar</button>
        </div>
      )}
      {won && (
        <div>
          <h2>¡GANASTE el Pokémon es {pokemon?.name}!</h2>
          <img src={pokemon?.image} alt={pokemon?.name} />
          <br /><br />
          <button onClick={newGame}>Volver a jugar</button>
        </div>
      )}
      {letters.map((letter) => (
        <button onClick={() => checkLetter(letter)} key={letter}>
          {letter}
        </button>
      ))}
      <br /><br />
      <button onClick={newGame}>Reiniciar</button>
    </div>

  );
}

export default App;
