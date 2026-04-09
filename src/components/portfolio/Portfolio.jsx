import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PortfolioData from "./portfolioData";
import Image from "next/image";
import PortfolioModal from "./PortfolioModal";

const Portfolio = () => {
  const [getModal, setGetModal] = useState(false);
  const [modalCategory, setModalCategory] = useState(1);
  const [modalProject, setModalProject] = useState(1);

  const handleModal = (category, project) => {
    setGetModal(true);
    setModalCategory(category);
    setModalProject(project);
  };

  return (
    <>
      <div className="portfolio-main">
        <Tabs>
          <TabList className="portfolio-tab-list" data-aos="fade-up">
            {PortfolioData.map((portfolio, i) => (
              <Tab key={i}>{portfolio.title}</Tab>
            ))}
          </TabList>

          <div className="container">
            {PortfolioData.map((portfolio, i) => (
              <TabPanel key={i}>
                <div className="tab-container-wrapper">

                  {/* Category one-liner */}
                  {portfolio.description && (
                    <p className="portfolio-category-desc" data-aos="fade-up">
                      {portfolio.description}
                    </p>
                  )}

                  <div className="tab-container">
                    {portfolio.projects.map((project, j) => (
                      <div key={j} className="project-item" data-aos="fade-right">
                        <div
                          className="tab-content"
                          onClick={() => handleModal(portfolio.title, project)}
                        >
                          <Image src={project.banner} alt="portfolio project" />
                          <h3>
                            <span className="conent-title">{project.product}</span>
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </TabPanel>
            ))}
          </div>
        </Tabs>
      </div>
      {getModal && <PortfolioModal modalCategory={modalCategory} modalProject={modalProject} setGetModal={setGetModal} />}{" "}
    </>
  );
};

export default Portfolio;
