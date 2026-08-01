import React from "react";
import Achievements from "./Achievements";
import Education from "./Education";
import Experience from "./Experience";
import PersonalInfo from "./PersonalInfo";
import Skills from "./Skills";
import skillSets from "./skillsData";
import { resumeURL, menuLabels } from "../../config";

const About = () => {
  return (
    <section className="main-content" data-aos="fade-up">
      <div className="container">
        <div className="row">
          {/* Personal Info Starts */}
          <div className="col-xl-6 col-lg-5 col-12">
            <div className="row">
              <div className="col-12">
                <h3 className="text-uppercase custom-title mb-0 ft-wt-600">
                  personal info
                </h3>
              </div>
              {/* End .col */}

              <div className="col-12">
                <PersonalInfo />
              </div>
              {/* End personal info */}

              <div className="col-12 mt-1">
                <a className="button" href={resumeURL} target="_blank" rel="noreferrer">
                  <span className="button-text">View Resume</span>
                  <span className="button-icon fa fa-download"></span>
                </a>
              </div>
              {/* End download button */}
            </div>
          </div>
          {/*  Personal Info Ends */}

          {/*  Boxes Starts */}
          <div className="col-xl-6 col-lg-7 col-12 mt-5 mt-lg-0">
            <Achievements />
          </div>
          {/* Achievements Ends */}
        </div>
        {/* End .row */}

        <hr className="separator" />

        {/* Experience Starts */}
        <div className="row">
          <div className="col-12">
            <h3 className="text-uppercase pb-4 pb-sm-5 mb-3 mb-sm-0 text-center custom-title ft-wt-600">
              Experience
            </h3>
          </div>
          <div className="col-12">
            <div className="resume-box experience-timeline">
              <Experience />
            </div>
          </div>
        </div>
        {/* Experience Ends */}

        <hr className="separator" />

        {/* Skills Starts */}
        <div className="row">
          <div className="col-12">
            <h3 className="text-uppercase pb-4 pb-sm-5 mb-3 mb-sm-0 text-center custom-title ft-wt-600">
              Technical Skills
            </h3>
          </div>
          <Skills skillSets={skillSets}/>
        </div>
        {/* Skills Ends */}

        <hr className="separator" />

        {/* Education Starts */}
        <div className="row">
          <div className="col-12">
            <h3 className="text-uppercase pb-4 pb-sm-5 mb-3 mb-sm-0 text-center custom-title ft-wt-600">
              Education
            </h3>
          </div>
          <div className="col-12">
            <div className="edu-list">
              <Education />
            </div>
          </div>
        </div>
        {/* Education Ends */}
      </div>
    </section>
  );
};

export default About;
