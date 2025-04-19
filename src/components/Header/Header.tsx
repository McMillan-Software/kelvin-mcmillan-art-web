import React, {useState} from "react";
import { NavLink } from 'react-router-dom';
import "./Header.css";

const Header: React.FC = () => {

  const [showMenu, setShowMenu] = useState(false);

    return (
      <div className="header-content">
        <h1 id="title">KELVIN MCMILLAN ART</h1>
        <p id="artist-info">Artist, Canterbury New Zealand</p>
        <div>
        <nav>
          <div className="menu" onClick={() => setShowMenu(!showMenu)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul className={showMenu ? "open" : "close"}>
            <li>
              <NavLink to="/" 
                  className={({ isActive }) => isActive ? 'active' : ''}>
                  Home
              </NavLink>
            </li>
            <li>
            <NavLink to="/Originals" 
                  className={({ isActive }) => isActive ? 'active' : ''}>
                  Originals
              </NavLink>
            </li>
            <li>
            <NavLink to="/Prints" 
                  className={({ isActive }) => isActive ? 'active' : ''}>
                  Prints
              </NavLink>
            </li>
            <li>
            <NavLink to="/Portfolio" 
                  className={({ isActive }) => isActive ? 'active' : ''}>
                  Portfolio
              </NavLink>
            </li>
            <li>
            <NavLink to="/About" 
                  className={({ isActive }) => isActive ? 'active' : ''}>
                  About
              </NavLink>
            </li>
            <li>
            <NavLink to="/Contact" 
                  className={({ isActive }) => isActive ? 'active' : ''}>
                  Contact
              </NavLink>
            </li>
          </ul>
        </nav>
        </div>
      </div>
    );
  }
  
  export default Header;