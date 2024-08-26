import React from "react";

const educationContent = [
  {
    year: "Jul 2023 – Jul 2024",
    degree: "Computing (Information Systems), BSc Hons",
    institute: "University of Greenwich",
    details: `https://www.gre.ac.uk/undergraduate-courses/engsci/computing-information-systems-bsc-hons`,
  },
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
        <li key={i} className="exp-gutter">
          <div className="icon">
            <i className="fa fa-graduation-cap"></i>
          </div>
          {/* <span className="time open-sans-font text-uppercase">{val.year}</span> */}

          <small className="text-muted d-block text-uppercase">{val.year}</small>
          <h5 className="poppins-font text-uppercase">{val.institute} </h5>
          <span className="place open-sans-font">{val.degree} </span>
          {/* <p className="open-sans-font">{val.details}</p> */}
        </li>
      ))}
    </ul>
  );
};

export default Education;
