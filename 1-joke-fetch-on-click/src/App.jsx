import './App.css'
import { useState } from 'react';
import fetchData from './utils/fetchData'

/* 
This file contains the entire application UI. Try refactoring it using the `SearchForm`
and `SearchResults` components to break up the application's UI logic.
*/


const JOKE_API_URL = "https://v2.jokeapi.dev/joke/Pun?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart";

// lets start with a hard-coded joke
const defaultJoke = {
  setup: "What do you call a pile of cats?",
  delivery: "A meowntain",
};

function App() {
  const [joke, setJoke] = useState(defaultJoke);
  const [error, setError] = useState('');

  const handleClick = async () => {
    const [data, error] = await fetchData(JOKE_API_URL);
    if (data) setJoke(data);
    if (error) setError(error);
  }

  if (error) return <p>{error.message}</p>

  return (
    <>
      <button onClick={handleClick}>Get Random Joke</button>

      <div className="joke">
        <h1>{joke.setup}</h1>
        <p>{joke.delivery}</p>
      </div>
    </>
  );
}

export default App
