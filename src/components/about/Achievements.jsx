import React from "react";
import { totalExperiences, totalProjects, totalAPIs, totalPages } from '../../config';

const achievementsContent = [
  { title: totalExperiences, subTitle1: "years of", subTitle2: "experience" },
  { title: totalProjects, subTitle1: "completed", subTitle2: "projects" },
  { title: totalAPIs, subTitle1: "APIs", subTitle2: "developed" },
  { title: totalPages, subTitle1: "frontend pages", subTitle2: "created" },
];

const Achievements = () => {
  return (
    <div className="row">
      {achievementsContent.map((val, i) => (
        <div className="col-6" key={i}>
          <div className="box-stats with-margin">
            <h3 className="poppins-font position-relative">{val.title}</h3>
            <p className="open-sans-font m-0 position-relative text-uppercase">
              {val.subTitle1} <span className="d-block">{val.subTitle2}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Achievements;
