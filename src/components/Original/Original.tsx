import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from 'react-router-dom';
import { original} from "../../types/original";
import "./Original.css";
import axios from "axios";

const Original: React.FC = () => {

  let { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); 
  const [original, setOrginal] = React.useState<original>({} as original);

    useEffect(() => {
      axios.get(`${import.meta.env.VITE_API_URL}paintings/originals/${id}`).then((response) => {
        setOrginal(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error(`Error fetching data: ${error}`);
      });
    }, []);

    return (
      <div className="orignal-content">   
        <div className="original-container">
        
        <div className="back-button_div">
          <button className="back-button" onClick={() => navigate(-1)}>
            &#8592; Back
          </button>
        </div>

          <div className="original-image-container">
            <img className="orginal-image" src={`${import.meta.env.VITE_IMAGE_BASE_PATH}${original.image_path}`} alt={original.title} />
          </div>
          <h2>{original.title}</h2>
          <p>{original.info}</p>

          <p>{original.type} - ${original.price} - {original.width}x{original.height} </p>
          {original.galleryLink ? (
            <p>Available at <Link to={`https://${original.galleryLink}`} target="_blank" rel="noopener noreferrer">{original.galleryName}</Link></p>
          ) : (
            <br/>
          )}
        </div>
      </div>
    );
  }
  
  export default Original;