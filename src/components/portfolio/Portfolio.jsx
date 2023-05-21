import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PortfolioData from "./portfolioData";
import Image from "next/image";
import ModalMain from "./modal/ModalMain";

const Portfolio = () => {
  const [getModal, setGetModal] = useState(false);
  const [modalId, setModalId] = useState(1);

  const handleModal = (id) => {
    setGetModal(true);
    setModalId(id);
  };

  return (
    <>
      <div className="portfolio-main">
        <Tabs>
          <TabList className="portfolio-tab-list" data-aos="fade-up">
            {PortfolioData.map((portfoli, i) => (
              <Tab key={i}>{portfoli.title}</Tab>
            ))}
          </TabList>

          <div className="container">
            {PortfolioData.map((portfoli, i) => (
              <TabPanel key={i}>
                <div className="tab-container">
                  {portfoli.projects.map((project, j) => (
                    <div key={j} data-aos="fade-right">
                      <div className="tab-content" onClick={() => handleModal(j)}>
                        <Image src={project.thumbnail} alt="portfolio project demo" />
                        <h3><span className="conent-title">{project.title}</span></h3>
                      </div>
                    </div>
                  ))}
                </div>
              </TabPanel>
            ))}
          </div>
        </Tabs>
      </div>
      {/* {getModal && <ModalMain modalId={modalId} setGetModal={setGetModal} />}{" "} */}
    </>
  );
};

export default Portfolio;
