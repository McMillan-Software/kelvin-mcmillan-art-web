import React, { useState, useEffect, useCallback } from "react";
import { useParams, NavLink } from 'react-router-dom';
import { useAuth } from "../../AuthContext";
import { Painting } from "../../types/painting";
import { Page } from "../../types/page"; 
import api from "../../api";

import GicleeManager from "./GicleeManager";
import "./EditPainting.css";


const EditPainting: React.FC = () => {
    const { isAuthenticated } = useAuth();
    let { id } = useParams<{ id: string }>();
    
    const [editPainting, setEditPainting] = useState<Painting>({} as Painting);
    const [availablePages, setAvailablePages] = useState<Page[]>([]);
    const [error, setError] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);


    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [paintingResponse, pagesResponse] = await Promise.all([
                    api.get(`paintings/${id}`),
                    api.get("pages")
                ]);
                setEditPainting(paintingResponse.data);
                console.log(paintingResponse.data);
                console.log(pagesResponse.data);
                setAvailablePages(pagesResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load painting or category data.");
            }
        };
        fetchInitialData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        let finalValue: any = value;

        if (type === "checkbox") {
            finalValue = checked;
        } else if (type === "number") {
            finalValue = Number(value);
        } else if (type === "date") {
            finalValue = value === "" ? null : value;
        }

        setEditPainting((prev) => ({
            ...prev,
            [name]: finalValue,
        }));
    };

    const handleEditPainting = (e: React.FormEvent) => {
        e.preventDefault();
        api.put(`/admin/painting/${id}`, editPainting)
            .then((response) => {
                setEditPainting(response.data);
                alert("Painting details updated");
            })
            .catch((error: Error) => {
                console.error(`Error saving painting:`, error.message);
                setError(error.message);
            });
    }


    const handleCategoryToggle = async (pageId: number, isCurrentlyAssigned: boolean) => {
        try {
            if (isCurrentlyAssigned) {
                await api.delete(`/admin/painting/${id}/pages/${pageId}`);
                setEditPainting((prev) => ({
                    ...prev,
                    pages: prev.pages ? prev.pages.filter(pId => pId !== pageId) : []
                }));
            } else {
                await api.post(`/admin/painting/${id}/pages/${pageId}`);
                setEditPainting((prev) => ({
                    ...prev,
                    pages: [...(prev.pages || []), pageId]
                }));
            }
        } catch (err) {
            alert("Failed to update category.");
        }
    };


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
            await api.post(`/admin/painting/${editPainting.id}/image`, formData);
            alert("Image uploaded successfully");
        } catch (err) {
            console.error("Upload error:", err);
            setError("Upload failed. Please try again.");
        }
    };

    const handleAspectRatioLock = useCallback((ratio: string) => {
        setEditPainting(currentPainting => {
            const previousAspectRatio = currentPainting.aspectRatio;
            const updatedPainting = { ...currentPainting, aspectRatio: ratio };

            api.put(`/admin/painting/${id}`, updatedPainting)
                .then(response => {
                    setError("");
                })
                .catch(error => {
                    console.error("Error saving aspect ratio:", error);
                    setEditPainting(prev => ({ ...prev, aspectRatio: previousAspectRatio }));
                    const data = error.response?.data;
                    const errorMessage = data?.detail || data?.message || data?.error || "Failed to save aspect ratio lock.";
                    alert(`Error: ${errorMessage}`);
                });

            return updatedPainting;
        });
    }, [id]);

    if (!isAuthenticated) {
        return <div>User must login</div>;
    }

    return (
        <div className="edit-painting-header">
            <NavLink to="/Admin" className="back-link">Back to Admin</NavLink>
            <h2>Edit Painting</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="edit-painting-rows">
                
                {/* ROW 1: General Details */}
                <div className="edit-section-row details-row">
                    <h3>Painting Details</h3>
                    <form className="painting-form" onSubmit={handleEditPainting}>
                        <div className="form-group">
                            <label>Title:</label>
                            <input type="text" name="title" value={editPainting.title || ""} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Location:</label>
                            <input type="text" name="location" value={editPainting.location || ""} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Type:</label>
                            <input type="text" name="type" value={editPainting.type || ""} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Creation Date:</label>
                            <input type="date" name="creationDate" value={editPainting.creationDate || ""} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Width:</label>
                            <input type="number" name="width" value={editPainting.width || 0} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Height:</label>
                            <input type="number" name="height" value={editPainting.height || 0} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Sold:</label>
                            <input type="checkbox" name="sold" checked={!!editPainting.sold} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Artist Collection:</label>
                            <input type="checkbox" name="artistCollection" checked={!!editPainting.artistCollection} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Framed:</label>
                            <input type="checkbox" name="framed" checked={!!editPainting.framed} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Price:</label>
                            <input type="number" name="price" value={editPainting.price || 0} onChange={handleChange} step="0.01" />
                        </div>
                        <div className="form-group">
                            <label>Information:</label>
                            <input type="text" name="info" value={editPainting.info || ""} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Gallery Name:</label>
                            <input type="text" name="galleryName" value={editPainting.galleryName || ""} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Gallery Link:</label>
                            <input type="text" name="galleryLink" value={editPainting.galleryLink || ""} onChange={handleChange} />
                        </div>
                        <button type="submit">Save Painting Details</button>
                    </form>
                </div>

                {/* ROW 2: Category Manager */}
                <div className="edit-section-row details-row">
                    <h3>Update Categories</h3>
                    {availablePages.map((page) => {
                        // Now comparing numbers
                        const isAssigned = editPainting.pages?.includes(page.id) || false;
                        return (
                            <label key={page.id}>
                                <input
                                    type="checkbox"
                                    checked={isAssigned}
                                    onChange={() => handleCategoryToggle(page.id, isAssigned)}
                                />
                                {page.name}
                            </label>
                        );
                    })}
                </div>

                {/* ROW 3: Image Management */}
                <div className="edit-section-row image-row">
                    <h3>Painting Image</h3>
                    <img
                        src={
                            previewUrl
                                ? previewUrl
                                : editPainting.imagePath
                                    ? `${import.meta.env.VITE_IMAGE_BASE_PATH}${editPainting.imagePath}`
                                    : "/images/placeholder.jpg"
                        }
                        alt={editPainting.title}
                        style={{ width: "100%", maxHeight: "300px", objectFit: "contain", marginBottom: "15px" }}
                    />
                    <div>
                        <input type="file" accept="image/jpeg, image/png" onChange={handleImageUpload} />
                        {previewUrl && (
                            <button onClick={handleUploadSubmit} style={{ marginLeft: "10px" }}>
                                Upload Image
                            </button>
                        )}
                    </div>
                </div>

                {/* ROW 4: Giclee Manager */}
                {editPainting.id && (
                    <div className="edit-section-row giclee-row">
                        <GicleeManager
                            paintingId={editPainting.id}
                            width={editPainting.width}
                            height={editPainting.height}
                            aspectRatio={editPainting.aspectRatio ?? undefined}
                            onAspectRatioLock={handleAspectRatioLock}
                        />
                    </div>
                )}

            </div>
        </div>
    );
};

export default EditPainting;