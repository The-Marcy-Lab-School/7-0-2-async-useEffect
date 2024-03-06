import { useState } from 'react';

const InstagramPost = ({ picture }) => {
  const [likes, setLikes] = useState(0)

  const handleClick = () => {
    setLikes((currentLikes) => currentLikes + 1)
  }

  return (
    <div className="insta-pic">
      <img alt={picture.caption} src={picture.src} />
      <p>{picture.caption}</p>
      <button onClick={handleClick}>❤️ {likes}</button>
    </div>
  );
};

export default InstagramPost;