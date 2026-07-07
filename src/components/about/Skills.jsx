import React from "react";
import Image from "next/image";
import useExpandableList from "../../Hooks/useExpandableList";

const CORE_COUNT = 4;

const Skills = ({skillSets}) => {
  const { visible: visibleSets, showAll, toggle: toggleSkills } = useExpandableList(skillSets, CORE_COUNT);

  return (
    <div className="col-12" data-aos="fade-up">
      <div className="skills-flat">
        {visibleSets.map((skillSet) => (
          <div className="skill-group" key={skillSet.title}>
            <p className="skill-group__label open-sans-font">{skillSet.title}</p>
            <div className="row justify-content-start">
              {skillSet.skills.map((skill) => (
                <div className="col-6 col-md-2 mb-2 mb-sm-3" key={skill.name}>
                  <div className="pLogo p25 position-relative">
                    {skill.core && (
                      <i className="fa-solid fa-crown position-absolute skill-crown-badge" />
                    )}
                    <Image src={skill.icon} alt={skill.name} />
                  </div>
                  <small className="open-sans-font d-block text-center mt-2">{skill.name}</small>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="exp-toggle-area">
        <button className="exp-toggle-btn open-sans-font" onClick={toggleSkills}>
          {showAll ? (
            <><i className="fa fa-chevron-up"></i> Show less</>
          ) : (
            <><i className="fa fa-chevron-down"></i> Show more skills</>
          )}
        </button>
      </div>
    </div>
  );
};

export default Skills;
