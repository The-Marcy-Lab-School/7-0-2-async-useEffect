import { useState } from 'react'
import fetchData from './utils/fetchData'
import './App.css'

const DOG_API = "https://dog.ceo/api/breeds/image/random";

function App() {
  // Create state for the fetched data
  const [dog, setDog] = useState();
  // Always create state to store any errors
  const [error, setError] = useState('');

  // Make the event handler async
  const handleClick = async () => {
    const [data, error] = await fetchData(DOG_API);
    if (data) setDog(data.message);
    if (error) setError(error);
  }

  // Conditional Rendering
  if (error) return <p>{error.message}</p>

  return (
    <>
      <button onClick={handleClick}>Get Random Dog Picture</button>
      <img src={dog} alt="" />
    </>
  );
}

export default App
