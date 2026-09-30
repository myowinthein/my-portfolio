import React from "react";

const educationContent = [
  {
    type: "degree",
    year: "Jul 2023 – Jul 2024",
    degree: "BSc (Hons) Computing, First Class Honours",
    institute: "University of Greenwich, London, UK",
    details: "",
    link: "",
  },
  {
    type: "certification",
    year: "Jul 2021",
    degree: "Certified Laravel Developer",
    institute: "Laravel",
    details: "",
    link: "https://verifier.certificationforlaravel.org/bbc220bc-7159-4ff9-baf7-6289f3dcf4d3",
  },
  {
    type: "degree",
    year: "Sep 2012 – Oct 2013",
    degree: "Level 5 Diploma in Computing",
    institute: "NCC Education, Manchester, UK",
    details: "",
    link: "",
  },
  {
    type: "degree",
    year: "Dec 2007 – Nov 2011",
    degree: "Bachelor of Technology in Electrical Power Engineering",
    institute: "Thanlyin Technological University, Yangon, Myanmar",
    details: "",
    link: "",
  },
];

const typeConfig = {
  degree: { icon: "fa-graduation-cap", label: "Degree" },
  certification: { icon: "fa-certificate", label: "Certification" },
};

const Education = () => {
  return (
    <div className="edu-timeline">
      {educationContent.map((val) => (
        <div key={val.degree} className={`edu-row edu-row--${val.type}`}>
          <div className="edu-row__left">
            <span className="edu-row__type open-sans-font">
              <i className={`fa ${typeConfig[val.type].icon}`}></i>
              {typeConfig[val.type].label}
            </span>
            <h5 className="poppins-font edu-row__degree">{val.degree}</h5>
            <p className="open-sans-font edu-row__meta">{val.institute}</p>
            {val.details && (
              <p className="open-sans-font edu-row__detail">{val.details}</p>
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
          <small className="text-uppercase edu-row__year">{val.year}</small>
        </div>
      ))}
    </div>
  );
};

export default Education;
