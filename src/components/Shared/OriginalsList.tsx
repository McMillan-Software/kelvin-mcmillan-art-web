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
              <img className="orginals-image" src={"./src/mocks/images/" + original.title + ".jpg"} alt={original.title} />
            </NavLink>
            <div><p>{original.title}</p></div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default OriginalsList;
