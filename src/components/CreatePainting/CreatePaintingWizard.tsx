import React, { useEffect, useState, useCallback } from "react";
import api from "../../api";
import { NavLink, useNavigate } from 'react-router-dom';
import { Page } from "../../types/page";
import { Painting } from "../../types/painting";
import GicleeManager from "../EditPainting/GicleeManager";

import './CreatePainting.css'; // Assuming you'll consolidate your CSS here

const paintingTypes = ["Watercolour", "Acrylic"];

const getNZDate = () => {
    return new Date().toLocaleDateString('en-CA', {
        timeZone: 'Pacific/Auckland'
    });
};

const CreatePaintingWizard: React.FC = () => {
    const navigate = useNavigate();
    
    // Wizard State
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [createdPainting, setCreatedPainting] = useState<Painting | null>(null);
    const [error, setError] = useState("");

    // Step 1 States (Details)
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [creationDate, setCreationDate] = useState(getNZDate());
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
    const [pageOptions, setPageOptions] = useState<Page[]>([]);

    // Step 2 States (Image Upload)
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

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

    // --- STEP 1 LOGIC ---
    const handlePageSelection = (selectedPage: number) => {
        setPages((prevPages) =>
            prevPages.includes(selectedPage)
                ? prevPages.filter((page) => page !== selectedPage)
                : [...prevPages, selectedPage]
        );
    };

    const handlePaintingCreation = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const response = await api.post('/admin/painting', {
                title, location, type, creationDate,
                width: width || 0, height: height || 0,
                sold, framed, price: price || 0.0,
                info, galleryLink, galleryName, pages,
            });
            // Save the returned painting data and move to step 2
            setCreatedPainting(response.data);
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.message || "Error creating painting");
        }
    };

    // --- STEP 2 LOGIC ---
    const handleImageSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        if (!image || !createdPainting) return;
        setIsUploading(true);
        setError("");

        const formData = new FormData();
        formData.append("file", image);

        try {
            await api.post(`/admin/painting/${createdPainting.id}/image`, formData);
            // Image uploaded successfully, move to step 3
            setStep(3);
        } catch (err) {
            console.error("Upload error:", err);
            setError("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    // --- STEP 3 LOGIC ---
    const handleAspectRatioLock = useCallback((ratio: string) => {
        if (!createdPainting) return;

        setCreatedPainting(prev => {
            if (!prev) return prev;
            const previousAspectRatio = prev.aspectRatio;
            const updatedPainting = { ...prev, aspectRatio: ratio };

            api.put(`/admin/painting/${prev.id}`, updatedPainting)
                .catch(error => {
                    console.error("Error saving aspect ratio:", error);
                    // Rollback
                    setCreatedPainting(p => p ? { ...p, aspectRatio: previousAspectRatio } : p);
                    const errorMessage = error.response?.data?.message || "Failed to save aspect ratio lock.";
                    alert(`Error: ${errorMessage}`);
                });

            return updatedPainting;
        });
    }, [createdPainting]);


    return (
        <div className="painting-creation-wizard">
            <NavLink to="/Admin" className="back-link">Back to Admin</NavLink>
            
            <div className="wizard-progress">
                <h3>Step {step} of 3: {step === 1 ? "Details" : step === 2 ? "Upload Image" : "Print Options"}</h3>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* STEP 1: Details */}
            {step === 1 && (
                <div className="painting-form-div">
                    <form className="painting-form" onSubmit={handlePaintingCreation}>
                        {/* Title */}
                        <div className="form-group">
                            <label>Title:</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        {/* Location */}
                        <div className="form-group">
                            <label>Location:</label>
                            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                        </div>
                        {/* Type */}
                        <div className="form-group">
                            <label>Type:</label>
                            <select value={type} onChange={(e) => setType(e.target.value)}>
                                {paintingTypes.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        {/* Date */}
                        <div className="form-group">
                            <label htmlFor="completion-date">Date of completion:</label>
                            <input id="completion-date" type="date" value={creationDate} onChange={(e) => setCreationDate(e.target.value)} />
                        </div>
                        {/* Dimensions */}
                        <div className="form-group">
                            <label>Width (mm):</label>
                            <input type="number" value={width} onChange={(e) => setWidth(e.target.value ? parseInt(e.target.value) : "")} required />
                        </div>
                        <div className="form-group">
                            <label>Height (mm):</label>
                            <input type="number" value={height} onChange={(e) => setHeight(e.target.value ? parseInt(e.target.value) : "")} required />
                        </div>
                        {/* Checkboxes */}
                        <div className="form-group">
                            <label>Sold:</label>
                            <input type="checkbox" checked={sold} onChange={(e) => setSold(e.target.checked)} />
                        </div>
                        <div className="form-group">
                            <label>Framed:</label>
                            <input type="checkbox" checked={framed} onChange={(e) => setFramed(e.target.checked)} />
                        </div>
                        {/* Price */}
                        <div className="form-group">
                            <label>Price ($):</label>
                            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value ? parseFloat(e.target.value) : "")} />
                        </div>
                        {/* Info & Links */}
                        <div className="form-group">
                            <label>Info:</label>
                            <textarea value={info} onChange={(e) => setInfo(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Gallery Link:</label>
                            <input type="text" value={galleryLink} onChange={(e) => setGalleryLink(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Gallery Name:</label>
                            <input type="text" value={galleryName} onChange={(e) => setGalleryName(e.target.value)} />
                        </div>
                        {/* Pages */}
                        <div className="form-group">
                            <label>Pages:</label>
                            {pageOptions.map((page) => (
                                <div key={page.id}>
                                    <input type="checkbox" value={page.name} checked={pages.includes(page.id)} onChange={() => handlePageSelection(page.id)} />
                                    <label htmlFor={page.name}>{page.name}</label>
                                </div>
                            ))}
                        </div>
                        
                        <button type="submit">Continue to Image Upload</button>
                    </form>
                </div>
            )}

            {/* STEP 2: Image Upload */}
            {step === 2 && createdPainting && (
                <div className="image-upload-step">
                    <h4>Upload Image for "{createdPainting.title}"</h4>
                    {previewUrl ? (
                         <img src={previewUrl} alt="Preview" style={{ width: "100%", maxWidth: "400px", height: "300px", objectFit: "contain", marginBottom: "1rem" }} />
                    ) : (
                        <div style={{ width: "100%", maxWidth: "400px", height: "300px", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                            <span>No image selected</span>
                        </div>
                    )}
                   
                    <input type="file" accept="image/jpeg, image/png" onChange={handleImageSelection} />
                    
                    <button 
                        onClick={handleUploadSubmit} 
                        disabled={!image || isUploading}
                        style={{ marginTop: "10px", display: "block" }}
                    >
                        {isUploading ? "Uploading..." : "Upload & Continue"}
                    </button>
                </div>
            )}

            {/* STEP 3: Giclee Manager */}
            {step === 3 && createdPainting && (
                <div className="giclee-step">
                    <h4>Add Print Options</h4>
                    <GicleeManager
                        paintingId={createdPainting.id}
                        width={createdPainting.width}
                        height={createdPainting.height}
                        aspectRatio={createdPainting.aspectRatio ?? undefined}  
                        onAspectRatioLock={handleAspectRatioLock}
                    />
                    <button onClick={() => navigate("/Admin")} style={{ marginTop: "2rem" }}>
                        Finish & Return to Admin
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreatePaintingWizard;