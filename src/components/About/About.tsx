import React, { useState, useEffect } from "react";
import "./About.css";

const About: React.FC = () => {

  const [data, setData] = useState({ angusBirth: 0, samBirth: 0});

  useEffect(() => {
    
    const calculatedAngusBirth = calculateAge(new Date(1994, 11, 4))
    const calculatedSamBirth = calculateAge(new Date(1997, 11, 4))

    setData({angusBirth : calculatedAngusBirth, samBirth: calculatedSamBirth})
  }, []);

  function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

  return (
    <div>
      <div className="about-text-div">
        <h2>My Story</h2>
        <p>
          I was born and raised in South Westland on a dairy farm in Hari Hari. I
          moved to Canterbury in the late 60s.
        </p>
        <p>
          I was interested in art from a young age, becoming a full time artist by
          the age of 22. Initially concentrating on pencil drawings, mainly of
          architectural subjects, finding inspiration in derelict houses and farm
          buildings.
        </p>
        <p>
          I paint simple subjects that surround me living in the vast landscapes
          of Canterbury and Otago. My painting style depicts the romance of our
          rugged New Zealand landscape. I am captivated by contrasting light and
          dark creating highlights and long shadows on building facades, boats,
          rural railway sidings, beehives and mailboxes. I also love painting
          portraits in particular New Zealand’s rural characters.
        </p>
        <p>
          I exhibit widely throughout New Zealand, participating in both group &
          solo exhibitions.
        </p>
        <p>
          I married my wife Sally in 1992 and we have two boys: Angus ({data.angusBirth}) and Sam
          ({data.samBirth}).
        </p>
      </div>
      <br></br>
      <hr></hr>
      <br></br>
      <div className="about-photo-main-div">
        <div className="about-photo-div-row">
          <div className="about-photo-div">
            <img className="about-photo" src="/images/about1.jpg" alt="Angus and Sam"/>
            <p>Angus and Sam fishing in Collingwood 2005</p>
          </div>
          <div className="about-photo-div">
            <img className="about-photo" src="/images/about2.jpg" alt="St Andrews" />
            <p>St Andrews College</p>
          </div>
        </div>
        <div className="about-photo-div-row">
          <div className="about-photo-div">
            <img className="about-photo" src="/images/about3.jpg" alt="Angus" />
            <p>Angus</p>
          </div>
          <div className="about-photo-div">
            <img className="about-photo" src="/images/about4.jpg" alt="Sam" />
            <p>Sam</p>
          </div>
        </div>  
      </div>
    </div>
  );
};

export default About;