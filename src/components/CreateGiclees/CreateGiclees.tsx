import React, { useState  } from "react";
import axios from "axios";
import './CreatePainting.css';
import { useAuth }  from "../../AuthContext";
import { NavLink, Navigate } from 'react-router-dom';

const paintingTypes = ["Watercolour", "Acrylic"];
const pageOptions = ["Marine", "Rural", "Landscape"];

const CreatePainting: React.FC = () => {
    const { isAuthenticated, login} = useAuth();
    const[error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [width, setWidth] = useState<number | "">("");
    const [height, setHeight] = useState<number | "">("");
    const [sold, setSold] = useState(false);
    const [price, setPrice] = useState<number | "">("");
    const [info, setInfo] = useState("");
    const [aspectRatio, setAspectRatio] = useState("");
    const [galleryLink, setGalleryLink] = useState("");
    const [galleryName, setGalleryName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [pages, setPages] = useState<string[]>([]);

    const handlePaintingCreation = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/admin/painting`, 
                {
                  title,
                  type,
                  width: width || 0, 
                  height: height || 0, 
                  sold,
                  price: price || 0.0, 
                  info,
                  aspectRatio,
                  galleryLink,
                  galleryName,
                  pages,
                },
                {
                  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                }
              );
            alert("Painting created successfully");
            if (image) {
                const formData = new FormData();
                formData.append("file", image);
                await axios.post(
                    `${import.meta.env.VITE_API_URL}painting/${response.data.id}/image`,
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
                        <label>Width (cm):</label>
                        <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(e.target.value ? parseInt(e.target.value) : "")}
                            required
                        />
                    </div>
                    <div>
                        <label>Height (cm):</label>
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
                        <label>Price ($):</label>
                        <input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : "")}
                            required
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
            </div>
        </div>
    );
};

export default CreatePainting;
