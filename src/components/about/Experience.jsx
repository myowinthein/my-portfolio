import React from "react";

const experienceContent = [
  {
    companyName: "StudyMe (Melbourne, Australia)",
    positions: [
      {"position": "Technical Lead", "year": "Dec 2021 – Present"},
    ],
    details: `Lorem ipsum dolor sit amet, tempor incididunt ut laboreconsectetur
        elit, sed do eiusmod tempor duntt`,
  },
  {
    companyName: "Snappymob (Kuala Lumpur, Malaysia)",
    positions: [
      {"position": "Full Stack Developer", "year": "Sep 2021 – Dec 2021"},
    ],
    details: `Lorem ipsum dolor sit amet, tempor incididunt ut laboreconsectetur
        elit, sed do eiusmod tempor duntt`,
  },
  {
    companyName: "Nexlabs (Yangon, Myanmar)",
    positions: [
      {"position": "Head of Engineering", "year": "Dec 2020 – Aug 2021"},
      {"position": "Lead Front-end and CMS Developer", "year": "Feb 2019 – Dec 2020"},
      {"position": "Senior Full Stack Developer", "year": "Aug 2018 – Feb 2019"},
      {"position": "Senior PHP Developer", "year": "Jun 2016 – Aug 2018"},
    ],
    details: `Lorem ipsum dolor sit amet, tempor incididunt ut laboreconsectetur
        elit, sed do eiusmod tempor duntt`,
  },
  {
    companyName: "Global Wave Technology (Yangon, Myanmar)",
    positions: [
      {"position": "Senior Developer", "year": "Mar 2015 – Oct 2015"},
      {"position": "Developer", "year": "Apr 2014 – Mar 2015"},
      {"position": "Programmer", "year": "Mar 2013 – Apr 2014"},
      {"position": "Intern", "year": "Jan 2013 – Mar 2013"},
    ],
    details: `Lorem ipsum dolor sit amet, tempor incididunt ut laboreconsectetur
        elit, sed do eiusmod tempor duntt`,
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
          <span className="time open-sans-font text-uppercase">{val.companyName}</span>
          {val.positions.map((item, j) => (
            <h5 key={j} className="poppins-font text-uppercase">
              {item.position}
              <span className="place open-sans-font">{item.year}</span>
            </h5>
          ))}
          <p className="open-sans-font">{val.details}</p>
        </li>
      ))}
    </ul>
  );
};

export default Experience;
