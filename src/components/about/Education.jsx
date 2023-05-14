import React from "react";

const educationContent = [
  {
    year: "Jul 2021",
    degree: "Certified Laravel Developer",
    institute: "Laravel LLC",
    details: `https://exam.laravelcert.com/is/myo-win-thein/certified-since/2021-07-13`,
  },
  {
    year: "Sep 2012 – Oct 2013",
    degree: "Level 5 Diploma in Computing (QCF)",
    institute: "NCC Education",
    details: `https://www.nccedu.com/qualifications/computing/ncc-education-level-5-diploma-in-computing-l5dc/`,
  },
  {
    year: "Dec 2007 – Aug 2011",
    degree: "Bachelor of Technology (Electrical Power Engineering)",
    institute: "Thanlyin Technological University",
    details: `http://www.ttu.edu.mm/admission/join/electrical-power-engineering`,
  },
];

const Education = () => {
  return (
    <ul>
      {educationContent.map((val, i) => (
        <li key={i}>
          <div className="icon">
            <i className="fa fa-graduation-cap"></i>
          </div>
          <span className="time open-sans-font text-uppercase">{val.year}</span>
          <h5 className="poppins-font text-uppercase">
            {val.degree}
            <span className="place open-sans-font">{val.institute}</span>
          </h5>
          <p className="open-sans-font">{val.details}</p>
        </li>
      ))}
    </ul>
  );
};

export default Education;
