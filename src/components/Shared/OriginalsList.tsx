import React from "react";
import { original } from "../../types/original";
import { NavLink } from "react-router-dom";
import "./OriginalsList.css";

interface OriginalsListProps {
  originals: original[];
}

const OriginalsList: React.FC<OriginalsListProps> = ({ originals }) => {
  return (
    <ul className="orginals-list">
      {originals.map((original: original) => (
        <li key={original.id}>
          <div className="originals-list-item">
            <NavLink className="originals-image-link" to={`/Originals/${original.id}`}>
              <img className="orginals-image" src={`${import.meta.env.VITE_IMAGE_BASE_PATH}${original.imagePath}`} />
            </NavLink>
            <div className="caption-container">
              <p className="caption-text">
                <strong>{original.title}</strong>
                
                {original.location && `, ${original.location}`}
                
                {` · ${original.type} · ${original.width} × ${original.height}mm `}
                
                {!original.sold && (
                  original.galleryLink ? (
                    <a 
                      href={original.galleryLink.startsWith('http') ? original.galleryLink : `https://${original.galleryLink}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="available-link"
                    >
                      Available 
                    </a>
                  ) : (
                    <span className="available-text">Available</span>
                  )
                )}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default OriginalsList;
