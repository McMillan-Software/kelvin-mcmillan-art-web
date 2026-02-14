import React, { useState, useEffect } from "react";
import api from "../../api";
import { validGicleeOptions } from "../../types/giclee";
import "./EditPainting.css";

interface GicleeManagerProps {
    paintingId: number;
    width: number;
    height: number;
}

const GicleeManager: React.FC<GicleeManagerProps> = ({ paintingId, width, height }) => {
    const [recommendedAspectRatio, setRecommendedAspectRatio] = useState<string>("");
    const [dropDownSelectedAspectRatio, setDropDownAspectRatio] = useState("");
    const [availableAspectRatios, setAvailableAspectRatios] = useState<string[]>([]);
    const [validGicleeOptions, setValidGicleeOptions] = useState<validGicleeOptions[]>([]);
    const [gicleeOptionsRefreshTrigger, setGicleeOptionsRefreshTrigger] = useState(0);


    useEffect(() => {
        const fetchAspectRatios = async () => {
            try {
                console.log("Fetching aspect ratios...");
                const response = await api.get(`/admin/aspectratios`);
                setAvailableAspectRatios(response.data);
            } catch (error) {
                console.error("Error fetching aspect ratios");
            }
        };

        fetchAspectRatios();
    }, []);


    // calculate actual aspect ratio of the painting to help guide aspect ratio selection
    useEffect(() => {
        const calculateAspectRatio = () => {
            if (width && height) {
                const ratio = width / height;
                setRecommendedAspectRatio(`${ratio}`);
            }
        }

        calculateAspectRatio();
    }, [width, height]);

    // Get available Giclee option for the selected aspect ratio.
    useEffect(() => {
        console.log('VALID OPTIONS: use effect valid giclee options called');

        // Don't fetch if no aspect ratio or paintingId is invalid
        if (!dropDownSelectedAspectRatio || !paintingId) return;

        const fetchOptions = async () => {
            try {
                console.log(`VALID OPTIONS: Fetching VALID options for aspect_ratio: ${dropDownSelectedAspectRatio}`);
                const encodedAspectRatio = encodeURIComponent(dropDownSelectedAspectRatio);
                const response = await api.get(`/admin/giclee/${paintingId}/valid-options?aspect_ratio=${encodedAspectRatio}`);
                console.log("Fetched valid giclee options:", response.data);
                setValidGicleeOptions(response.data.validOptions);
                console.log("valid giclee options has been set:", response.data.validOptions);
            } catch (error) {
                console.error("Error fetching valid giclee options:", error);
            }
        };

        fetchOptions();
    }, [dropDownSelectedAspectRatio, paintingId, gicleeOptionsRefreshTrigger]);

    const handleAddOption = async (paintingId: number, optionAttributesId: number) => {
        console.log("paintingId: ", paintingId);

        try {
            const response = await api.post('/admin/giclee',
                {
                    paintingId: paintingId,
                    pageOrder: 0,
                    goaIds: [optionAttributesId],
                    createAllForAspectRatio: false
                });

            console.log("Option added successfully:", response.data);
            setGicleeOptionsRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error adding Option: ", error);
        }
    };

    const handleDeleteGicleeOption = async (paintingId: number, optionAttributesId: number) => {
        try {
            console.log(`Deleting option - paitingId: ${paintingId}, optionAttributesId: ${optionAttributesId}`);
            const response = await api.delete(`/admin/giclee?painting_id=${paintingId}&option_attribute_id=${optionAttributesId}`);
            console.log("Delete Successful:", response.data);

            setGicleeOptionsRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error deleting Giclee Option", error);
        }
    };

    return (
        <div className="giclee-column">
            <h3>Giclees</h3>
            <div className="aspect-ratio-controls">
                <div className="control-group">
                    <label htmlFor="aspect-ratio" className="input-label">Select Aspect Ratio:</label>
                    <select
                        id='aspect-ratio'
                        value={dropDownSelectedAspectRatio}
                        onChange={(e) => setDropDownAspectRatio(e.target.value)}
                        className="aspect-ratio-select"
                    >
                        <option value="">-- Select --</option>
                        {availableAspectRatios.map((ratio, index) => (
                            <option key={index} value={ratio}>
                                {ratio}
                            </option>
                        ))}
                    </select>
                </div>

                {recommendedAspectRatio && (
                    <div className="recommended-badge" title="Calculated from original dimensions">
                        <span className="badge-label">Original Ratio:</span>
                        <span className="badge-value">{parseFloat(recommendedAspectRatio).toFixed(2)}</span>
                    </div>
                )}
            </div>

            <div className="options-box">
                {dropDownSelectedAspectRatio ? (
                    <h3>Options for {dropDownSelectedAspectRatio}</h3>
                ) : (
                    <div className="empty-state-message">
                        Please select an aspect ratio to view or add Giclee options.
                    </div>
                )}
                {validGicleeOptions.length === 0 ? (
                    <p>No options available.</p>
                ) : (
                    <ul className="options-grid option-dimensions">
                        {validGicleeOptions.map((option, index) => (
                            <li key={index} className="option-item">
                                <span className="option-cell">{option.attributes.width} x {option.attributes.height}mm</span>
                                <span className="option-cell">${option.attributes.price}</span>
                                {option.paintingHasOption ? (
                                    <button
                                        className="delete-option-button"
                                        onClick={() => handleDeleteGicleeOption(paintingId, option.attributes.id)}
                                        title="Remove Option">-</button>
                                ) : (
                                    <button
                                        className="add-option-button"
                                        onClick={() => handleAddOption(paintingId, option.attributes.id)}
                                        title="Add Option">+</button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default GicleeManager;
