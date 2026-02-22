import React, { useState, useEffect } from "react";
import api from "../../api";
import { ValidGicleeOptions } from "../../types/giclee";
import "./GicleeManager.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";

interface GicleeManagerProps {
    paintingId: number;
    width: number;
    height: number;
    aspectRatio?: string;
    onAspectRatioLock: (ratio: string) => void;
}

const GicleeManager: React.FC<GicleeManagerProps> = ({ paintingId, width, height, aspectRatio, onAspectRatioLock }) => {
    const [recommendedAspectRatio, setRecommendedAspectRatio] = useState<string>("");
    const [dropDownSelectedAspectRatio, setDropDownAspectRatio] = useState(aspectRatio || "");
    const [availableAspectRatios, setAvailableAspectRatios] = useState<string[]>([]);
    const [validGicleeOptions, setValidGicleeOptions] = useState<ValidGicleeOptions[]>([]);
    const [gicleeOptionsRefreshTrigger, setGicleeOptionsRefreshTrigger] = useState(0);


    useEffect(() => {
        const fetchAspectRatios = async () => {
            try {
                console.log("Fetching aspect ratios...");
                const response = await api.get(`admin/aspectratios`);
                setAvailableAspectRatios(response.data);
            } catch (error) {
                console.error("Error fetching aspect ratios");
            }
        };

        fetchAspectRatios();
    }, []);



    // Sync dropdown with currently selected painting's aspect ratio if it has been set
    useEffect(() => {
        if (aspectRatio) {
            console.log("dropdown aspect ratio changing from:", dropDownSelectedAspectRatio, "to:", aspectRatio);
            setDropDownAspectRatio(aspectRatio);
        }
    }, [aspectRatio]);


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
                const response = await api.get(`admin/giclee/${paintingId}/valid-options?aspect_ratio=${encodedAspectRatio}`);
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
        console.log("Adding giclee option for paintingId: ", paintingId);

        try {
            const response = await api.post('admin/giclee',
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
            const response = await api.delete(`admin/giclee?painting_id=${paintingId}&option_attribute_id=${optionAttributesId}`);
            console.log("Delete Successful:", response.data);

            setGicleeOptionsRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error deleting Giclee Option", error);
        }
    };



    const toggleAspectRatioLock = () => {
        if (aspectRatio) {
            // Aspect ratio has a valid value and is locked, unlock aspect ratio - set to "", api cannot update to null currently
            onAspectRatioLock("");
        } else {
            // Aspect ratio is not locked, lock to current dropdown value
            if (dropDownSelectedAspectRatio) {
                onAspectRatioLock(dropDownSelectedAspectRatio);
            } else {
                // should not happen... 
                console.warn("Attempted to lock with empty string!");
            }
        }
    };




    return (
        <div className="giclee-column">
            <h3>Giclees</h3>
            <div className="aspect-ratio-controls">
                <div className="control-group">
                    <label htmlFor="aspect-ratio" className="input-label">Select Aspect Ratio:</label>
                    <div className="aspect-ratio-input-row">
                        <select
                            id='aspect-ratio'
                            value={dropDownSelectedAspectRatio}
                            onChange={(e) => setDropDownAspectRatio(e.target.value)}
                            className="aspect-ratio-select"
                            disabled={!!aspectRatio} // TODO understand this
                        >
                            <option value="">-- Select --</option>
                            {availableAspectRatios.map((ratio, index) => (
                                <option key={index} value={ratio}>
                                    {ratio}
                                </option>
                            ))}
                        </select>

                        <button
                            className={`lock-button ${aspectRatio ? 'locked' : ''}`} // conditional styling 
                            onClick={toggleAspectRatioLock}
                            disabled={!dropDownSelectedAspectRatio && !aspectRatio}
                            title={aspectRatio ? "Unlock Aspect Ratio" : "Lock Aspect Ratio"}
                        >
                            {aspectRatio ? <FontAwesomeIcon icon={faLock} /> : <FontAwesomeIcon icon={faLockOpen} />}
                        </button>
                    </div>
                </div>

                {recommendedAspectRatio && (
                    <div className="recommended-badge">
                        <span className="badge-label">Exact Ratio:</span>
                        <span className="badge-value">{parseFloat(recommendedAspectRatio).toFixed(2)}</span>
                        <span className="badge-subtext">Calculated from original dimensions</span>
                    </div>
                )}
            </div>

            <div className="options-box">
                {dropDownSelectedAspectRatio ? (
                    <>
                        <h3>Options for {dropDownSelectedAspectRatio}</h3>
                        {/* Display a warning when aspect ratio is not set */}
                        {!aspectRatio && (
                            <div className="warning-message" style={{ color: '#888', fontStyle: 'italic', marginBottom: '10px', fontSize: '0.9em' }}>
                                Lock the aspect ratio first to enable adding options.
                            </div>
                        )}
                    </>
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
                                        disabled={!aspectRatio}
                                        title={aspectRatio ? "Add Option" : "Lock aspect ratio first to add options"}
                                    >+</button>
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
