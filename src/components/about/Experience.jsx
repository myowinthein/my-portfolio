import React from "react";

const experienceContent = [
  {
    companyName: "StudyMe (Melbourne, Australia - Remote)",
    positions: [
      {"position": "Technical Lead", "year": "Dec 2021 – Aug 2025"},
    ],
    details: [
      `StudyMe connects students with universities through guided discovery and conversations, and was later acquired by Wellspring International Education, which provides global enrollment services. I worked across both platforms on student-facing and internal recruitment systems.`,
      `I owned and evolved a legacy Laravel backend, improving performance, security, and reliability while delivering new features. My work included query optimisation, caching, reporting, AWS and CI/CD hardening, leading backend and integration decisions, and rebuilding the Wellspring portal while maintaining production continuity.`
    ],
  },
  {
    companyName: "Snappymob (Kuala Lumpur, Malaysia - Remote)",
    positions: [
      {"position": "Full Stack Developer", "year": "Sep 2021 – Dec 2021"},
    ],
    details: [
      `Snappymob is a boutique digital consultancy delivering scalable digital solutions across multiple industries.`,
      `I contributed to the backend development of Tavis, a Moodle-based online tuition platform, focusing on CMS customisation and integrations. I led payment and authentication integrations (iPay88, Google, Apple, Facebook), collaborated with the CTO on architecture decisions, and participated in backend reviews to ensure stability, scalability, and maintainability during rapid development.`
    ]
  },
  {
    companyName: "Nexlabs (Yangon, Myanmar)",
    positions: [
      {"position": "Head of Engineering", "year": "Dec 2020 – Feb 2021"},
      {"position": "Lead Frontend and CMS Developer", "year": "Feb 2019 – Dec 2020"},
      {"position": "Senior Full Stack Developer", "year": "Aug 2018 – Feb 2019"},
      {"position": "Senior PHP Developer", "year": "Jun 2016 – Aug 2018"},
    ],
    details: [
      `Nexlabs is a digital consultancy helping businesses deliver practical, measurable digital products through strong engineering and product craftsmanship.`,
      `I delivered multiple client platforms across e-commerce, education, insurance, and healthcare, working hands-on across backend, frontend, and CMS systems. I acted as a project-level technical lead, guiding architecture, estimates, and integrations, mentoring developers, and fully owning Fastforward, an early-stage multi-vendor e-commerce platform built and deployed independently.`
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
      `Global Wave Technology delivers end-to-end software solutions across web, enterprise systems, and custom applications for public and private sector clients.`,
      `I worked on large-scale eGovernment systems for YCDC, building and maintaining citizen-facing portals and internal administrative platforms. My work extended across web, desktop, and mobile systems, including smart card and RFID/barcode integrations. I also acted as a senior technical contact with government stakeholders and supported junior developers on complex, long-running projects.`
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
