import React, { useState } from "react";

const experienceContent = [
  // StudyMe
  {
    companyName: "StudyMe · Melbourne, Australia (Remote)",
    companyInfo: "Student–university matching platform, later acquired by Wellspring International Education.",
    positions: [
      {"position": "Technical Lead", "year": "Dec 2021 – Aug 2025"},
    ],
    details: [
      `Took full ownership of a legacy Laravel monolith, refactoring the architecture to enforce service layers, validation structure, API resources, and domain separation`,
      `Rebuilt and secured AWS infrastructure by auditing legacy resources, enforcing encryption, upgrading services, and implementing secure database access via VPN`,
      `Modernized CI/CD and security practices by implementing OIDC, removing hardcoded credentials, and introducing role-based access in deployment workflows`
    ]
  },

  // Snappymob
  {
    companyName: "Snappymob · Kuala Lumpur, Malaysia (Remote)",
    companyInfo: `Consultancy building scalable digital platforms across finance, media, agriculture, and logistics.`,
    positions: [
      {"position": "Full Stack Developer", "year": "Sep 2021 – Dec 2021"},
    ],
    details: [
      `Contributed to backend development of a large-scale online tuition platform built on a heavily customized Moodle CMS, supporting web and mobile clients`,
      `Implemented iPay88 payment integration and multi-provider social authentication, handling backend callbacks and transaction workflows across the platform`,
      `Proposed a custom backend structure to address CMS limitations, presenting technical trade-offs to the PM and CTO while contributing to implementation decisions`
    ]
  },

  // Nexlabs
  {
    companyName: "Nexlabs · Yangon, Myanmar",
    companyInfo: `Digital consultancy delivering measurable web solutions through strategy, engineering and UX.`,
    positions: [
      {"position": "Head of Engineering", "year": "Dec 2020 – Feb 2021"},
      {"position": "Frontend & CMS Team Lead", "year": "Feb 2019 – Dec 2020"},
      {"position": "Senior Full Stack Developer", "year": "Aug 2018 – Feb 2019"},
      {"position": "Senior PHP Developer", "year": "Jun 2016 – Aug 2018"},
    ],
    details: [
      `Progressed from Senior PHP Developer to Head of Engineering, earning trust through consistent ownership and technical leadership across multiple client systems`,
      `Designed backend systems and API contracts across e-commerce, education, insurance, and civic platforms, ensuring scalable and maintainable systems`,
      `Led the backend design and early development of FastForward, an internal e-commerce platform, defining system structure and guiding its initial build phase`
    ]
  },

  // Global Wave Technology
  {
    companyName: "Global Wave Technology · Yangon, Myanmar",
    companyInfo: `Software company delivering retail and HR systems with web and multi-platform integration.`,
    positions: [
      {"position": "Senior Developer", "year": "Mar 2015 – Oct 2015"},
      {"position": "Developer", "year": "Apr 2014 – Mar 2015"},
      {"position": "Programmer", "year": "Mar 2013 – Apr 2014"},
      {"position": "Intern", "year": "Jan 2013 – Mar 2013"},
    ],
    details: [
      `Progressed from intern to Senior Developer within 2 years, contributing across the software development lifecycle on government systems`,
      `Designed backend workflows with role-based access control, approval stages, and notification systems to support government operational workflows`,
      `Developed hardware-integrated systems using C# and RFID technologies, including smart card issuance and mobile applications for physical asset tracking`
    ]
  },
];

const Experience = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleContent = showAll ? experienceContent : experienceContent.slice(0, 3);

  return (
    <>
      <ul>
        {visibleContent.map((val, i) => (
          <li key={i}>
            <div className="icon">
              <i className="fa fa-briefcase"></i>
            </div>

            {val.positions.map((item, j) => (
              <div key={j} className="exp-gutter">
                <small className="d-block text-uppercase">
                  {item.year}
                </small>
                <h5 className="poppins-font text-uppercase">
                  {item.position}
                </h5>
              </div>
            ))}

            <p className="place open-sans-font">
              {val.companyName}
            </p>

            {val.companyInfo && (
              <p className="open-sans-font text-gray mb-3" style={{ opacity: 0.75 }}>
                {val.companyInfo}
              </p>
            )}

            {val.details.map((text, index) => (
              <p
                key={index}
                className="open-sans-font text-gray mb-3"
              >
                •&nbsp;&nbsp;{text}
              </p>
            ))}
          </li>
        ))}
      </ul>
      <div className="exp-toggle-area">
        <button
          className="exp-toggle-btn open-sans-font"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? (
            <><i className="fa fa-chevron-up"></i> Show less</>
          ) : (
            <><i className="fa fa-chevron-down"></i> Show earlier experience</>
          )}
        </button>
      </div>
    </>
  );
};

export default Experience;
