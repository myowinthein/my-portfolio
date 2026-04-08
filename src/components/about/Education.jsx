import React from "react";

const educationContent = [
  {
    year: "Jul 2023 – Jul 2024",
    degree: "Bachelor of Science (Honours) in Computing",
    institute: "University of Greenwich (UK)",
    details: "Graduated with First Class Honours",
    link: ``,
  },
  {
    year: "Jul 2021",
    degree: "Certified Laravel Developer",
    institute: "Laravel LLC",
    details: "",
    link: `https://verifier.certificationforlaravel.org/bbc220bc-7159-4ff9-baf7-6289f3dcf4d3`,
  },
  {
    year: "Sep 2012 – Oct 2013",
    degree: "Level 5 Diploma in Computing",
    institute: "NCC Education (UK)",
    details: "",
    link: ``,
  },
  {
    year: "Dec 2007 – Aug 2011",
    degree: "Bachelor of Technology in Electrical Power Engineering",
    institute: "Thanlyin Technological University",
    details: "",
    link: ``,
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

          <small className="d-block text-uppercase">{val.year}</small>
          <h5 className="poppins-font text-uppercase">{val.institute} </h5>
          {/* <span className="place open-sans-font">{val.degree} </span> */}
          <span className="place open-sans-font">
            {val.degree}
            {val.link && (
              <>
                {" "}
                <a href={val.link} target="_blank" rel="noopener noreferrer">
                  ↗ Verify
                </a>
              </>
            )}
          </span>
          <p className="open-sans-font">{val.details}</p>
        </li>
      ))}
    </ul>
  );
};

export default Education;
