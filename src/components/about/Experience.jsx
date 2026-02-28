import React from "react";

const experienceContent = [
  {
    companyName: "StudyMe (Melbourne, Australia - Remote)",
    positions: [
      {"position": "Technical Lead", "year": "Dec 2021 – Aug 2025"},
    ],
    details: [
      `Owned a 70k-user production Laravel monolith, refactoring architecture to improve maintainability and enforce structured service layers and domain separation.`,
      `Designed and maintained APIs for web and mobile clients, implementing authentication flows while ensuring backward compatibility.`,
      `Improved performance through query optimization, caching, and asynchronous queue processing, and strengthened stability via incident handling and AWS-based infrastructure improvements.`,
      `Led backend execution during sprint cycles, translating business requirements into architecture plans and maintaining platform continuity through system modernization and acquisition.`
    ]
  },
  {
    companyName: "Snappymob (Kuala Lumpur, Malaysia - Remote)",
    positions: [
      {"position": "Full Stack Developer", "year": "Sep 2021 – Dec 2021"},
    ],
    details: [
      `Contributed to the backend development of a nationwide online tuition platform built on a heavily customised Moodle LMS during its initial product build phase.`,
      `Implemented payment integration (iPay88) and third-party authentication, handling backend callbacks and transaction result processing within the CMS framework.`,
      `Extended Moodle through plugin development and API integration to support learning workflows across web and mobile platforms.`,
      `Participated in architectural discussions and backend code reviews within a multi-developer team, maintaining quality during rapid product iteration.`
    ]
  },
  {
    companyName: "Nexlabs (Yangon, Myanmar)",
    positions: [
      {"position": "Head of Engineering", "year": "Dec 2020 – Feb 2021"},
      {"position": "Frontend & CMS Team Lead", "year": "Feb 2019 – Dec 2020"},
      {"position": "Senior Full Stack Developer", "year": "Aug 2018 – Feb 2019"},
      {"position": "Senior PHP Developer", "year": "Jun 2016 – Aug 2018"},
    ],
    details: [
      `Delivered client platforms across e-commerce, education, insurance, and healthcare, working hands-on across backend systems, database design, OpenCart customisation, and frontend integrations.`,
      `Designed backend architectures and database schemas, implementing caching, queues, and scheduled jobs to ensure production stability and performance.`,
      `Led a team of 5–7 developers, managing goals and mentoring through architectural and implementation challenges.`,
      `Led the technical build of an internal multi-vendor eCommerce product based on Bagisto, defining system structure and feature strategy during its initial development phase.`
    ]
  },
  {
    companyName: "Global Wave Technology (Yangon, Myanmar)",
    positions: [
      {"position": "Senior Developer", "year": "Mar 2015 – Oct 2015"},
      {"position": "Developer", "year": "Apr 2014 – Mar 2015"},
      {"position": "Programmer", "year": "Mar 2013 – Apr 2014"},
      {"position": "Intern", "year": "Jan 2013 – Mar 2013"},
    ],
    details: [
      `Worked on eGovernment systems under the Yangon Smart City initiative, digitizing public-facing and internal administrative workflows for the Yangon City Development Committee (YCDC).`,
      `Delivered end-to-end web features using PHP, JavaScript, and MySQL across implementation, testing, production support, and long-term maintenance.`,
      `Independently built desktop and mobile applications integrated with MIFARE smart cards and RFID/barcode devices, implementing SDK-based hardware communication for real-time identification workflows.`,
      `Served as the senior technical contact, handling production issues, coordinating with government officers, and mentoring junior developers through code reviews and technical guidance.`
    ]
  },
];

const Experience = () => {
  return (
     <ul>
      {experienceContent.map((val, i) => (
        <li key={i}>
          <div className="icon">
            <i className="fa fa-briefcase"></i>
          </div>
          {val.positions.map((item, j) => (
            <div key={j} className="exp-gutter">
              <small className="d-block text-uppercase">{item.year}</small>
              <h5 className="poppins-font text-uppercase">
                {item.position}
              </h5>
            </div>
          ))}

          <p className="place open-sans-font">{val.companyName}</p>
          {val.details.map((text, index) => (
            <p
              key={index}
              className="open-sans-font text-gray mb-3"
            >
              {text}
            </p>
          ))}
        </li>
      ))}
    </ul>
  );
};

export default Experience;
