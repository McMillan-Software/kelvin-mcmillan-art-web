import React, { useEffect } from "react";
import { originals } from "../../types/originals";
import './Portfolio.css';
import { NavLink } from "react-router-dom";
import axios from "axios";

const Originals: React.FC = () => {
    const [orginals, setOrginals] = React.useState<originals[]>([]);
    const [category, setCategory] = React.useState<String>("");

    useEffect(() => {
        console.log("Getting oringals for page: " + category);
        axios.get(`${import.meta.env.VITE_API_URL}/portfolio/${category}`)
        .then((response) => {

        setOrginals(response.data);
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
            <ul className="portfolio-list">
                {orginals.map((orginal: originals) => (
                    <li key={orginal.id}>
                        <div className="portfolio-list-item">
                            <img className="portfolio-image" src={"./src/mocks/images/" + orginal.title + ".jpg"} alt={orginal.title} />
                            <div><p>{orginal.title}</p></div>
                        </div>
                    </li> 
                ))}
            </ul>    
        </div>
    );
}

export default Originals;
