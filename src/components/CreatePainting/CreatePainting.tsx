import React, { useEffect, useState  } from "react";
import axios from "axios";
import './CreatePainting.css';
import { useAuth }  from "../../AuthContext";
import { NavLink, Navigate } from 'react-router-dom';
import { giclee, option_attributes, valid_giclee_options } from "../../types/giclee";

const paintingTypes = ["Watercolour", "Acrylic"];
const pageOptions = ["Marine", "Rural", "Landscape"];

const CreatePainting: React.FC = () => {
    const { isAuthenticated} = useAuth(); // why { } here 
    const[error, setError] = useState("");
    
    // create painting
    const [title, setTitle] = useState("");
    const [type, setType] = useState("Watercolour");
    const [width, setWidth] = useState<number | "">("");
    const [height, setHeight] = useState<number | "">("");
    const [sold, setSold] = useState(false);
    const [framed, setFramed] = useState(false);
    const [price, setPrice] = useState<number | "">("");
    const [info, setInfo] = useState("");
    const [galleryLink, setGalleryLink] = useState("");
    const [galleryName, setGalleryName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [pages, setPages] = useState<string[]>([]); 
    const [createdPainting, setCreatedPainting] = useState<any>(null)
    
    // create giclees
    const [dropDownSelectedAspectRatio, setDropDownAspectRatio] = useState(""); // selected aspect ratio - set by user interacting with the drop down
    const [availableAspectRatios, setAvailableAspectRatios] = useState([]); // aspect ratios for dropdown
    const [filteredOptions, setFilteredOptions] = useState<option_attributes[]>([]); // TODO: remove (old giclee options)
    const [validGicleeOptions, setValidGicleeOptions] = useState<valid_giclee_options[]>([]) // new giclee options, contains what options have been added
    const [gicleeOptionsRefreshTrigger, setGicleeOptionsRefreshTrigger] = useState(0);

    const handlePaintingCreation = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}admin/painting`, 
                {
                  title,
                  type,
                  width: width || 0,
                  height: height || 0, 
                  sold,
                  framed,
                  price: price || 0.0,
                  info,
                  aspectRatio: dropDownSelectedAspectRatio,
                  galleryLink,
                  galleryName,
                  pages,
                },
                {
                  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
              );

            setCreatedPainting(response.data)
            alert("Painting created successfully");

            if (image) {
                const formData = new FormData();
                formData.append("file", image);
                await axios.post(
                    `${import.meta.env.VITE_API_URL}admin/painting/${response.data.id}/image`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                alert("Image uploaded successfully");
            }
            return <Navigate to="/admin" />;
        } catch (err: any) {
            setError(err.response?.data?.message || "Error creating painting");
        }
    };


    const handlePageSelection = (selectedPage: string) => {
        setPages((prevPages) =>
            prevPages.includes(selectedPage)
                ? prevPages.filter((page) => page !== selectedPage)
                : [...prevPages, selectedPage]
        );
    };


    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg")) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setError("Please upload a valid image file (jpg or png)");
        }
    };

    if (!isAuthenticated) {
        return <div>User must log in</div>;
    }



    useEffect (() => {

        console.log("Aspect Ratio drop down updated");

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

        fetchAspectRatios();

    }, [] ); // only runs once at mount.


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


    // Note, could have be done without defining the function and calling it
    useEffect(() => {

        console.log('VALID OPTIONS:  use effect valid giclee options called')
        if (!dropDownSelectedAspectRatio || createdPainting == null) return; // Don't fetch if no aspect ratio 
    
        // defines t
        const fetchOptions2 = async () => {
            try {
                console.log(`VALID OPTIONS: Fetching VALID options for aspect_ratio: ${dropDownSelectedAspectRatio}`);
                const encodedAspectRatio = encodeURIComponent(dropDownSelectedAspectRatio);
                const token = localStorage.getItem("token"); // Get stored token
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}admin/giclee/${createdPainting.id}/valid-options?aspect_ratio=${encodedAspectRatio}`, 
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
    }, [dropDownSelectedAspectRatio, createdPainting, gicleeOptionsRefreshTrigger]);  //  Runs whenever aspectRatio  or created painting (only once on painting create) changes


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

        // Trigger a refresh: 
        setGicleeOptionsRefreshTrigger(prev => prev+1);

        } catch (error) {
            console.error("Error adding Option: ", error)
    }
}; 
    

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

    return (
        <div className="painting-creation-div">
            <NavLink to="/Admin" className="back-link">Back to Admin</NavLink>
            <h2>Create Painting</h2>
            <div className="painting-creation-input-div">
                <div className="painting-form-div">
                <h2>Painting Details</h2>    
                <form className="painting-form" onSubmit={handlePaintingCreation}>
                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Type:</label>
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            {paintingTypes.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Width (mm):</label>
                        <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(e.target.value ? parseInt(e.target.value) : "")}
                            required
                        />
                    </div>
                    <div>
                        <label>Height (mm):</label>
                        <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value ? parseInt(e.target.value) : "")}
                            required
                        />
                    </div>
                    <div>
                        <label>Sold:</label>
                        <input
                            type="checkbox"
                            checked={sold}
                            onChange={(e) => setSold(e.target.checked)}
                        />
                    </div>
                    <div>
                        <label>Framed:</label>
                        <input
                            type="checkbox"
                            checked={framed}
                            onChange={(e) => setFramed(e.target.checked)}
                        />
                    </div>
                    <div>
                        <label>Price ($):</label>
                        <input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : "")}
                        />
                    </div>
                    <div>
                        <label>Info:</label>
                        <textarea
                            value={info}
                            onChange={(e) => setInfo(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Gallery Link:</label>
                        <input
                            type="text"
                            value={galleryLink}
                            onChange={(e) => setGalleryLink(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Gallery Name:</label>
                        <input
                            type="text"
                            value={galleryName}
                            onChange={(e) => setGalleryName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Pages:</label>
                        {pageOptions.map((option) => (
                            <div key={option}>
                                <input
                                    type="checkbox"
                                    id={option}
                                    value={option}
                                    checked={pages.includes(option)}
                                    onChange={() => handlePageSelection(option)}
                                />
                                <label htmlFor={option}>{option}</label>
                            </div>
                        ))}
                    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit">Create Painting</button>
                </form>
                </div>
                <div className="painting-creation-image-div">
                    <h2>Painting Image</h2>
                    <img src={imagePreview || "/images/placeholder.jpg"} alt="Placeholder"   
                    style={{    width: "100%",
                                height: "300px",
                                objectFit: "contain",
                            }}/>
                    <input type="file" accept="image/jpeg, image/png" onChange={handleImageUpload} />
                </div>
                
                {createdPainting && (
                    <div className="created-painting-info">
                        <h3>Painting Created</h3>
                        <p><strong>Id:</strong> {createdPainting.id}</p>
                        <p><strong>Title:</strong> {createdPainting.title}</p>
                        <p><strong>Type:</strong> {createdPainting.type}</p>
                        <p><strong>Size:</strong> {createdPainting.width} cm x {createdPainting.height} cm</p>
                        <p><strong>Price:</strong> ${createdPainting.price}</p>
                        <p><strong>Sold:</strong> {createdPainting.sold}</p>
                        <p><strong>framed:</strong> {createdPainting.framed}</p>
                        <p><strong>Giclee:</strong> {createdPainting.giclee}</p>
                        <p><strong>Image Path:</strong> {createdPainting.image_path}</p>
                        <p><strong>Info:</strong> {createdPainting.info}</p>
                        <p><strong>Gallery Link:</strong> {createdPainting.galleryName}</p>
                        <p><strong>Gallery Name:</strong> {createdPainting.galleryLink}</p>
                    </div>
                )}   
            </div>
            <div className="giclee-create">
                <h2>Giclee Create</h2>
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
                                    onClick={() => handleDeleteGicleeOption(createdPainting.id, option.attributes.id)}
                                    title="Remove Option">-</button>
                            ) : (
                                <button
                                    className="add-option-button"
                                    onClick={() => handleAddOption(createdPainting.id, option.attributes.id)}
                                    title="Add Option">+</button>
                            )}
                        </li>
                        ))}
                    </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatePainting;
