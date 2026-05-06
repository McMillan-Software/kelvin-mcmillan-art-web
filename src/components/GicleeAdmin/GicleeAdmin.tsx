import React, { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import api from "../../api";
import { GicleeOptionAttributes } from "../../types/giclee";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import "./GicleeAdmin.css";

interface OmitIdGicleeOption extends Omit<GicleeOptionAttributes, 'id'> {}

const GicleeAttributesManager: React.FC = () => {
    const [attributes, setAttributes] = useState<GicleeOptionAttributes[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    // Edit State
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<GicleeOptionAttributes>>({});

    // Add New State
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [newAttribute, setNewAttribute] = useState<OmitIdGicleeOption>({
        width: 0,
        height: 0,
        aspectRatio: "",
        price: 0
    });

    useEffect(() => {
        fetchAttributes();
    }, []);

    const fetchAttributes = async () => {
        try {
            setIsLoading(true);
            // The backend now handles sorting by Aspect Ratio then Price
            const response = await api.get<GicleeOptionAttributes[]>(`/admin/giclee/dimensions`);
            setAttributes(response.data);
        } catch (error) {
            console.error("Error fetching giclee attributes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Add Handlers ---
    const handleNewAttributeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewAttribute(prev => ({
            ...prev,
            [name]: name === 'aspectRatio' ? value : Number(value)
        }));
    };

    const handleAddSubmit = async () => {
        try {
            const payload = [{
                width: newAttribute.width,
                height: newAttribute.height,
                aspect_ratio: newAttribute.aspectRatio,
                price: newAttribute.price
            }];
            
            await api.post(`/admin/giclee/dimensions`, payload);
            await fetchAttributes(); // Refresh to get the new sorted list
            setIsAdding(false);
            setNewAttribute({ width: 0, height: 0, aspectRatio: "", price: 0 });
        } catch (error) {
            console.error("Error adding new attribute:", error);
        }
    };

    // --- Edit Handlers ---
    const handleEditClick = (attribute: GicleeOptionAttributes) => {
        setEditingId(attribute.id);
        setEditFormData({
            width: attribute.width,
            height: attribute.height,
            price: attribute.price,
        });
    };

    const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: Number(value) }));
    };

    const handleSaveEdit = async (id: number) => {
        try {
            const payload = {
                width: Number(editFormData.width),
                height: Number(editFormData.height),
                price: Math.round(Number(editFormData.price))
            };
            await api.put(`/admin/giclee/${id}`, payload);
            await fetchAttributes(); 
            setEditingId(null);
        } catch (error) {
            console.error("Error updating attribute:", error);
        }
    };

    return (
        <div className="giclee-admin-container">
            <header className="admin-header">
                <NavLink to="/Admin" className="back-link">Back to Admin</NavLink>
                <h2>Giclee Pricing & Dimensions</h2>
                <button 
                    className={`btn-large ${isAdding ? 'btn-cancel' : 'btn-add'}`}
                    onClick={() => setIsAdding(!isAdding)}
                >
                    <FontAwesomeIcon icon={isAdding ? faTimes : faPlus} /> 
                    {isAdding ? "Close Form" : "Create New Option"}
                </button>
            </header>

            {isAdding && (
                <section className="add-form-section">
                    <h3>Add New Dimensions</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Aspect Ratio</label>
                            <input className="large-input" type="text" name="aspectRatio" placeholder="e.g. 1.5" value={newAttribute.aspectRatio} onChange={handleNewAttributeChange} />
                        </div>
                        <div className="form-group">
                            <label>Width (mm)</label>
                            <input className="large-input" type="number" name="width" value={newAttribute.width || ''} onChange={handleNewAttributeChange} />
                        </div>
                        <div className="form-group">
                            <label>Height (mm)</label>
                            <input className="large-input" type="number" name="height" value={newAttribute.height || ''} onChange={handleNewAttributeChange} />
                        </div>
                        <div className="form-group">
                            <label>Price ($)</label>
                            <input className="large-input" type="number" name="price" value={newAttribute.price || ''} onChange={handleNewAttributeChange} />
                        </div>
                        <button className="btn-large btn-save" onClick={handleAddSubmit}>Save New Option</button>
                    </div>
                </section>
            )}

            <main className="table-container">
                {isLoading ? (
                    <div className="loading-state">Loading pricing data...</div>
                ) : (
                    <table className="giclee-table">
                        <thead>
                            <tr>
                                <th>Aspect Ratio</th>
                                <th>Width (mm)</th>
                                <th>Height (mm)</th>
                                <th>Price ($)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attributes.map((attr) => (
                                <tr key={attr.id} className={editingId === attr.id ? "row-editing" : ""}>
                                    <td><span className="aspect-badge">{attr.aspectRatio}</span></td>
                                    
                                    {editingId === attr.id ? (
                                        <>
                                            <td><input className="large-input" type="number" name="width" value={editFormData.width} onChange={handleEditFormChange} /></td>
                                            <td><input className="large-input" type="number" name="height" value={editFormData.height} onChange={handleEditFormChange} /></td>
                                            <td><input className="large-input" type="number" name="price" value={editFormData.price} onChange={handleEditFormChange} /></td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button onClick={() => handleSaveEdit(attr.id)} className="btn-large btn-save"><FontAwesomeIcon icon={faSave} /> Save</button>
                                                    <button onClick={() => setEditingId(null)} className="btn-large btn-cancel">Cancel</button>
                                                </div>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="text-large">{attr.width}</td>
                                            <td className="text-large">{attr.height}</td>
                                            <td className="text-large price-text">${attr.price.toFixed(2)}</td>
                                            <td>
                                                <button onClick={() => handleEditClick(attr)} className="btn-large btn-edit">
                                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
};

export default React.memo(GicleeAttributesManager);