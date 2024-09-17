import React, { useEffect, useState } from "react";
import './Home.css';
import axios from "axios";
import { original } from "../../types/original";
import { NavLink } from "react-router-dom";
import OriginalsList from "../Shared/OriginalsList"

const Home: React.FC = () => {

  const [originals, setOriginals] = React.useState<original[]>([]);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:8000/paintings/home').then((response) => {
      setOriginals(response.data);
    })
    .catch((error) => {
      console.error(`Error fetching data: ${error}`);
    });
  }, []);

    return (
      <div className="home-div">

        <div className="expression-div">
          <img className="quote-image" src={"/src/assets/quote.jpg"} alt='quote' />
          <div className="quote-div">
            <h3 className="quote-text">"The most important element in a painting is light, especially the light from either end of the day, 
            which can bring a painting to life. The interplay of colors, shadows, and contrasts illuminated by this type of light can transform even the most mundane subject into something truly captivating."</h3>
          </div>
        </div>

        <hr></hr>

        <div className="originals-div">
          <NavLink className="originals-link" to={'/Originals'}>
            <h1>Latest Originals</h1>
          </NavLink>
          <div>
            <OriginalsList originals={originals} />
          </div>
        
        </div>

        <hr></hr>

        <div className="prints-div">
          <h1>Fine Art Prints</h1>
        </div>

      </div>
    );
}

export default Home;