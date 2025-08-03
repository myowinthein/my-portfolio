import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Image from "next/image";

const Skills = ({skillSets}) => {
  return (
    <>
    <div className="col-12" data-aos="fade-up">
      <Tabs>
        <TabList className="portfolio-tab-list">
          {skillSets.map((skillSet, i) => (
            <Tab key={i}>{skillSet.title}</Tab>
          ))}
        </TabList>

        <div className="container mt-4">
            <div className="tab-container">
              <div className=""> 
                {skillSets.map((skillSet, i) => (
                  <TabPanel key={i}>
                    <div class="row justify-content-center">
                      {skillSet.skills.map((skill, j) => (
                          <div className="col-6 col-md-2 mb-3 mb-sm-5" key={j}>
                            <div className="pLogo p25">
                              <Image src={skill.icon} alt="skill icon" />
                            </div> 
                            <small className="open-sans-font d-block text-center mt-2">
                              {skill.name}
                            </small>
                          </div>
                      ))}
                    </div>
                </TabPanel>
              ))}
            </div>
          </div>
        </div>
      </Tabs>
    </div>
    </>
  );
};

export default Skills;
