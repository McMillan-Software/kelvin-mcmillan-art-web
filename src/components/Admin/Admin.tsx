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
    const paintingTypes = ["", "Watercolour", "Acrylic"];
    const [searchParams, setSearchParams] = useState<PaintingSearchParams>({
      q: "",
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
      page: 1, // Default first page
      limit: 1000, // Default page size
    });

    const resetSearchParam = () => {
      setSearchParams({
        q: "",
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
        page: 1, // Reset to first page
        limit: 1000, // Reset page size
      });
    };

    // Function to update state dynamically
    const updateSearchParam = (key: keyof PaintingSearchParams, value: any) => {
      setSearchParams((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

    // Function to update boolean fields dyanmically
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = event.target;
      setSearchParams((prev) => ({
        ...prev,
        [name]: checked, // Dynamically update the field
      }));
    };
  
    // Function to remove undefined/empty values before sending request
    const getFilteredParams = (params: PaintingSearchParams) => {
      return Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== "" && v !== 0) 
      );
    };
  
      // Function to fetch paintings (debounced)
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
  
    // Automatically fetch when search params change (debounced)
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
                  placeholder=""
                  value={searchParams.q}
                  onChange={(e) => updateSearchParam("q", e.target.value)}
                />
                  <select value={searchParams.type} onChange={(e) => updateSearchParam("type", e.target.value)}>
                            {paintingTypes.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                  </select>
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
                  value={searchParams.maxWidth || ""}
                  onChange={(e) => updateSearchParam("maxWidth", Number(e.target.value))}
                />
              </div>
              <div className="painting-search-parameter-row">
                <input
                  type="number"
                  placeholder="Min Height (mm)"
                  value={searchParams.minHeight || ""}
                  onChange={(e) => updateSearchParam("minHeight", Number(e.target.value))}
                />
                <input
                  type="number"
                  placeholder="Max Height (mm)"
                  value={searchParams.maxHeight || ""}
                  onChange={(e) => updateSearchParam("maxHeight", Number(e.target.value))}
                />
              </div>
              <div className="painting-search-parameter-row">
                <input
                      type="number"
                      placeholder="Min price"
                      value={searchParams.minPrice || ""}
                      onChange={(e) => updateSearchParam("minPrice", Number(e.target.value))}
                    />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={searchParams.maxPrice || ""}
                    onChange={(e) => updateSearchParam("maxPrice", Number(e.target.value))}
                  />
              </div>
              <div className="painting-search-parameter-row">
                <label>
                <input
                  type="checkbox"
                  name="sold"
                  checked={searchParams.sold}
                  onChange={handleCheckboxChange}
                />
                Sold
              </label>

              <label>
                <input
                  type="checkbox"
                  name="framed"
                  checked={searchParams.framed}
                  onChange={handleCheckboxChange}
                />
                Framed
              </label>

              <label>
                <input
                  type="checkbox"
                  name="giclee"
                  checked={searchParams.giclee}
                  onChange={handleCheckboxChange}
                />
                Giclee
              </label>
              </div>
            </div>
            <button onClick={resetSearchParam}>Reset</button>
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
                  <p>Information: {painting.info}</p>
                  <p>Height: {painting.height}mm</p>
                  <p>Width: {painting.width}mm </p>
                  <p>Price: ${painting.price} </p>
                  <div>
                  <button>
                    <NavLink to={`/EditPainting/${painting.id}`}>
                      Edit
                    </NavLink>
                  </button>
                  <button>y
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