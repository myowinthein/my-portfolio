import React from "react";

const experienceContent = [
  // StudyMe
  {
    companyName: "StudyMe · Melbourne, Australia (Remote)",
    companyInfo: "Student–university matching platform, later acquired by Wellspring International Education.",
    positions: [
      {"position": "Technical Lead", "year": "Dec 2021 – Aug 2025"},
    ],
    details: [
      `Took full ownership of a legacy Laravel monolith, refactoring architecture to enforce service layers, validation structure, API resources, and domain separation`,
      `Designed and maintained RESTful APIs for web and mobile clients, introducing API versioning, JWT authentication, SSO, and Stripe payment integration`,
      `Rebuilt and secured AWS infrastructure by auditing legacy resources, enforcing encryption, upgrading services, and implementing secure database access via VPN`
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
      `Contributed to backend development of a large scale online tuition platform built on a heavily customized Moodle CMS, supporting web and mobile clients`,
      `Implemented iPay88 payment integration and multi-provider social authentication, handling backend callbacks and transaction workflows across the platform`,
      `Proposed a custom backend architecture to replace CMS limitations, presenting trade-offs to PM and CTO and influencing architectural decision-making`
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
      `Designed backend architectures and API contracts across e-commerce, education, insurance, and civic platforms, ensuring scalable and maintainable systems`,
      `Led a team of 5 to 7 engineers across concurrent projects, providing technical direction, unblocking delivery, and driving code quality through structured reviews`
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
      `Progressed from intern to Senior Developer within 2 years, contributing across the full software development lifecycle on government systems`,
      `Built eGovernment web applications for business licensing, building permits, and revenue services, enabling citizens to complete workflows online`,
      `Designed backend workflows with role-based access control, approval stages, and notification systems to support real government processes`
    ]
  },
];

const Experience = () => {
  return (
    <ul>
      {experienceContent.map((val, i) => (
        <li key={i}>
          {/* Timeline icon */}
          <div className="icon">
            <i className="fa fa-briefcase"></i>
          </div>

          {/* Position + Year */}
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

          {/* Company */}
          <p className="place open-sans-font">
            {val.companyName}
          </p>

          {/* Company Info (context line) */}
          {val.companyInfo && (
            <p className="open-sans-font text-gray mb-3" style={{ opacity: 0.75 }}>
              {val.companyInfo}
            </p>
          )}

          {/* Details (manual bullets) */}
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
  );
};

export default Experience;
