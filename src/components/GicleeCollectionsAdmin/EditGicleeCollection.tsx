import React, { useState, useEffect } from "react";
import { NavLink, useParams } from 'react-router-dom';
import api from "../../api";
import { useAuth } from "../../AuthContext";
import { GicleeCollection } from "../../types/gicleeCollection";
import { Original } from "../../types/original";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import "../GicleeAdmin/GicleeAdmin.css";
import "./GicleeCollectionsAdmin.css";

const SEARCH_LIMIT = 12;

const imageSrc = (imagePath?: string) =>
    imagePath ? `${import.meta.env.VITE_IMAGE_BASE_PATH}${imagePath}` : "/images/placeholder.jpg";

const EditGicleeCollection: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { isAuthenticated } = useAuth();

    const [collection, setCollection] = useState<GicleeCollection | null>(null);
    const [details, setDetails] = useState({ title: "", description: "", orderNumber: 0 });
    const [error, setError] = useState<string | null>(null);
    const [savedMessage, setSavedMessage] = useState<string | null>(null);

    // Search state, only paintings with giclee prints
    const [query, setQuery] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [results, setResults] = useState<Original[]>([]);
    const [totalRecords, setTotalRecords] = useState<number>(0);

    const fetchCollection = async () => {
        try {
            const response = await api.get<GicleeCollection>(`/admin/giclee-collections/${id}`);
            setCollection(response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching giclee collection:", error);
            setError(error.message);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchCollection().then((data) => {
            if (data) {
                setDetails({ title: data.title, description: data.description ?? "", orderNumber: data.orderNumber });
            }
        });
    }, [id, isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) return;
        const delayDebounce = setTimeout(async () => {
            try {
                const params: Record<string, string | number | boolean> = { giclee: true, page, limit: SEARCH_LIMIT };
                if (query) params.q = query;
                const response = await api.get('/admin/paintings', { params });
                setResults(response.data.items);
                setTotalRecords(response.data.totalRecords);
            } catch (error) {
                console.error("Error searching paintings:", error);
            }
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [query, page, isAuthenticated]);

    const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSavedMessage(null);
        setDetails(prev => ({ ...prev, [name]: name === 'orderNumber' ? Number(value) : value }));
    };

    const handleSaveDetails = async () => {
        if (!details.title.trim()) {
            setError("Title is required");
            return;
        }
        try {
            const response = await api.put<GicleeCollection>(`/admin/giclee-collections/${id}`, details);
            setCollection(response.data);
            setError(null);
            setSavedMessage("Collection details saved");
        } catch (error: any) {
            console.error("Error updating giclee collection:", error);
            setError(error.message);
        }
    };

    const handleAddPrint = async (paintingId: number) => {
        try {
            await api.post(`/admin/giclee-collections/${id}/giclees/${paintingId}`);
            await fetchCollection();
            setError(null);
        } catch (error: any) {
            console.error("Error adding print to collection:", error);
            setError(error.message);
        }
    };

    const handleRemovePrint = async (paintingId: number) => {
        try {
            await api.delete(`/admin/giclee-collections/${id}/giclees/${paintingId}`);
            await fetchCollection();
            setError(null);
        } catch (error: any) {
            console.error("Error removing print from collection:", error);
            setError(error.message);
        }
    };

    if (!isAuthenticated) {
        return <div>Please log in to access admin tools.</div>;
    }

    const collectedIds = new Set(collection?.giclees.map((giclee) => giclee.paintingId) ?? []);
    const totalPages = Math.max(1, Math.ceil(totalRecords / SEARCH_LIMIT));

    return (
        <div className="giclee-admin-container">
            <header className="admin-header">
                <NavLink to="/GicleeCollectionsAdmin" className="back-link">Back to Collections</NavLink>
                <h2>Edit Collection{collection ? `: ${collection.title}` : ""}</h2>
            </header>

            {error && <p className="collection-admin-error">{error}</p>}

            <section className="add-form-section">
                <h3>Details</h3>
                <div className="collection-admin-form">
                    <label>
                        Title
                        <input className="large-input" type="text" name="title" value={details.title} onChange={handleDetailsChange} />
                    </label>
                    <label>
                        Description
                        <textarea className="large-input" name="description" rows={6} value={details.description} onChange={handleDetailsChange} />
                    </label>
                    <label>
                        Order Number
                        <input className="large-input collection-admin-order-input" type="number" name="orderNumber" value={details.orderNumber} onChange={handleDetailsChange} />
                    </label>
                    <div>
                        <button className="btn-large btn-save" onClick={handleSaveDetails}>
                            <FontAwesomeIcon icon={faSave} /> Save Details
                        </button>
                        {savedMessage && <span className="collection-admin-added"> {savedMessage}</span>}
                    </div>
                </div>
            </section>

            <section className="collection-admin-section">
                <h3>Prints in this collection ({collection?.giclees.length ?? 0})</h3>
                {collection && collection.giclees.length === 0 && <p>No prints yet. Search below to add some.</p>}
                <ul className="collection-admin-print-list">
                    {collection?.giclees.map((giclee) => (
                        <li key={giclee.paintingId} className="collection-admin-print">
                            <img src={imageSrc(giclee.painting.imagePath)} alt={giclee.painting.title} loading="lazy" />
                            <span className="collection-admin-print-title">{giclee.painting.title}</span>
                            <span className="collection-admin-print-meta">
                                ID: {giclee.paintingId}
                                {giclee.options.length === 0 && " · No print sizes set, hidden on site"}
                            </span>
                            <button className="btn-large btn-cancel" onClick={() => handleRemovePrint(giclee.paintingId)}>
                                <FontAwesomeIcon icon={faTrash} /> Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="collection-admin-section">
                <h3>Add prints</h3>
                <div className="collection-admin-search-row">
                    <input
                        className="large-input"
                        type="text"
                        placeholder="Search paintings with giclee prints"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                    />
                </div>

                <ul className="collection-admin-print-list">
                    {results.map((painting) => (
                        <li key={painting.id} className="collection-admin-print">
                            <img src={imageSrc(painting.imagePath)} alt={painting.title} loading="lazy" />
                            <span className="collection-admin-print-title">{painting.title}</span>
                            <span className="collection-admin-print-meta">ID: {painting.id}{painting.location ? ` · ${painting.location}` : ""}</span>
                            {collectedIds.has(painting.id) ? (
                                <span className="collection-admin-added">Added ✓</span>
                            ) : (
                                <button className="btn-large btn-add" onClick={() => handleAddPrint(painting.id)}>
                                    <FontAwesomeIcon icon={faPlus} /> Add
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
                {results.length === 0 && <p>No paintings with giclee prints match your search.</p>}

                <div className="collection-admin-pagination">
                    <button onClick={() => setPage(page - 1)} disabled={page <= 1}>&laquo; Previous</button>
                    <span>Page {page} of {totalPages} ({totalRecords} total)</span>
                    <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>Next &raquo;</button>
                </div>
            </section>
        </div>
    );
};

export default EditGicleeCollection;
