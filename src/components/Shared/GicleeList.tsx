import React from 'react';
import { NavLink } from 'react-router-dom';
import { Giclee } from '../../types/giclee';
import './OriginalsList.css';
import './GicleeList.css';

interface GicleeListProps {
  giclees: Giclee[];
}

const lowestPrice = (giclee: Giclee): number | null => {
  if (giclee.options.length === 0) return null;
  return Math.min(...giclee.options.map((option) => option.optionAttributes.price));
};

const GicleeList: React.FC<GicleeListProps> = ({ giclees }) => {
  return (
    <ul className="orginals-list giclee-list">
      {giclees.map((giclee: Giclee) => {
        const fromPrice = lowestPrice(giclee);
        return (
          <li key={giclee.paintingId}>
            <div className="originals-list-item">
              <NavLink className="originals-image-link" to={`/Originals/${giclee.painting.id}`}>
                <img
                  className="orginals-image"
                  src={`${import.meta.env.VITE_IMAGE_BASE_PATH}${giclee.painting.imagePath}`}
                  loading="lazy"
                  alt={giclee.painting.title}
                />
              </NavLink>
              <div className="caption-container">
                <p className="caption-line title-location">
                  <strong>{giclee.painting.title}</strong>
                  {giclee.painting.location && `, ${giclee.painting.location}`}
                </p>
                {fromPrice !== null && (
                  <p className="caption-line giclee-from-price">
                    <NavLink to={`/Originals/${giclee.painting.id}`}>Giclee prints from ${fromPrice}</NavLink>
                  </p>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default GicleeList;
