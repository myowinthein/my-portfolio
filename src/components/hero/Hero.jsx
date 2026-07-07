import React from "react";
import { firstName, lastName, position, resumeURL, roleTags, summary } from "../../config";
import heroImage from "../../../public/assets/img/hero/dark.jpg";
import heroImgMobile from "../../../public/assets/img/hero/img-mobile.jpeg";
import Image from "next/image";

const heroContent = {
  heroImage: heroImage,
  heroMobileImage: heroImgMobile,
  heroTitleName: `${firstName} ${lastName}`,
  heroDesignation: position,
  heroDescriptions: summary,
  heroRoleTags: roleTags,
  heroBtn: "View Resume",
};

const Hero = () => {
  return (
    <div className="row home-details-container align-items-center">
      <div
        className="col-lg-4 bg position-fixed d-none d-lg-block"
        style={{ backgroundImage: `url(${heroContent.heroImage.src})` }}
      ></div>
      <div className="col-12 col-lg-8 offset-lg-4 home-details  text-center text-lg-start">
        <div>
          <Image
            src={heroContent.heroMobileImage}
            className="img-fluid main-img-mobile d-sm-block d-lg-none"
            alt={heroContent.heroTitleName}
          />
          <h1 className="poppins-font">
            <span className="d-block text-uppercase">{heroContent.heroTitleName}</span>
            <span>{heroContent.heroDesignation}</span>
          </h1>
          <div className="hero-credentials open-sans-font">
            {heroContent.heroRoleTags.map((tag) => (
              <span className="credential-item" key={tag}>{tag}</span>
            ))}
          </div>
          {heroContent.heroDescriptions.map((description) => (
            <p className="open-sans-font" key={description}>{description}</p>
          ))}
          <a className="button" href={resumeURL} target="_blank" rel="noreferrer">
            <span className="button-text">{heroContent.heroBtn}</span>
            <span className="button-icon fa fa-download"></span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
