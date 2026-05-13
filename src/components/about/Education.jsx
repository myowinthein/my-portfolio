import React from "react";

const educationContent = [
  {
    year: "Jul 2023 – Jul 2024",
    degree: "Bachelor of Science (Honours) in Computing",
    institute: "University of Greenwich",
    details: "Graduated with First Class Honours",
    link: ``,
  },
  {
    year: "Jul 2021",
    degree: "Certified Laravel Developer",
    institute: "Laravel",
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
    <>
      {educationContent.map((val, i) => (
        <div key={i} className="col-sm-6 mb-4" data-aos="fade-right">
          <div className="edu-card">
            <div className="edu-card__icon">
              <i className="fa fa-graduation-cap"></i>
            </div>
            <small className="d-block text-uppercase edu-card__year">{val.year}</small>
            <h5 className="poppins-font text-uppercase edu-card__degree">{val.degree}</h5>
            <p className="open-sans-font edu-card__institute">{val.institute}</p>
            {val.details && (
              <p className="open-sans-font edu-card__details">{val.details}</p>
            )}
            {val.link && (
              <a
                className="cert-verify-link open-sans-font"
                href={val.link}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                <i className="fa fa-arrow-up-right-from-square"></i>
                Verify Certificate
              </a>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default Education;
