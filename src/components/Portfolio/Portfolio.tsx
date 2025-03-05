import React, { useEffect } from "react";
import { original } from "../../types/original";
import './Portfolio.css';
import OriginalsList from "../Shared/OriginalsList"
import axios from "axios";

const Originals: React.FC = () => {
    const [originals, setOriginals] = React.useState<original[]>([]);
    const [category, setCategory] = React.useState<String>("");

    useEffect(() => {
        console.log("Getting oringals for page: " + category);
        axios.get(`${import.meta.env.VITE_API_URL}paintings/portfolio/${category}`)
        .then((response) => {

        setOriginals(response.data);
        })
        .catch((error) => {
            console.error(`Error fetching data: ${error}`);
          });
    }, [category]);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(event.target.value);
    };

    return (
        <div>
            <div className="category-selector">
                <label htmlFor="Category">Category</label>
                <select className="category-dropdown" id="catergory" onChange={handleCategoryChange}>
                    <option value="">All</option>
                    <option value="marine">Marine</option>
                    <option value="rural">Rural</option>
                    <option value="landscape">Landscape</option>
                    <option value="architectural">Architectural</option>
                    <option value="portrait">Portrait</option>
                    <option value="sport">Sport</option>
                </select>
            </div>
            <OriginalsList originals={originals} />    
        </div>
    );
}

export default Originals;
