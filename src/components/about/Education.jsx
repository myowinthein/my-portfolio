import React from "react";

const educationContent = [
  {
    year: "Jul 2023 – Jul 2024",
    degree: "BSc (Hons) Computing, First Class Honours",
    institute: "University of Greenwich, UK",
    details: "Remote study via KMD College, Myanmar, official University of Greenwich partner",
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
    institute: "NCC Education, UK",
    details: "Onsite study via KMD College, Myanmar, official NCC Education partner",
    link: ``,
  },
  {
    year: "Dec 2007 – Nov 2011",
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
        <div key={i} className="edu-row">
          <div className="edu-row__left">
            <h5 className="poppins-font edu-row__degree">{val.degree}</h5>
            <p className="open-sans-font edu-row__meta">{val.institute}</p>
            {val.details ? (
              <p className="open-sans-font edu-row__detail">{val.details}</p>
            ) : null}
            {val.link ? (
              <a
                className="cert-verify-link open-sans-font"
                href={val.link}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                <i className="fa fa-arrow-up-right-from-square"></i>
                Verify Certificate
              </a>
            ) : null}
          </div>
          <small className="text-uppercase edu-row__year">{val.year}</small>
        </div>
      ))}
    </>
  );
};

export default Education;
