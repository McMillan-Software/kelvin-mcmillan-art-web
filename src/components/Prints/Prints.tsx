import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Giclee } from '../../types/giclee';
import { GicleeCollection } from '../../types/gicleeCollection';
import GicleeList from '../Shared/GicleeList';
import PageHeader from '../Shared/PageHeader';
import './Prints.css';

const Prints: React.FC = () => {
    const [giclees, setGiclees] = useState<Giclee[]>([]);
    const [collections, setCollections] = useState<GicleeCollection[]>([]);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const location = useLocation();

    useEffect(() => {
        Promise.allSettled([
            axios.get(`${import.meta.env.VITE_API_URL}paintings/giclees/v2`),
            axios.get(`${import.meta.env.VITE_API_URL}giclee-collections`)
        ]).then(([gicleesResult, collectionsResult]) => {
            if (gicleesResult.status === 'fulfilled') {
                setGiclees(gicleesResult.value.data);
            } else {
                console.error(`Error fetching giclees: ${gicleesResult.reason}`);
            }
            if (collectionsResult.status === 'fulfilled') {
                setCollections(collectionsResult.value.data);
            } else {
                console.error(`Error fetching giclee collections: ${collectionsResult.reason}`);
            }
            setIsLoaded(true);
        });
    }, []);

    // Scroll to a collection when linked to with /Prints#collection-{id}
    useEffect(() => {
        if (!isLoaded || !location.hash) return;
        document.getElementById(location.hash.slice(1))?.scrollIntoView();
    }, [isLoaded, location.hash]);

    const visibleCollections = collections.filter((collection) => collection.giclees.length > 0);
    const collectedIds = new Set(visibleCollections.flatMap((collection) => collection.giclees.map((giclee) => giclee.paintingId)));
    const otherGiclees = giclees.filter((giclee) => !collectedIds.has(giclee.paintingId));

    return (
        <div className='prints-page'>
            <PageHeader
                eyebrow="Fine art reproductions"
                title="Giclee Prints"
                intro="Prints of selected works, available in a range of sizes."
            />

            {visibleCollections.map((collection) => (
                <section key={collection.id} id={`collection-${collection.id}`} className="giclee-collection">
                    <h2 className="giclee-collection-title">{collection.title}</h2>
                    {collection.description && (
                        <p className="giclee-collection-description">{collection.description}</p>
                    )}
                    <GicleeList giclees={collection.giclees} />
                </section>
            ))}

            {otherGiclees.length > 0 && (
                <section className="giclee-collection">
                    {visibleCollections.length > 0 && (
                        <h2 className="giclee-collection-title">Other Prints</h2>
                    )}
                    <GicleeList giclees={otherGiclees} />
                </section>
            )}
        </div>
    );
}

export default Prints;
