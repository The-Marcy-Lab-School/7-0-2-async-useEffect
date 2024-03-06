import InstagramPost from './InstagramPost'

const PicturesList = ({ pictures }) => {
  return (
    <ul className="pictures-list">
      {
        pictures.map((picture) => {
          return <li key={picture.id}><InstagramPost picture={picture} /></li>
        })
      }
    </ul>
  )
};

export default PicturesList;
