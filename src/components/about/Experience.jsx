import React from "react";

const experienceContent = [
  {
    companyName: "StudyMe (Melbourne, Australia - Remote)",
    positions: [
      {"position": "Technical Lead", "year": "Dec 2021 – Aug 2025"},
    ],
    details: `
      StudyMe is a student-centred education platform connecting prospective students with 
      universities through meaningful discovery and conversations. As Technical Lead, I owned a legacy 
      Laravel backend and AWS infrastructure, improving code quality, performance, and security while 
      continuing to ship new features. I led backend, infrastructure, and integration decisions, 
      stabilized CI/CD and cloud operations, and supported platform continuity during acquisition, 
      later rebuilding the Wellspring web portal with a modern, maintainable architecture.
    `,
  },
  {
    companyName: "Snappymob (Kuala Lumpur, Malaysia - Remote)",
    positions: [
      {"position": "Full Stack Developer", "year": "Sep 2021 – Dec 2021"},
    ],
    details: `
      Snappymob is a boutique digital consultancy delivering complex, business-critical systems. 
      As a Full Stack Developer, I contributed to the backend development of Tavis, an online tuition 
      platform built on Moodle, focusing on CMS customization, backend integrations, and system stability.
      I took primary responsibility for payment and authentication integrations 
      (including iPay88 and third-party login providers) and worked closely with the CTO on backend 
      architecture and database design decisions.
    `
  },
  {
    companyName: "Nexlabs (Yangon, Myanmar)",
    positions: [
      {"position": "Head of Engineering", "year": "Dec 2020 – Aug 2021"},
      {"position": "Lead Frontend and CMS Developer", "year": "Feb 2019 – Dec 2020"},
      {"position": "Senior Full Stack Developer", "year": "Aug 2018 – Feb 2019"},
      {"position": "Senior PHP Developer", "year": "Jun 2016 – Aug 2018"},
    ],
    details: `
      Nexlabs is a digital agency delivering custom products across e-commerce, education, insurance, 
      and healthcare. I joined as a Senior PHP Developer and progressed through senior and lead roles to 
      Head of Engineering, remaining hands-on throughout. I worked across backend, frontend, and CMS-based
      systems, translating business requirements into practical technical solutions and making day-to-day
      architecture and integration decisions in collaboration with the CTO. Alongside development work, 
      I supported and guided other engineers through code reviews, internal training, and technical 
      direction, and took full ownership of Fastforward, an early-stage e-commerce vendor platform built 
      on Bagisto.
    `
  },
  {
    companyName: "Global Wave Technology (Yangon, Myanmar)",
    positions: [
      {"position": "Senior Developer", "year": "Mar 2015 – Oct 2015"},
      {"position": "Developer", "year": "Apr 2014 – Mar 2015"},
      {"position": "Programmer", "year": "Mar 2013 – Apr 2014"},
      {"position": "Intern", "year": "Jan 2013 – Mar 2013"},
    ],
    details: `
    Global Wave Technology is a Myanmar-based software company delivering end-to-end solutions across web, desktop, and integrated systems for public and enterprise clients. I worked on large-scale eGovernment systems for Yangon City Development Committee (YCDC), building and maintaining both public-facing citizen portals and internal administrative platforms. My work spanned PHP, JavaScript, and MySQL, delivering end-to-end features from implementation to long-term maintenance. I also developed desktop and mobile applications integrated with smart cards and RFID/barcode-based document tracking systems, and worked directly with government stakeholders through on-site support and consultations while supporting junior developers as responsibilities grew.
    `
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
          <p className="open-sans-font text-gray">{val.details}</p>
        </li>
      ))}
    </ul>
  );
};

export default Experience;
