import React from 'react';
import axios from "axios";
import './Contact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

const Contact: React.FC = () => {

  const [senderEmail, setSenderEmail] = React.useState<string>("");
  const [senderFirstName, setSenderFirstName] = React.useState<string>("");
  const [senderLastName, setSenderLastName] = React.useState<string>("");
  const [emailBody, setEmailBody] = React.useState<string>("");
  const [feedback, setFeedback] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailPayload = {
      name: senderFirstName + " " + senderLastName,
      email: senderEmail,
      message: emailBody,
    };

    console.log(emailPayload);

try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}painting/inquiry`,
        emailPayload
      );
      // Success Path
      setFeedback("Thank you for your inquiry. I will respond shortly.");
      setEmailBody("");
      setSenderFirstName("");
      setSenderLastName("");
      setSenderEmail("");
    } catch (error) {
      // 2. Error Path - VISIBLE feedback
      setIsError(true);
      setFeedback("Something went wrong sending your message. Please try again or email me directly.");
      console.error("Inquiry failed", error);
    } finally {
      setIsLoading(false); // 3. Stop loading regardless of success/fail
    }
  };
  

  return (
    <div className='contact-div'>
      <div className='contact-form-div'>
        <h3>For inquiries fill in the form below or send me an email.</h3>
        <p>If you like my work and have a particular subject in mind, let me know. I would be more then happy to turn your vision into reality.</p>
        <p>Cheers, Kelvin.</p>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              Name <span>(required)</span>
            </label>
            <div className="name-row">
              <input
                type="text"
                placeholder="First Name"
                value={senderFirstName}
                onChange={(e) => setSenderFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={senderLastName}
                onChange={(e) => setSenderLastName(e.target.value)}
                required
              />
            </div>

            <label>
              Email Address <span>(required)</span>
            </label>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              required
            />

            <label>
              Message <span>(required)</span>
            </label>
            <textarea
              rows={6}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              required
            />

            <button 
              className="submit-btn" 
              type="submit" 
              disabled={isLoading} 
              style={{ opacity: isLoading ? 0.7 : 1 }}
              >
              {isLoading ? "SENDING..." : "SUBMIT"}
            </button>
          </form>
          <p style={{ color: isError ? "red" : "darkgrey", marginTop: "1rem" }}>
          {feedback}
        </p>
      </div>
        <div className='social-information-div'>
          <h3>Email: Kelvinmcmillanart@xtra.co.nz</h3>
          <h3>Mobile: 027 676 5505</h3>
          <h2>Follow me on Social Media</h2>
          <p>For regular updates on what I currently working on</p>
          
          <div className="footer-icons">
              <a className="contact-social-icon" href="https://www.facebook.com/kelvinmcmillanart" target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faFacebookSquare} size="2x" />
              </a>
              <a className="contact-social-icon" href="https://www.instagram.com/kelvinmcmillanart/" target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faInstagram} size="2x" />
              </a>
          </div>
        </div>
    </div>
  );
};

export default Contact;