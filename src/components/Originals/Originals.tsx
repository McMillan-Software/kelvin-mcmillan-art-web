import React, { useEffect } from "react";
import { Original } from "../../types/original";
import axios from 'axios';
import "./Originals.css";
import OriginalsList from "../Shared/OriginalsList"
import PageHeader from "../Shared/PageHeader";

const Originals: React.FC = () => {
  const [originals, setOriginals] = React.useState<Original[]>([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}paintings/originals`).then((response) => {
      setOriginals(response.data);
    })
      .catch((error) => {
        console.error(`Error fetching data: ${error}`);
      });
  }, []);

  return (
    <div className="originals-cotent">
      <PageHeader
        eyebrow="Available works"
        title="Originals"
        intro="Every work below is currently available for purchase."
      />
      <OriginalsList originals={originals} />
    </div>
  );
}

export default Originals;