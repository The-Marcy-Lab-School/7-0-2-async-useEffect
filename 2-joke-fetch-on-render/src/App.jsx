import './App.css'
import { useState, useEffect } from 'react';
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
  const [joke, setJoke] = useState();
  const [error, setError] = useState('');

  useEffect(() => {
    const doFetch = async () => {
      const [data, error] = await fetchData(JOKE_API_URL);
      if (data) setJoke(data);
      if (error) setError(error);
    }
    doFetch();
  }, []) // <-- run the effect once
  // When does useEffect execute the effect?
  // When the component it is in is rendered

  const handleClick = async () => {
    const [data, error] = await fetchData(JOKE_API_URL);
    if (data) setJoke(data);
    if (error) setError(error);
  }
  // this side effect runs when the button is clicked

  if (error) return <p>{error.message}</p>

  return (
    <>
      <button onClick={handleClick}>Get Random Joke</button>

      <div className="joke">
        <h1>{joke?.setup}</h1>
        <p>{joke?.delivery}</p>
      </div>
    </>
  );
}

export default App
