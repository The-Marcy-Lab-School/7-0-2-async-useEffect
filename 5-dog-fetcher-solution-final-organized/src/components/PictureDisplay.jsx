import { useEffect, useState } from 'react';
import fetchData from '../utils/fetchData';

const DOG_API = "https://dog.ceo/api/breeds/image/random";

const PictureDisplay = ({ dogPicture, setDogPicture, setError }) => {
  const [runEffectAgain, setRunEffectAgain] = useState(false);
  // render 1: 
  // - runEffectAgain is false
  // - run the effect the first time
  // - after 1 second, runEffectAgain = true, re-render
  // render 2:
  // - runEffectAgain is true
  // - the dependency array [runEffectAgain] is different so we run the effect again
  // - re-render
  // render 3:
  // - runEffectAgain is true

  console.log("PictureDisplay Rendering")

  // runs when the component renders
  useEffect(() => {
    console.log('running effect')
    // define an async function
    const doFetch = async () => {
      const [data, error] = await fetchData(DOG_API);
      if (data) setDogPicture(data);
      if (error) setError(error);
      setRunEffectAgain(false);
    };
    // invoke it immediately
    doFetch();
  }, [runEffectAgain]);

  useEffect(() => {
    setInterval(() => {
      setRunEffectAgain(true);
    }, 1000)
  }, []);

  return <img src={dogPicture.message} alt="" />
}

export default PictureDisplay;