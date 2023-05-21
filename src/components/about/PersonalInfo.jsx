import React from "react";
import { firstName, lastName, email, address, nationality, careerSince, languages } from '../../config';

const personalInfoContent = [
  { meta: "first name", metaInfo: firstName, hasColor: "" },
  { meta: "last name", metaInfo: lastName, hasColor: "" },
  { meta: "Nationality", metaInfo: nationality, hasColor: "" },
  { meta: "Address", metaInfo: address, hasColor: "" },
  { meta: "Career Since", metaInfo: careerSince, hasColor: "" },
  { meta: "Languages", metaInfo: languages, hasColor: "" },

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
