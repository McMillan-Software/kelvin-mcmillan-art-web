import React, { useEffect, useState } from "react";
import './Prints.css';
import { giclee, option } from "../../types/giclee";
import axios from "axios";

const Prints: React.FC = () => {
    const [giclees, setGiclees] = useState<giclee[]>([])

    useEffect(() => {
        console.log("Getting Giclees")
        axios.get(`${import.meta.env.VITE_API_URL}paintings/giclees/v2`)
            .then(
                (response) => {
                    setGiclees(response.data);
                })
            .catch((error) => {
                console.error(`Error fetching giclees: ${error}`);
            });
    }, []);





    return (
        <div className='prints-page'>
            <h3>Prints</h3>
            <div className="prints-content">
                <ul className="prints-list">
                    {giclees.map((item: giclee) => (
                        <li key={item.painting.id}>
                            <div className="giclee-list-item">
                                <img className="painting-image" src={`${import.meta.env.VITE_IMAGE_BASE_PATH}${item.painting.imagePath}`} alt={item.painting.title} />
                                <div className="giclee-list-item-text">
                                    <p className="giclee-title">
                                        <strong>{item.painting.title}</strong>. {item.painting.width}x{item.painting.height}mm.
                                    </p>
                                    <div className="giclee-options">
                                        <div className="options-grid">
                                            {item.options.map((option: option, index: number) => (
                                                <div key={option.id ?? index} className="option-row">
                                                    <div className="cell">{option.optionAttributes.width}mm</div>
                                                    <div className="cell">x</div>
                                                    <div className="cell">{option.optionAttributes.height}mm</div>
                                                    <div className="cell">${option.optionAttributes.price}</div>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </li>

                    ))
                    }
                </ul>

            </div>

        </div>
    );

}

export default Prints;
