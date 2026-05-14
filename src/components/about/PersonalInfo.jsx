import React from "react";
import { address, timezone, focus, workPreference, languages } from "../../config";

const personalInfoContent = [
  { meta: "Location", metaInfo: `${address} (${timezone})`, hasColor: "" },
  { meta: "Languages", metaInfo: languages, hasColor: "" },
  { meta: "Focus", metaInfo: focus, hasColor: "" },
  { meta: "Work Preference", metaInfo: workPreference, hasColor: "" },
];

const PersonalInfo = () => {
  return (
    <ul className="about-list list-unstyled open-sans-font">
      {personalInfoContent.map((val, i) => (
        <li key={i}>
          <span className="title">{val.meta}: </span>
          <span
            // className={`value d-block d-sm-inline-block d-lg-block d-xl-inline-block ${val.hasColor}`}
            className={`value d-block ${val.hasColor}`}
          >
            {val.metaInfo}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default PersonalInfo;
