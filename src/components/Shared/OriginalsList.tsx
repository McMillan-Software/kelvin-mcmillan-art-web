import React from "react";
import { Original } from "../../types/original";
import { NavLink } from "react-router-dom";
import "./OriginalsList.css";

interface OriginalsListProps {
  originals: Original[];
}

const OriginalsList: React.FC<OriginalsListProps> = ({ originals }) => {
  return (
    <ul className="orginals-list">
      {originals.map((original: Original) => (
        <li key={original.id}>
          <div className="originals-list-item">
            <NavLink className="originals-image-link" to={`/Originals/${original.id}`}>
              <img className="orginals-image" src={`${import.meta.env.VITE_IMAGE_BASE_PATH}${original.imagePath}`} />
            </NavLink>
            <div className="caption-container">
              {/* Line 1: Title & Location */}
              <p className="caption-line title-location">
                <strong>{original.title}</strong>
                {original.location && `, ${original.location}`}
              </p>

              {/* Line 2: Type, Dimensions, and Price */}
              <p className="caption-line details">
                {original.type}

                <span className="separator">·</span>

                <span className="no-break">
                  {`${original.width} × ${original.height}mm`}
                </span>

                {!original.sold && original.price && (
                  <>
                    <span className="separator">·</span>
                    {`$${original.price}`}
                  </>
                )}
              </p>

              {/* Line 3: Availability */}
              <div className="caption-line availability">
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
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default OriginalsList;
