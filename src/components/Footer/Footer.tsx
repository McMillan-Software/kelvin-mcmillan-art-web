import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
      <img className="footer-image" src={"/images/footer3.jpg"} alt="footer image" />
        <div className="footer-main">
          <div className="footer-title-div">
            <h1 className="footer-title">Kelvin McMillan Art</h1>
          </div>
          <div className="footer-contact-div">
            <h2>Contact</h2>
            <p>Phone: +64 27 676 5505</p>
            <p>Email: kelvinmcmillanart@xtra.co.nz</p>
          </div>
          <div className="footer-icons">
            <a className="social-icon" href="https://www.facebook.com/kelvinmcmillanart" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faFacebookSquare} size="2x" />
            </a>
            <a className="social-icon" href="https://www.instagram.com/kelvinmcmillanart/" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
          </div>
        </div>
        <hr className="footer-whiteLine"></hr>
        <div className="footer-software-div">
          <p className="footer-software">McMillanSoftware © </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;