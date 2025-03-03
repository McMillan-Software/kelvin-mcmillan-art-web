import React, { useEffect } from "react";
import { original } from "../../types/original";
import axios from 'axios';
import "./Originals.css";
import OriginalsList from "../Shared/OriginalsList"

const Originals: React.FC = () => {
    const [originals, setOriginals] = React.useState<original[]>([]);

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
        <h3 className="oringals-title">All works below are currently available for purchase.</h3>
        <OriginalsList originals={originals} />
      </div>
    );
  }
  
  export default Originals;