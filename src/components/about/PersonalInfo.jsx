import React from "react";
import { address, timezone, focus, workPreference, languages } from "../../config";

const personalInfoContent = [
  { meta: "Location", metaInfo: `${address} (${timezone})` },
  { meta: "Languages", metaInfo: languages },
  { meta: "Focus", metaInfo: focus },
  { meta: "Work Preference", metaInfo: workPreference },
];

const PersonalInfo = () => {
  return (
    <ul className="about-list list-unstyled open-sans-font">
      {personalInfoContent.map((val, i) => (
        <li key={i}>
          <span className="title">{val.meta}: </span>
          <span className="value">{val.metaInfo}</span>
        </li>
      ))}
    </ul>
  );
};

export default PersonalInfo;
