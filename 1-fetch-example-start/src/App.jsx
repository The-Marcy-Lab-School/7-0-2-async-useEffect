import './App.css'

/* 
This file contains the entire application UI. Try refactoring it using the `SearchForm`
and `SearchResults` components to break up the application's UI logic.
*/

const JOKE_API_URL = "https://v2.jokeapi.dev/joke/Pun?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=twopart";

// URL constructor helper function
const getApiUrlWithQuery = (query = '') => {
  return JOKE_API_URL + `&contains=${query}`
};

// Fetching helper function
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// lets start with a hard-coded joke
const joke = {
  setup: "What do you call a pile of cats?",
  delivery: "A meowntain",
};

function App() {
  return (
    <>
      <div className="joke">
        <h1>{joke.setup}</h1>
        <p>{joke.delivery}</p>
      </div>
    </>
  );
}

export default App
