import React, { useState, useEffect } from "react";
import './Admin.css';
import { original } from "../../types/original";
import { PaintingSearchParams } from '../../types/paintingSearch';
import axios from "axios";
import { useAuth }  from "../../AuthContext";
import { NavLink } from 'react-router-dom';

const Admin: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [paintings, setPaintings] = useState<original[]>([]);
    const [searchParams, setSearchParams] = useState<PaintingSearchParams>({
      title: "",
      location: "",
      type: "",
      minWidth: undefined,
      maxWidth: undefined,
      minHeight: undefined,
      maxHeight: undefined,
      sold: undefined,
      framed: undefined,
      giclee: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      aspect_ratio: "",
      galleryName: "",
      page: 1, // Default first page
      limit: 10, // Default page size
    });

    const updateSearchParam = (key: keyof PaintingSearchParams, value: any) => {
      setSearchParams((prev) => ({
        ...prev,
        [key]: value,
      }));
    };
  
    const getFilteredParams = (params: PaintingSearchParams) => {
      return Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== "")
      );
    };
  
    const fetchPaintings = async () => {
      const filteredParams = getFilteredParams(searchParams);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}admin/paintings`, { params: filteredParams,  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        setPaintings(response.data);
      } catch (error) {
        console.error("Error fetching paintings:", error);
      }
    };
  
    useEffect(() => {
      const delayDebounce = setTimeout(() => {
        fetchPaintings();
      }, 500); // Debounce API calls
  
      return () => clearTimeout(delayDebounce);
    }, [searchParams]);


  if (!isAuthenticated) {
    return <div>Please log in to access admin tools.</div>;
  } else {
    return (
      <div className='admin-div'>
          <h3>Admin</h3>
          <div>
          <button>
            <NavLink to="/CreatePainting">
                Create Painting
            </NavLink>
          </button>
          </div>

          <div className="painting-search-div">
            <h4>Painting Search</h4>
            <div className="painting-search-parameters">
              <div className="painting-search-parameter-row">
                <input
                  type="text"
                  placeholder="Title"
                  value={searchParams.title}
                  onChange={(e) => updateSearchParam("title", e.target.value)}
                />
              </div>
              <div className="painting-search-parameter-row">
                <input
                    type="number"
                    placeholder="Min Width (mm)"
                    value={searchParams.minWidth || ""}
                    onChange={(e) => updateSearchParam("minWidth", Number(e.target.value))}
                  />
                <input
                  type="number"
                  placeholder="Max Width (mm)"
                  value={searchParams.minWidth || ""}
                  onChange={(e) => updateSearchParam("maxWidth", Number(e.target.value))}
                />
              </div>
              <div className="painting-search-parameter-row">
              <input
                    type="number"
                    placeholder="Min Height (mm)"
                    value={searchParams.minWidth || ""}
                    onChange={(e) => updateSearchParam("minHeight", Number(e.target.value))}
                  />
                <input
                  type="number"
                  placeholder="Max Height (mm)"
                  value={searchParams.minWidth || ""}
                  onChange={(e) => updateSearchParam("maxHeight", Number(e.target.value))}
                />
               
              </div>
            </div>
          </div>
          
          <ul className="admin-painting-list">
            {paintings.map((painting: original) => ( 
              <li key={painting.id}>
                <div className="admin-painting-list-item">
                  <img
                    className="admin-painting-image"
                    src={painting.image_path 
                      ? `${import.meta.env.VITE_IMAGE_BASE_PATH}${painting.image_path}` 
                      : "/images/placeholder.jpg"}
                    alt={painting.title}
                  />  
                  <p>{painting.title}</p>
                  <p>Height: {painting.height}mm</p>
                  <p>Width: {painting.width}mm </p>
                  <p>Price: ${painting.price} </p>
                  <div>
                  <button>
                    <NavLink to={`/EditPainting/${painting.id}`}>
                      Edit
                    </NavLink>
                  </button>
                  <button>
                    Delete
                  </button>
                </div>
                </div>
              </li>
            ))}
          </ul>
      </div>
    );
  };
};

export default Admin;