import React, { useEffect, useState } from "react";
import './Home.css';
import axios from "axios";
import { Original } from "../../types/original";
import { NavLink } from "react-router-dom";
import OriginalsList from "../Shared/OriginalsList"
import Reveal from "../Shared/Reveal";
import Hero from "./Hero";

// The statement image fills one of two columns on desktop — roughly a third of
// the viewport inside the 60%-capped content column — and the full width below 900px.
const QUOTE_SIZES = '(min-width: 1000px) 32vw, (min-width: 900px) 50vw, 100vw';

const Home: React.FC = () => {

  const [originals, setOriginals] = React.useState<Original[]>([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}paintings/home`).then((response) => {
      setOriginals(response.data);
    })
      .catch((error) => {
        console.error(`Error fetching data: ${error}`);
      });
  }, []);

  return (
    <div className="home-div">

      <Hero />

      <Reveal as="section" id="artist-statement" className="expression-div">
        <figure className="quote-figure">
          <picture>
            <source
              type="image/webp"
              sizes={QUOTE_SIZES}
              srcSet="/images/quote/quote-600.webp 600w, /images/quote/quote-900.webp 900w, /images/quote/quote-1400.webp 1400w"
            />
            <img
              className="quote-image"
              src="/images/quote/quote-900.jpg"
              sizes={QUOTE_SIZES}
              width={2500}
              height={1639}
              alt="Watercolour painting by Kelvin McMillan of a gravel road leading toward snow-covered Canterbury ranges at golden hour, a pale moon in a blue sky"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </figure>

        <blockquote className="quote-div">
          <p className="quote-text">
            The most important element in a painting is light, especially the light from either end of the day,
            which can bring a painting to life. The interplay of colors, shadows, and contrasts illuminated by
            this type of light can transform even the most mundane subject into something truly captivating.
          </p>
          <footer className="quote-cite">
            <cite>Kelvin McMillan</cite>
          </footer>
        </blockquote>
      </Reveal>

      <hr></hr>

      <div className="originals-div">
        <NavLink className="originals-link" to={'/Originals'}>
          <h1>Latest Originals</h1>
        </NavLink>
        <div>
          <OriginalsList originals={originals} />
        </div>

      </div>
    </div>
  );
}

export default Home;