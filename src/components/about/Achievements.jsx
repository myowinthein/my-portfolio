import React from "react";
import { careerSince, totalExperiences, totalPlatformTypes, totalDeliveredProjects } from "../../config";

const achievementsContent = [
  { title: totalExperiences, withPlus: true, subTitle1: "years of", subTitle2: "experience" },
  { title: careerSince, withPlus: false, subTitle1: "career", subTitle2: "start" },
  { title: totalPlatformTypes, withPlus: true, subTitle1: "platform", subTitle2: "types" },
  { title: totalDeliveredProjects, withPlus: true, subTitle1: "projects", subTitle2: "delivered" },
];

const Achievements = () => {
  return (
    <div className="row">
      {achievementsContent.map((val, i) => (
        <div className="col-6" key={i}>
          <div className="box-stats with-margin">
            <h3 className="poppins-font position-relative">
              {val.title}
              {val.withPlus && <span className="ms-1">+</span>}
            </h3>

            <p className="open-sans-font m-0 position-relative text-uppercase">
              {val.subTitle1}
              <span className="d-block">{val.subTitle2}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Achievements;
