import { useState } from 'react'
import fetchData from './utils/fetchData'
import './App.css'

const DOG_API = "https://dog.ceo/api/breeds/image/random";

const defaultDog = {
  "message": "https://images.dog.ceo/breeds/hound-walker/n02089867_1764.jpg",
  "status": "success"
};

function App() {
  // Create state for the fetched data
  const [dogPicture, setDogPicture] = useState(defaultDog);
  // Always create state to store any errors
  const [error, setError] = useState('');

  // Make the event handler async
  const handleClick = async () => {
    const [data, error] = await fetchData(DOG_API);
    if (data) setDogPicture(data);
    if (error) setError(error);
  }

  // Conditional Rendering
  if (error) return <p>{error.message}</p>

  return (
    <>
      <button onClick={handleClick}>Get Random Dog Picture</button>
      <img src={dogPicture.message} alt="" />
    </>
  );
}

export default App