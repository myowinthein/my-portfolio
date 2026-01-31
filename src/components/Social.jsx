import React from "react";
import { facebookURL, instagramURL, githubURL, mediumURL, linkedinURL } from "../config";

const SocialShare = [
  // {
  //   iconName: "fa-brands fa-facebook",
  //   link: facebookURL,
  // },
  // { 
  //   iconName: "fa-brands fa-instagram", 
  //   link: instagramURL 
  // },
  {
    iconName: "fa-brands fa-github",
    link: githubURL,
  },
  { 
    iconName: "fa-brands fa-medium",
    link: mediumURL
  },
  { 
    iconName: "fa-brands fa-linkedin",
    link: linkedinURL
  },
];

const Social = () => {
  return (
    <ul className="social list-unstyled pt-1 mb-5">
      {SocialShare.map((val, i) => (
        <li key={i}>
          <a href={val.link} target="_blank" rel="noreferrer">
            <i className={val.iconName}></i>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Social;
