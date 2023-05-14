import React from "react";

const personalInfoContent = [
  { meta: "first name", metaInfo: "Myo Win", hasColor: "" },
  { meta: "last name", metaInfo: "Thein", hasColor: "" },
  { meta: "Nationality", metaInfo: "Myanmar", hasColor: "" },
  { meta: "Address", metaInfo: "Bangkok, Thailand", hasColor: "" },
  // { meta: "phone", metaInfo: "+21621184010", hasColor: "" },
  { meta: "Email", metaInfo: "mwt.creative@gmail.com", hasColor: "" },
  { meta: "langages", metaInfo: "English, Burmese", hasColor: "" },
];

const PersonalInfo = () => {
  return (
    <ul className="about-list list-unstyled open-sans-font">
      {personalInfoContent.map((val, i) => (
        <li key={i}>
          <span className="title">{val.meta}: </span>
          <span
            className={`value d-block d-sm-inline-block d-lg-block d-xl-inline-block ${val.hasColor}`}
          >
            {val.metaInfo}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default PersonalInfo;
