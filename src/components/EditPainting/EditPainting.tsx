import React, { useState , useEffect  } from "react";
import { useParams ,NavLink , useNavigate  } from 'react-router-dom';
import { useAuth }  from "../../AuthContext";
import { editPainting } from "../../types/editPainting";

import { giclee, option_attributes, valid_giclee_options } from "../../types/giclee";

import "./EditPainting.css";

import axios from "axios";

const EditPainting: React.FC = () => {
    const { isAuthenticated} = useAuth();
    let { id } = useParams<{ id: string }>();
    const [editPainting, setEditPaitning] = React.useState<editPainting>({} as editPainting);
    const [error, setError] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // create giclees
    const [dropDownSelectedAspectRatio, setDropDownAspectRatio] = useState(""); // selected aspect ratio - set by user interacting with the drop down
    const [availableAspectRatios, setAvailableAspectRatios] = useState([]); // aspect ratios for dropdown
    const [filteredOptions, setFilteredOptions] = useState<option_attributes[]>([]); // TODO: remove (old giclee options)
    const [validGicleeOptions, setValidGicleeOptions] = useState<valid_giclee_options[]>([]) // new giclee options, contains what options have been added
    const [gicleeOptionsRefreshTrigger, setGicleeOptionsRefreshTrigger] = useState(0);


    useEffect(() => {
        const getPaintingToEdit = async () => {
                axios.get(`${import.meta.env.VITE_API_URL}paintings/${id}`).then((response) => {
                setEditPaitning(response.data);
            })
            .catch((error) => {
                console.error(`Error fetching data: ${error}`);
            });
        }

        const fetchAspectRatios = async () => {
            try {
                console.log("Fetching aspect ratios...");
                const token = localStorage.getItem("token"); // surely there is a better way to holdthe token then getting it each time...?
                const response = await axios.get(`${import.meta.env.VITE_API_URL}admin/aspectratios`, {
                    headers: {
                        Authorization: `Bearer ${token}` // ✅ Include the token
                    }
                });
                console.log("Response:", response.data);
                setAvailableAspectRatios( response.data)

            } catch (error) {
                console.error("Error fetcghing aspect ratios");
            }
        };
        getPaintingToEdit();
        fetchAspectRatios();
        
    }, []);

        // Get available Giclee option for the selected aspect ratio. 
    useEffect(() => {
        if (!dropDownSelectedAspectRatio) return; // Don't fetch if no aspect ratio is selected
    
        const fetchOptions = async () => {
            try {
                console.log(`Fetching options for aspect ratio: ${dropDownSelectedAspectRatio}`);
                const encodedAspectRatio = encodeURIComponent(dropDownSelectedAspectRatio);
                const token = localStorage.getItem("token"); // Get stored token
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}admin/giclee/dimensions?aspect_ratio=${encodedAspectRatio}`, 
                    {headers: { Authorization: `Bearer ${token}` }}
                );
    
                console.log("Fetched Options:", response.data);
                setFilteredOptions(response.data);
            } catch (error) {
                console.error("Error fetching options:", error);
            }
        };
    
        fetchOptions();
    }, [dropDownSelectedAspectRatio]);  // ✅ Runs whenever aspectRatio changes
    

    const handleAddOption = async (paintingId: number, optionAttributesId: number) => {

        console.log("paintingId: ", paintingId)

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
            `${import.meta.env.VITE_API_URL}admin/giclee`, 
            {
                painting_id: paintingId,
                page_order: 0, 
                goa_ids: [optionAttributesId],
                create_all_for_aspect_ratio: false
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

            console.log("Option added successfully:", response.data);

            } catch (error) {
                console.error("Error adding Option: ", error)
        }

    };

        // Note, could have be done without defining the function and calling it
    useEffect(() => {

        console.log('VALID OPTIONS:  use effect valid giclee options called')
        if (!dropDownSelectedAspectRatio || editPainting == null) return; // Don't fetch if no aspect ratio 
    
        // defines t
        const fetchOptions2 = async () => {
            try {
                console.log(`VALID OPTIONS: Fetching VALID options for aspect_ratio: ${dropDownSelectedAspectRatio}`);
                const encodedAspectRatio = encodeURIComponent(dropDownSelectedAspectRatio);
                const token = localStorage.getItem("token"); // Get stored token
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}admin/giclee/${editPainting.id}/valid-options?aspect_ratio=${encodedAspectRatio}`, 
                    {headers: { Authorization: `Bearer ${token}` }}
                );
    
                console.log("Fetched valid giclee options:", response.data);
                setValidGicleeOptions(response.data.valid_options);
                console.log("valid giclee options has been set:", validGicleeOptions);
            } catch (error) {
                console.error("Error fetching valid giclee options:", error);
            }
        };
    
        fetchOptions2(); // calls the function 
    }, [dropDownSelectedAspectRatio, editPainting, gicleeOptionsRefreshTrigger]);  //  Runs whenever aspectRatio  or created painting (only once on painting create) changes

    const handleDeleteGicleeOption = async(paintingId: number, optionAttributesId: number) => {

    try {
        console.log(`Deleting option - paitingId: ${paintingId}, optionAttributesId: ${optionAttributesId}`);
        const token = localStorage.getItem("token")
        const response = await axios.delete(
            `${import.meta.env.VITE_API_URL}admin/giclee?painting_id=${paintingId}&option_attribute_id=${optionAttributesId}`, 
            {headers: { Authorization: `Bearer ${token}` }}
        );
    
        console.log("Delete Successful:", response.data); // TODO: remove. Curious what is actually returned and what format

        // Trigger a refresh: 
        setGicleeOptionsRefreshTrigger(prev => prev+1);

    } catch (error) {
        console.error("Error deleting Giclee Option", error);
        }
    } 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        const finalValue =
            type === "checkbox" ? checked :
            type === "number" ? Number(value) :
            value;

        setEditPaitning((prev) => ({
            ...prev,
            [name]: finalValue,
        }));
    };

    const handleEditPainting = (e: React.FormEvent) => {
        e.preventDefault();
        axios.put(
            `${import.meta.env.VITE_API_URL}admin/painting/${id}`,
            editPainting   
            ,
            {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
        ).then((response) => {
            setEditPaitning(response.data);
            alert("Painting details updated");
        })
        .catch((error) => {
            console.error(`Error fetching data: ${error}`);
            setError(error)
        });
        }

    //Images
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg")) {
            setImage(file);
            setError("");

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setError("Please upload a valid image file (jpg or png)");
            setPreviewUrl(null);
            setImage(null);
        }
    };

    const handleUploadSubmit = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append("file", image);

        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}admin/painting/${editPainting.id}/image`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            alert("Image uploaded successfully");
        } catch (err) {
            console.error("Upload error:", err);
            setError("Upload failed. Please try again.");
        }
    };



    if (!isAuthenticated) {
        return <div>User must login</div>;
      } else {
        return (
        <div className="painting-edit-main-div">
            <NavLink to="/Admin" className="back-link">Back to Admin</NavLink>
            <div className="painting-edit-title-div">
                <h2>Edit Painting</h2>
            </div>

            <div className="painting-edit-sub-div">
                {error && <p style={{ color: "red" }}>{error}</p>}

                <div className="painting-details-div">

                    <h3>Painting Details</h3>    
                    <form className="painting-form" onSubmit={handleEditPainting}>

                        <div>
                            <label>Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={editPainting.title}
                                onChange={handleChange}
                                placeholder= {editPainting.title}
                                
                            />
                        </div>

                        <div>
                            <label>Location:</label>
                            <input
                                type="text"
                                name="location"
                                value={editPainting.location ?? ""}
                                onChange={handleChange}
                                placeholder="Location"
                            />
                        </div>

                        <div>
                            <label>Type:</label>
                            <input
                                type="text"
                                name="type"
                                value={editPainting.type}
                                onChange={handleChange}
                                placeholder="Type"
                            />
                        </div>

                        <div>
                            <label>Width:</label>
                            <input
                                type="number"
                                name="width"
                                value={editPainting.width}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>Height:</label>
                            <input
                                type="number"
                                name="height"
                                value={editPainting.height}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>Sold:</label>
                            <input
                                type="checkbox"
                                name="sold"
                                checked={!!editPainting.sold}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>Framed:</label>
                            <input
                                type="checkbox"
                                name="framed"
                                checked={!!editPainting.framed}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label>Price:</label>
                            <input
                                type="number"
                                name="price"
                                value={editPainting.price}
                                onChange={handleChange}
                                step="0.01"
                            />
                        </div>

                        <div>
                            <label>Information:</label>
                            <input
                                type="text"
                                name="info"
                                value={editPainting.info}
                                onChange={handleChange}
                                placeholder="Info"
                            />
                        </div>

                        <div>
                            <label>Gallery Name:</label>
                            <input
                                type="text"
                                name="galleryName"
                                value={editPainting.galleryName ?? ""}
                                onChange={handleChange}
                                placeholder="Gallery Name"
                            />
                        </div>

                        <div>
                            <label>Gallery Link:</label>
                            <input
                                type="text"
                                name="galleryLink"
                                value={editPainting.galleryLink ?? ""}
                                onChange={handleChange}
                                placeholder="Gallery Link"
                            />
                        </div>

                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <button type="submit">Save Painting Details</button>
                    </form>
                </div>


                <div className="painting-image-div">
                        <h3>Painting Image</h3>
                        <img
                            src={
                                previewUrl
                                    ? previewUrl
                                    : editPainting.image_path
                                        ? `${import.meta.env.VITE_IMAGE_BASE_PATH}${editPainting.image_path}`
                                        : "/images/placeholder.jpg"
                            }
                            alt={editPainting.title}
                            style={{
                                width: "100%",
                                height: "300px",
                                objectFit: "contain",
                            }}
                        />
                        <input type="file" accept="image/jpeg, image/png" onChange={handleImageUpload} />
                            {previewUrl && (
                            <button onClick={handleUploadSubmit} style={{ marginTop: "10px" }}>
                                Upload Image
                            </button>
                        )}
                </div>

                <div className="painting-giclee-div"> 
                    
                    <h3>Giclee Create</h3>
                    <div className="set-aspect-ratio"></div>
                    <p>Set Aspect Ratio</p>
                    <label htmlFor="aspect-ratio"> Aspect Ratio:</label>
                    <select 
                        id='aspect-ratio'
                        value={dropDownSelectedAspectRatio}
                        onChange={(e) => setDropDownAspectRatio(e.target.value)}
                    >
                        <option value="">Select an Aspect Ratio</option>
                        {availableAspectRatios.map((ratio, index) => (
                            <option key={index} value={ratio}>
                                {ratio}
                            </option>
                        ))}
                    </select>
                <div className="options-box">
                        <h3>Options for Aspect Ratio: {dropDownSelectedAspectRatio || "None selected"}</h3>
                        {filteredOptions.length === 0 ? (
                        <p>No options available.</p>
                        ) : (
                        <ul className="options-grid option-dimensions">
                            {validGicleeOptions.map((option, index) => (
                            <li key={index} className="option-item">
                                <span className="option-cell">{option.attributes.width} x {option.attributes.height}mm</span>
                                <span className="option-cell">${option.attributes.price}</span>
                                {option.painting_has_option ? (
                                    <button
                                        className="delete-option-button"
                                        onClick={() => handleDeleteGicleeOption(editPainting.id, option.attributes.id)}
                                        title="Remove Option">-</button>
                                ) : (
                                    <button
                                        className="add-option-button"
                                        onClick={() => handleAddOption(editPainting.id, option.attributes.id)}
                                        title="Add Option">+</button>
                                )}
                            </li>
                            ))}
                        </ul>
                        )}
                    </div>

                </div>
            </div>

        </div>
        );
      }
};

export default EditPainting;