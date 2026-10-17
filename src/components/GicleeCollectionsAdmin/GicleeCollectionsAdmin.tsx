import React, { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import api from "../../api";
import { useAuth } from "../../AuthContext";
import { GicleeCollection } from "../../types/gicleeCollection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import "../GicleeAdmin/GicleeAdmin.css";
import "./GicleeCollectionsAdmin.css";

interface NewCollection {
    title: string,
    description: string,
    orderNumber: number
}

const emptyCollection: NewCollection = { title: "", description: "", orderNumber: 0 };

const GicleeCollectionsAdmin: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [collections, setCollections] = useState<GicleeCollection[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [newCollection, setNewCollection] = useState<NewCollection>(emptyCollection);

    useEffect(() => {
        if (isAuthenticated) fetchCollections();
    }, [isAuthenticated]);

    const fetchCollections = async () => {
        try {
            setIsLoading(true);
            const response = await api.get<GicleeCollection[]>(`/admin/giclee-collections`);
            setCollections(response.data);
        } catch (error: any) {
            console.error("Error fetching giclee collections:", error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewCollectionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewCollection(prev => ({
            ...prev,
            [name]: name === 'orderNumber' ? Number(value) : value
        }));
    };

    const handleAddSubmit = async () => {
        if (!newCollection.title.trim()) {
            setError("Title is required");
            return;
        }
        try {
            await api.post(`/admin/giclee-collections`, newCollection);
            await fetchCollections();
            setIsAdding(false);
            setNewCollection(emptyCollection);
            setError(null);
        } catch (error: any) {
            console.error("Error creating giclee collection:", error);
            setError(error.message);
        }
    };

    const handleDelete = async (collection: GicleeCollection) => {
        if (!window.confirm(`Delete the collection "${collection.title}"? The prints themselves will not be deleted.`)) return;
        try {
            await api.delete(`/admin/giclee-collections/${collection.id}`);
            await fetchCollections();
        } catch (error: any) {
            console.error("Error deleting giclee collection:", error);
            setError(error.message);
        }
    };

    if (!isAuthenticated) {
        return <div>Please log in to access admin tools.</div>;
    }

    return (
        <div className="giclee-admin-container">
            <header className="admin-header">
                <NavLink to="/Admin" className="back-link">Back to Admin</NavLink>
                <h2>Giclee Collections</h2>
                <button
                    className={`btn-large ${isAdding ? 'btn-cancel' : 'btn-add'}`}
                    onClick={() => setIsAdding(!isAdding)}
                >
                    <FontAwesomeIcon icon={isAdding ? faTimes : faPlus} />
                    {isAdding ? "Close Form" : "Create New Collection"}
                </button>
            </header>

            {error && <p className="collection-admin-error">{error}</p>}

            {isAdding && (
                <section className="add-form-section">
                    <h3>Add New Collection</h3>
                    <div className="collection-admin-form">
                        <label>
                            Title
                            <input className="large-input" type="text" name="title" placeholder="e.g. Remembering Christchurch" value={newCollection.title} onChange={handleNewCollectionChange} />
                        </label>
                        <label>
                            Description
                            <textarea className="large-input" name="description" rows={5} value={newCollection.description} onChange={handleNewCollectionChange} />
                        </label>
                        <label>
                            Order Number
                            <input className="large-input collection-admin-order-input" type="number" name="orderNumber" value={newCollection.orderNumber} onChange={handleNewCollectionChange} />
                        </label>
                        <div>
                            <button className="btn-large btn-save" onClick={handleAddSubmit}>Save New Collection</button>
                        </div>
                    </div>
                </section>
            )}

            <main className="table-container">
                {isLoading ? (
                    <div className="loading-state">Loading collections...</div>
                ) : collections.length === 0 ? (
                    <p>No collections yet. Create one to group giclee prints together on the Prints page.</p>
                ) : (
                    <table className="giclee-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Title</th>
                                <th>Prints</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {collections.map((collection) => (
                                <tr key={collection.id}>
                                    <td className="text-large">{collection.orderNumber}</td>
                                    <td className="text-large">{collection.title}</td>
                                    <td className="text-large">{collection.giclees.length}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <NavLink to={`/EditGicleeCollection/${collection.id}`} className="btn-large btn-edit">
                                                <FontAwesomeIcon icon={faEdit} /> Edit
                                            </NavLink>
                                            <button onClick={() => handleDelete(collection)} className="btn-large btn-cancel">
                                                <FontAwesomeIcon icon={faTrash} /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
};

export default GicleeCollectionsAdmin;
