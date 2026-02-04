import React, { useEffect, useState  } from "react";
import axios from "axios";
import api from "../../api";
import './CreatePainting.css';
import { NavLink , useNavigate } from 'react-router-dom';
import { page } from "../../types/page";

const paintingTypes = ["Watercolour", "Acrylic"];

const CreatePainting: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [type, setType] = useState("Watercolour");
    const [width, setWidth] = useState<number | "">("");
    const [height, setHeight] = useState<number | "">("");
    const [sold, setSold] = useState(false);
    const [framed, setFramed] = useState(false);
    const [price, setPrice] = useState<number | "">("");
    const [info, setInfo] = useState("");
    const [galleryLink, setGalleryLink] = useState("");
    const [galleryName, setGalleryName] = useState("");
    const [pages, setPages] = useState<number[]>([]); 
    const [pageOptions, setPageOptions] = useState<page[]>([]);
    
    useEffect(() => {
        
        const fetchPagesOptions = async () => {
            try {
                const response = await api.get('/admin/pages');
                setPageOptions(response.data);
            } catch (error) {
                console.error("Error fetching pages:", error);
            }
        }
        fetchPagesOptions();
    }, []);
   
    const handlePaintingCreation = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/admin/painting', 
                {
                  title,
                  location,
                  type,
                  width: width || 0,
                  height: height || 0, 
                  sold,
                  framed,
                  price: price || 0.0,
                  info,
                  galleryLink,
                  galleryName,
                  pages,
                });
            alert("Painting created successfully");
            return navigate("/editPainting/" + response.data.id);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error creating painting");
        }
    };


    const handlePageSelection = (selectedPage: number) => {
        setPages((prevPages) =>
            prevPages.includes(selectedPage)
                ? prevPages.filter((page) => page !== selectedPage)
                : [...prevPages, selectedPage]
        );
    };

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
                        <label>Location:</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        >
                        </input>
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
                        {pageOptions.map((page) => (
                            <div key={page.id}>
                                <input
                                    type="checkbox"
                                    value={page.name}
                                    checked={pages.includes(page.id)}
                                    onChange={() => handlePageSelection(page.id)}
                                />
                                <label htmlFor={page.name}>{page.name}</label>
                            </div>
                        ))}
                    </div>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button type="submit">Contiune</button>
                </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePainting;
