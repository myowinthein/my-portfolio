import React from "react";
import { socialLinks } from "../config";

const Social = () => {
  return (
    <ul className="social list-unstyled pt-1 mb-5">
      {socialLinks.map((val) => (
        <li key={val.link}>
          <a href={val.link} target="_blank" rel="noopener noreferrer">
            <i className={val.iconName}></i>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Social;
