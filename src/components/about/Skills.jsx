import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Image from "next/image";

const Skills = (props) => {
  const skillSets = props.skillSets;

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
                              <Image src={'/assets/img/programming/'+ skill.icon} alt="skill icon" width={100} height={100} />
                            </div> 
                            <small className="open-sans-font d-block text-muted text-center mt-2">
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
