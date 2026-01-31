import React from "react";
import { name, firstName, lastName, address, nationality, totalExperiences, careerSince, workPreference, languages } from "../../config";

const personalInfoContent = [
  { meta: "Name", metaInfo: `${firstName} ${lastName} (${name})`, hasColor: "" },
  // { meta: "first name", metaInfo: firstName, hasColor: "" },
  // { meta: "last name", metaInfo: lastName, hasColor: "" },
  { meta: "Nationality", metaInfo: nationality, hasColor: "" },
  { meta: "Location", metaInfo: address, hasColor: "" },
  // { meta: "Career Since", metaInfo: careerSince, hasColor: "" },
  { meta: "Experience", metaInfo: `${totalExperiences}+ years`, hasColor: "" },
  { meta: "Languages", metaInfo: languages, hasColor: "" },
  { meta: "Work Preference", metaInfo: workPreference, hasColor: "" },
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
