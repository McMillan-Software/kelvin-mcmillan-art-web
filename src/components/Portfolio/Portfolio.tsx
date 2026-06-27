import React, { useEffect, useState } from "react";
import { Original } from "../../types/original";
import { Page } from "../../types/page"; // Ensure you have this type
import './Portfolio.css';
import OriginalsList from "../Shared/OriginalsList";
import api from "../../api"; // Assuming you have an axios instance setup

const Originals: React.FC = () => {
    const [originals, setOriginals] = useState<Original[]>([]);
    const [availablePages, setAvailablePages] = useState<Page[]>([]);
    const [selectedPageId, setSelectedPageId] = useState<number | null>(null);

    useEffect(() => {
        api.get("/pages")
            .then((res) => {
                setAvailablePages(res.data);
                // Default to the first page if available
                if (res.data.length > 0) setSelectedPageId(res.data[0].id);
            })
            .catch((err) => console.error("Error fetching pages:", err));
    }, []);

    useEffect(() => {
        if (selectedPageId === null) return;

        api.get(`/paintings/portfolio/${selectedPageId}`)
            .then((response) => setOriginals(response.data))
            .catch((error) => console.error(`Error fetching paintings: ${error}`));
    }, [selectedPageId]);

    return (
        <div>
            <div className="category-selector">
                <label htmlFor="Category">Category</label>
                <select 
                    className="category-dropdown" 
                    onChange={(e) => setSelectedPageId(Number(e.target.value))}
                    value={selectedPageId ?? ""}
                >
                    {availablePages.map((page) => (
                        <option key={page.id} value={page.id}>
                            {page.name}
                        </option>
                    ))}
                </select>
            </div>
            <OriginalsList originals={originals} />
        </div>
    );
};

export default Originals;