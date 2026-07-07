import React from "react";
import { githubURL, mediumURL, linkedinURL } from "../config";

const SocialShare = [
  {
    iconName: "fa-brands fa-linkedin",
    link: linkedinURL,
  },
  {
    iconName: "fa-brands fa-github",
    link: githubURL,
  },
  {
    iconName: "fa-brands fa-medium",
    link: mediumURL,
  },
];

const Social = () => {
  return (
    <ul className="social list-unstyled pt-1 mb-5">
      {SocialShare.map((val) => (
        <li key={val.link}>
          <a href={val.link} target="_blank" rel="noreferrer">
            <i className={val.iconName}></i>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Social;
