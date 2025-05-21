import React, { useState, useContext, useEffect  } from "react";
import { useParams,  } from 'react-router-dom';
import { useAuth }  from "../../AuthContext";
import { original} from "../../types/original";
import axios from "axios";

const EditPainting: React.FC = () => {
    const { isAuthenticated} = useAuth();
    let { id } = useParams<{ id: string }>();
    const [original, setOrginal] = React.useState<original>({} as original);
    const [error, setError] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);


    useEffect(() => {
      axios.get(`${import.meta.env.VITE_API_URL}paintings/${id}`).then((response) => {
        setOrginal(response.data);
      })
      .catch((error) => {
        console.error(`Error fetching data: ${error}`);
      });
    }, []);

    const handleFieldChange = (key: keyof original, value: string | number | boolean) => {
        setOrginal((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleEditPaintingDetails = () => {

    } ;


    //IMAGE UPLOAD 
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
                `${import.meta.env.VITE_API_URL}admin/painting/${original.id}/image`,
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
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="painting-details">
                <h2>Edit Painting Details</h2>
                                <h2>Painting Details</h2>    
                <form className="painting-form" onSubmit={handleEditPaintingDetails}>

                    <div>
                        <label>Title:</label>
                        <input
                            type="text"
                            value={original.title}
                            onChange={(e) => handleFieldChange("title", e.target.value)}
                            placeholder= {original.title}
                            
                        />
                    </div>
                    {/* <div>
                        <label>Type:</label>
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            {paintingTypes.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div> */}
                    {/* <div>
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
                        ))} */}
                    {/* </div> */}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit">Save Painting Details</button>
                </form>
            </div>


            <div className="painting-image">
                <div className="painting-creation-image-div">
                    <h2>Painting Image</h2>
                    <img
                        src={
                            previewUrl
                                ? previewUrl
                                : original.image_path
                                    ? `${import.meta.env.VITE_IMAGE_BASE_PATH}${original.image_path}`
                                    : "/images/placeholder.jpg"
                        }
                        alt={original.title}
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
            </div>


            <div className="painting-giclee"> 

            </div>
        </div>
        );
      }
};

export default EditPainting;