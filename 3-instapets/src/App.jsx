import Header from './components/Header';
import PicturesList from './components/PicturesList';
import NewPetForm from './components/NewPetForm';
import './App.css';
import { useState } from 'react';

const getId = ((id = 0) => () => ++id)();

const initialPictures = [
  { id: getId(), src: './images/cat.jpeg', caption: 'meow' },
  { id: getId(), src: './images/dog.jpeg', caption: 'arf' },
  { id: getId(), src: './images/duck.jpeg', caption: 'quack' },
]

const App = () => {
  const [pictures, setPictures] = useState(initialPictures)
  const addPicture = (src, caption) => {
    // when setting an array state, return a new array
    // with the old array copied, plus the new value
    setPictures((currentPictures) => [
      ...currentPictures, { id: getId(), src, caption }
    ]);
  }

  return (
    <>
      <Header />
      <NewPetForm addPicture={addPicture} />
      <PicturesList pictures={pictures} />
    </>
  );
};

export default App;