import fetchData from "../utils/fetchData";

const DogFetchButton = ({ setDogPicture, setError }) => {

  console.log("DogFetchButton Rendering")

  // Make the event handler async
  const handleClick = async () => {
    const [data, error] = await fetchData(DOG_API);
    if (data) setDogPicture(data);
    if (error) setError(error);
  }

  return (
    <button onClick={handleClick}>Get Random Dog Picture</button>
  )
}

export default DogFetchButton;