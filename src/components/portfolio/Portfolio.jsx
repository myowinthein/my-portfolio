import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PortfolioData from "./portfolioData";
import Image from "next/image";
import PortfolioModal from "./PortfolioModal";

const Portfolio = () => {
  const [modal, setModal] = useState(null);

  const handleModal = (category, project) => {
    setModal({ category, project });
  };

  const closeModal = () => setModal(null);

  return (
    <>
      <div className="portfolio-main">
        <Tabs>
          <TabList className="portfolio-tab-list" data-aos="fade-up">
            {PortfolioData.map((portfolio) => (
              <Tab key={portfolio.title}>{portfolio.title}</Tab>
            ))}
          </TabList>

          <div className="container">
            {PortfolioData.map((portfolio) => (
              <TabPanel key={portfolio.title}>
                <div className="tab-container-wrapper">

                  {/* Category one-liner */}
                  {portfolio.description && (
                    <p className="portfolio-category-desc" data-aos="fade-up">
                      {portfolio.description}
                    </p>
                  )}

                  <div className="tab-container">
                    {portfolio.projects.map((project, i) => (
                      <div
                        key={project.product}
                        className="project-item"
                        data-aos="fade-right"
                        role="button"
                        tabIndex={0}
                        onClick={() => handleModal(portfolio.title, project)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleModal(portfolio.title, project); } }}
                      >
                        <div className="tab-content">
                          <Image src={project.banner} alt={project.product} sizes="(max-width: 575px) 100vw, (max-width: 992px) 50vw, 33vw" priority={i < 3} />
                          <h3>
                            <span className="content-title">View Case Study</span>
                          </h3>
                        </div>
                        <div className="project-meta">
                          <p className="project-meta__product poppins-font">{project.product}</p>
                          <p className="project-meta__role open-sans-font">{project.role}</p>
                          <p className="project-meta__company open-sans-font">{project.company}</p>
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
      {modal && <PortfolioModal key={modal.project.product} modalCategory={modal.category} modalProject={modal.project} setGetModal={closeModal} />}
    </>
  );
};

export default Portfolio;
