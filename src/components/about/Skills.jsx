import React from "react";
import Image from "next/image";

const Skills = ({skillSets}) => {
  return (
    <div className="col-12" data-aos="fade-up">
      <div className="skills-flat">
        {skillSets.map((skillSet, i) => (
          <div className="skill-group" key={i}>
            <p className="skill-group__label open-sans-font">{skillSet.title}</p>
            <div className="row justify-content-start">
              {skillSet.skills.map((skill, j) => (
                <div className="col-6 col-md-2 mb-2 mb-sm-3" key={j}>
                  <div className="pLogo p25 position-relative">
                    {skill.core && (
                      <i
                        className="fa-solid fa-crown position-absolute"
                        style={{
                          top: '-4px',
                          right: '-2px',
                          fontSize: '10px',
                          color: '#f5c451',
                          opacity: 0.65,
                          pointerEvents: 'none',
                        }}
                      />
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
    </div>
  );
};

export default Skills;
