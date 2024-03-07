import { useState, useEffect } from 'react'
import fetchData from './utils/fetchData'
import './App.css'
import PictureDisplay from './components/PictureDisplay';
import DogFetchButton from './components/DogFetchButton';

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

  console.log("App Rendering")

  // Conditional Rendering
  if (error) return <p>{error.message}</p>

  return (
    <>
      <DogFetchButton setDogPicture={setDogPicture} setError={setError} />
      <PictureDisplay dogPicture={dogPicture} setDogPicture={setDogPicture} setError={setError} />
    </>
  );
}

export default App