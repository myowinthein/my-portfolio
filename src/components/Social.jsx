import React from "react";
import { facebookURL, instagramURL, githubURL, mediumURL, linkedinURL } from '../config';

const SocialShare = [
  {
    iconName: "fa fa-facebook",
    link: facebookURL,
  },
  { 
    iconName: "fa fa-instagram", 
    link: instagramURL 
  },
  {
    iconName: "fa fa-github",
    link: githubURL,
  },
  { 
    iconName: "fa fa-medium",
    link: mediumURL
  },
  { 
    iconName: "fa fa-linkedin",
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
