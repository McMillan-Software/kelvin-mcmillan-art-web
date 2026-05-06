import React, { useState, useEffect } from "react";
import api from '../../api';
import './Admin.css';
import { Original } from "../../types/original";
import { PaintingSearchParams } from '../../types/paintingSearch';
import { useAuth } from "../../AuthContext";
import { NavLink } from 'react-router-dom';

const Admin: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [paintings, setPaintings] = useState<Original[]>([]);
  
  const [totalRecords, setTotalRecords] = useState<number>(0);
  
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
    page: 1, 
    limit: 10, 
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
      page: 1,
      limit: 10, 
    });
  };

  // Function to update state dynamically
  const updateSearchParam = (key: keyof PaintingSearchParams, value: any) => {
    setSearchParams((prev) => {
      const isPaginationKey = key === 'page' || key === 'limit';
      return {
        ...prev,
        [key]: value,
        // Reset to page 1 if any filter (other than page/limit) is changed
        ...(!isPaginationKey ? { page: 1 } : {})
      };
    });
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: checked,
      page: 1, // Reset to page 1 on filter change
    }));
  };

  const getFilteredParams = (params: PaintingSearchParams) => {
    return Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== "" && v !== 0)
    );
  };

  const fetchPaintings = async () => {
    const filteredParams = getFilteredParams(searchParams);
    try {
      const response = await api.get('/admin/paintings', {
        params: filteredParams
      });
      setPaintings(response.data.items);
      setTotalRecords(response.data.totalRecords);
    } catch (error) {
      console.error("Error fetching paintings:", error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPaintings();
    }, 500); 

    return () => clearTimeout(delayDebounce);
  }, [searchParams]);


  const handleNextPage = () => {
    if (searchParams.page! * searchParams.limit! < totalRecords) {
      updateSearchParam('page', searchParams.page! + 1);
    }
  };

  const handlePrevPage = () => {
    if (searchParams.page! > 1) {
      updateSearchParam('page', searchParams.page! - 1);
    }
  };

  const totalPages = Math.ceil(totalRecords / (searchParams.limit || 10));

  if (!isAuthenticated) {
    return <div>Please log in to access admin tools.</div>;
  } else {
    return (
      <div className='admin-div'>
        <h1>Admin Dashboard</h1>
        <div className='admin-action-panel'>
          <NavLink to="/GicleeAdmin" className='admin-action-button'>Giclee Admin</NavLink>
          <NavLink to="/CreatePainting" className='admin-action-button'>Create Painting</NavLink>
          <button onClick={logout} className='logout-btn admin-action-button'>Logout</button>
        </div>

        <div className="painting-search-div">
          <div className="paninting-search-div_title">
            <h2>Painting Search</h2>
          </div>
          <div className="painting-search-parameters">
            <div className="painting-search-parameter-column">
              <div className="painting-search-parameter-row_keyword">
                <input
                  type="text"
                  placeholder="Keywords"
                  value={searchParams.q}
                  onChange={(e) => updateSearchParam("q", e.target.value)}
                />
              </div>

              <div className="painting-search-parameter-row">
                <label className="parameter-label">Type</label>
                <select value={searchParams.type} onChange={(e) => updateSearchParam("type", e.target.value)}>
                  {paintingTypes.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="painting-search-parameter-row">
                <label>
                  <input type="checkbox" name="sold" checked={searchParams.sold || false} onChange={handleCheckboxChange} /> Sold
                </label>
                <label>
                  <input type="checkbox" name="framed" checked={searchParams.framed || false} onChange={handleCheckboxChange} /> Framed
                </label>
                <label>
                  <input type="checkbox" name="giclee" checked={searchParams.giclee || false} onChange={handleCheckboxChange} /> Giclee
                </label>
              </div>
            </div>

            <div className="painting-search-parameter-column">
              {/* Width */}
              <div className="painting-search-parameter-row">
                <label className="parameter-label">Width</label>
                <div className="painting-search-parameter-row_input">
                  <input className="search-parameter-number-input" type="number" placeholder="Min mm" value={searchParams.minWidth || ""} onChange={(e) => updateSearchParam("minWidth", Number(e.target.value))} />
                  <input className="search-parameter-number-input" type="number" placeholder="Max mm" value={searchParams.maxWidth || ""} onChange={(e) => updateSearchParam("maxWidth", Number(e.target.value))} />
                </div>
              </div>
              {/* Height */}
              <div className="painting-search-parameter-row">
                <label className="parameter-label">Height</label>
                <div className="painting-search-parameter-row_input">
                  <input className="search-parameter-number-input" type="number" placeholder="Min mm" value={searchParams.minHeight || ""} onChange={(e) => updateSearchParam("minHeight", Number(e.target.value))} />
                  <input className="search-parameter-number-input" type="number" placeholder="Max mm" value={searchParams.maxHeight || ""} onChange={(e) => updateSearchParam("maxHeight", Number(e.target.value))} />
                </div>
              </div>
              {/* Price */}
              <div className="painting-search-parameter-row">
                <label className="parameter-label">Price</label>
                <div className="painting-search-parameter-row_input">
                  <input className="search-parameter-number-input" type="number" placeholder="Min $" value={searchParams.minPrice || ""} onChange={(e) => updateSearchParam("minPrice", Number(e.target.value))} />
                  <input className="search-parameter-number-input" type="number" placeholder="Max $" value={searchParams.maxPrice || ""} onChange={(e) => updateSearchParam("maxPrice", Number(e.target.value))} />
                </div>
              </div>
            </div>
          </div>
          
          <button onClick={resetSearchParam}>Reset Filters</button>

          {/* Pagination Controls Row */}
          <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            
            <div className="limit-selector">
              <label>Items per page: </label>
              <select 
                value={searchParams.limit} 
                onChange={(e) => {
                  updateSearchParam("limit", Number(e.target.value));
                  updateSearchParam("page", 1); // Reset to page 1 on limit change
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="page-navigation">
              <button onClick={handlePrevPage} disabled={(searchParams.page || 1) <= 1}>
                &laquo; Previous
              </button>
              <span style={{ margin: '0 15px' }}>
                Page {searchParams.page} of {totalPages === 0 ? 1 : totalPages} ({totalRecords} total items)
              </span>
              <button onClick={handleNextPage} disabled={(searchParams.page || 1) >= totalPages}>
                Next &raquo;
              </button>
            </div>

          </div>
        </div>

        <ul className="admin-painting-list">
          {paintings.map((painting: Original) => (
            <li key={painting.id} className="admin-painting-card">
              <div className="admin-painting-container">
                
                {/* Image Section */}
                <div className="admin-image-section">
                  <img
                    className="admin-painting-image"
                    src={painting.imagePath
                      ? `${import.meta.env.VITE_IMAGE_BASE_PATH}${painting.imagePath}`
                      : "/images/placeholder.jpg"}
                    alt={painting.title}
                  />
                  <div className="admin-id-tag">ID: {painting.id}</div>
                </div>

                {/* Details Section */}
                <div className="admin-details-section">
                  <div className="admin-header-row">
                    <h2 className="admin-title-text">{painting.title}</h2>
                    <div className="admin-header-right">
                      <span className="admin-price-text">${painting.price.toLocaleString()}</span>
                      <NavLink to={`/EditPainting/${painting.id}`} className="admin-edit-button">
                        EDIT PAINTING
                      </NavLink>
                    </div>
                  </div>

                  <div className="admin-attributes-grid">
                    <div className="admin-attr-item"><strong>Type:</strong> <span>{painting.type}</span></div>
                    <div className="admin-attr-item"><strong>Location:</strong> <span>{painting.location || "N/A"}</span></div>
                    
                    <div className="admin-attr-item"><strong>Size:</strong> <span>{painting.width}mm x {painting.height}mm</span></div>
                    <div className="admin-attr-item"><strong>Gallery:</strong> <span>{painting.galleryName || "N/A"}</span></div>
                    
                    <div className="admin-attr-item"><strong>Ratio:</strong> <span>{painting.aspectRatio}</span></div>
                    <div className="admin-attr-item">
                      <div className="admin-badges">
                        {painting.giclee && <span className="badge giclee">GICLEE</span>}
                        {painting.sold ? 
                          <span className="badge sold">SOLD</span> : 
                          <span className="badge available">AVAILABLE</span>
                        }
                      </div>
                    </div>
                    
                    <div className="admin-attr-item"><strong>Created:</strong> <span>{painting.creationDate ? new Date(painting.creationDate).toLocaleDateString() : 'N/A'}</span></div>
                  </div>

                  <div className="admin-info-section">
                    <p><strong>Information:</strong> {painting.info}</p>
                    {painting.galleryLink && (
                      <p><strong>Link:</strong> <a href={painting.galleryLink} target="_blank" rel="noreferrer">View in Gallery</a></p>
                    )}
                  </div>
                </div>
                
              </div>
            </li>
          ))}
        </ul>

      </div>
    );
  }
};

export default Admin;