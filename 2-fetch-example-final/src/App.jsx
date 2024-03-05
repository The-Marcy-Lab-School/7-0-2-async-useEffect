import './App.css'
import { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import fetchData from './utils/fetchData'

/* 
This file contains the entire application UI. Try refactoring it using the `SearchForm`
and `SearchResults` components to break up the application's UI logic.
*/

const JOKE_API_URL = "https://v2.jokeapi.dev/joke/Pun?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart";

// URL constructor helper function
const getApiUrlWithQuery = (query = '') => {
  return JOKE_API_URL + `&contains=${query}`
};

/* 
1. App renders with two pieces of state: userInput, joke
2. onChange event occurs, updating userInput
3. a re-render is triggered
4. on the re-render, the component checks if userInput changed
5. if it did, run the effect again 
*/

function App() {
  const [userInput, setUserInput] = useState('');
  const [joke, setJoke] = useState({ delivery: '', setup: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const doFetch = async () => {
      const url = getApiUrlWithQuery(userInput);
      const [responseData, error] = await fetchData(url);
      if (responseData) {
        const { delivery, setup } = responseData;
        setJoke({ delivery, setup });
      }
      if (error) setError(error.message);
    }
    doFetch(); // and we just call the function immediately

  }, [userInput]); // re-run the effect when `query` changes

  return (
    <>
      <SearchForm userInput={userInput} setUserInput={setUserInput} />
      {
        error ? <p>{error}</p> : <SearchResults joke={joke} />
      }
    </>
  );
}

export default App
