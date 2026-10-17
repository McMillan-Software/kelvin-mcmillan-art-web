import React, { useEffect, useState } from "react";
import { Original } from "../../types/original";
import { Page } from "../../types/page"; // Ensure you have this type
import './Portfolio.css';
import OriginalsList from "../Shared/OriginalsList";
import PageHeader from "../Shared/PageHeader";
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
        <div className="portfolio-content">
            <PageHeader eyebrow="Selected works" title="Portfolio">
                {availablePages.length > 1 && (
                    <div className="category-filter" role="group" aria-label="Category">
                        {availablePages.map((page) => (
                            <button
                                key={page.id}
                                type="button"
                                className="category-pill"
                                aria-pressed={page.id === selectedPageId}
                                onClick={() => setSelectedPageId(page.id)}
                            >
                                {page.name}
                            </button>
                        ))}
                    </div>
                )}
            </PageHeader>
            <OriginalsList originals={originals} />
        </div>
    );
};

export default Originals;