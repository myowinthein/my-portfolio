import React, { useState } from "react";
import Modal from "react-modal";
import { name, position, totalExperiences, resumeURL } from "../../config";
import heroImage from "../../../public/assets/img/hero/dark.jpeg";
import heroImgMobile from "../../../public/assets/img/hero/img-mobile.jpeg";
import cancelImg from "../../../public/assets/img/cancel.svg";
import AboutMain from "../about";
import Image from "next/image";

const heroContent = {
  heroImage: heroImage,
  heroMobileImage: heroImgMobile,
  heroTitleName: name,
  heroDesignation: position,
  heroDescriptions: [
    `I’m a backend-first software engineer and technical lead with ${totalExperiences}+ years of experience building, 
    scaling, and operating web platforms. I work primarily with PHP/Laravel, relational databases, 
    and AWS infrastructure, focusing on system reliability, performance, and long-term maintainability.`,
    `I enjoy working in product-focused teams where clear thinking, pragmatic engineering, and 
    sustainable delivery matter more than hype.`
  ],
  heroBtn: "Download Resume",
};

const Hero = () => {
  const [isOpen, setIsOpen] = useState(false);
  function toggleModalOne() {
    setIsOpen(!isOpen);
  }

  return (
    <>
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
              alt="hero man"
              // style={{width:'100%',height:'100%'}}
            />
            <h1 className="poppins-font"> <div className="text-uppercase">
              {"I'm"} {heroContent.heroTitleName}. </div>
              <span>{heroContent.heroDesignation}</span>
            </h1>
            {heroContent.heroDescriptions.map((description, i) => (
              <p className="open-sans-font" key={i}>{description}</p>
            ))}
            {/* <button className="button" onClick={toggleModalOne}> */}
            <a className="button" href={resumeURL} target="_blank" rel="noreferrer" download>
              <span className="button-text">{heroContent.heroBtn}</span>
              <span className="button-icon fa fa-download"></span>
            </a>
            {/* </button> */}
          </div>
        </div>
      </div>
      {/* End home-details-container */}

      {/* Start Modal for About More */}
      <Modal
        isOpen={isOpen}
        onRequestClose={toggleModalOne}
        contentLabel="My dialog"
        className="custom-modal dark hero"
        overlayClassName="custom-overlay dark"
        closeTimeoutMS={500}
      >
        <div>
          <button className="close-modal" onClick={toggleModalOne}>
            <Image src={cancelImg} alt="close icon" />
          </button>
          {/* End close icon */}

          <div className="box_inner about">
            <div data-aos="fade-up" data-aos-duration="1200">
              <div className="title-section text-start text-sm-center">
                <h1>
                  ABOUT <span>ME</span>
                </h1>
                <span className="title-bg">Resume</span>
              </div>
              {/* End title */}
              <AboutMain />
            </div>
          </div>
        </div>
        {/* End modal box news */}
      </Modal>
      {/* End  Modal for About More */}
    </>
  );
};

export default Hero;
