import React from "react";

const experienceContent = [
  {
    companyName: "StudyMe (Melbourne, Australia)",
    positions: [
      {"position": "Technical Lead", "year": "Dec 2021 – Present"},
    ]
  },
  {
    companyName: "Snappymob (Kuala Lumpur, Malaysia)",
    positions: [
      {"position": "Full Stack Developer", "year": "Sep 2021 – Dec 2021"},
    ],
  },
  {
    companyName: "Nexlabs Digital Agency (Yangon, Myanmar)",
    positions: [
      {"position": "Head of Engineering", "year": "Dec 2020 – Aug 2021"},
      {"position": "Lead Frontend and CMS Developer", "year": "Feb 2019 – Dec 2020"},
      {"position": "Senior Full Stack Developer", "year": "Aug 2018 – Feb 2019"},
      {"position": "Senior PHP Developer", "year": "Jun 2016 – Aug 2018"},
    ],
  },
  {
    companyName: "Global Wave Technology (Yangon, Myanmar)",
    positions: [
      {"position": "Senior Developer", "year": "Mar 2015 – Oct 2015"},
      {"position": "Developer", "year": "Apr 2014 – Mar 2015"},
      {"position": "Programmer", "year": "Mar 2013 – Apr 2014"},
      {"position": "Intern", "year": "Jan 2013 – Mar 2013"},
    ],
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
              <small className="text-muted d-block text-uppercase">{item.year}</small>
              <h5 className="poppins-font text-uppercase">
                {item.position}
              </h5>
            </div>
          ))}

          <p className="place open-sans-font">{val.companyName}</p>
          {/* <p className="open-sans-font text-gray">{val.details}</p> */}
        </li>
      ))}
    </ul>
  );
};

export default Experience;
