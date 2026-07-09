import React from "react";
import { firstName, lastName, position, resumeURL, roleTags, summary } from "../../config";
import heroImage from "../../../public/assets/img/hero/dark.jpg";
import heroImgMobile from "../../../public/assets/img/hero/img-mobile.jpeg";
import Image from "next/image";

const fullName = `${firstName} ${lastName}`;

const Hero = () => {
  return (
    <div className="row home-details-container align-items-center">
      <div
        className="col-lg-4 bg position-fixed d-none d-lg-block"
        style={{ backgroundImage: `url(${heroImage.src})` }}
      ></div>
      <div className="col-12 col-lg-8 offset-lg-4 home-details  text-center text-lg-start">
        <div>
          <Image
            src={heroImgMobile}
            className="img-fluid main-img-mobile d-sm-block d-lg-none"
            alt={fullName}
            priority
          />
          <h1 className="poppins-font">
            <span className="d-block text-uppercase">{fullName}</span>
            <span>{position}</span>
          </h1>
          <div className="hero-credentials open-sans-font">
            {roleTags.map((tag, i) => (
              <span className="credential-item" key={i}>{tag}</span>
            ))}
          </div>
          {summary.map((description, i) => (
            <p className="open-sans-font" key={i}>{description}</p>
          ))}
          <a className="button" href={resumeURL} target="_blank" rel="noreferrer">
            <span className="button-text">View Resume</span>
            <span className="button-icon fa fa-download"></span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
