import React from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Hero from "../components/hero/Hero";
import AboutMain from "../components/about";
import Wrapper from "../layout/wrapper";
import SEO from "../components/Seo";
import Portfolio from "../components/portfolio/Portfolio";
import Address from "../components/Address";
import Social from "../components/Social";
import Contact from "../components/Contact";
import Blog from "../components/blog/Blog";
import SwitchDark from "../components/switch/SwitchDark";
import { firstName, lastName, menuLabels } from "../config";

const menuItem = [
  { icon: "fa-home", menuName: menuLabels.home },
  { icon: "fa-briefcase", menuName: menuLabels.work },
  { icon: "fa-user", menuName: menuLabels.profile },
  { icon: "fa-pen-nib", menuName: menuLabels.writing },
  { icon: "fa-envelope-open", menuName: menuLabels.contact },
];

const TabTitle = ({ bg, children }) => (
  <div className="title-section text-center" data-aos="fade-up" data-aos-duration="1200">
    <h1>{children}</h1>
    <span className="title-bg">{bg}</span>
  </div>
);

const HomeDark = () => {
  return (
    <Wrapper>
      <SEO pageTitle={`${firstName} ${lastName}`} />

      <div className="yellow">
        <SwitchDark />
        {/* End Switcher */}
        <Tabs>
          <div className="header">
            <TabList className=" icon-menu  revealator-slideup revealator-once revealator-delay1">
              {menuItem.map((item) => (
                <Tab className="icon-box" key={item.menuName}>
                  <i className={`fa ${item.icon}`}></i>
                  <span>{item.menuName}</span>
                </Tab>
              ))}
            </TabList>
          </div>
          {/* End Menu Content */}

          <div className="tab-panel_list">
            {/* Hero Content Starts */}
            <TabPanel className="home ">
              <div
                className="container-fluid main-container container-home p-0 g-0"
                data-aos="fade-up"
                data-aos-duration="1200"
              >
                <div className="color-block d-none d-lg-block"></div>
                <Hero />
              </div>
            </TabPanel>
            {/* Hero Content Ends */}

            {/* Portfolio Content Starts */}
            <TabPanel className="portfolio professional">
              <TabTitle bg={menuLabels.work}>
                selected <span>projects</span>
              </TabTitle>
              <Portfolio />
            </TabPanel>
            {/* Portfolio Content Ends */}

            {/* About Content Starts */}
            <TabPanel className="about">
              <TabTitle bg={menuLabels.profile}>
                About <span>Me</span>
              </TabTitle>
              <AboutMain />
            </TabPanel>
            {/* About Content Ends */}

            {/* Blog Content Starts */}
            <TabPanel className="blog">
              <TabTitle bg={menuLabels.writing}>
                my <span>posts</span>
              </TabTitle>
              <div
                className="container"
                data-aos="fade-up"
                data-aos-duration="1200"
              >
                {/*  Articles Starts  */}
                <div className="row pb-50">
                  <Blog />
                </div>
                {/* Articles Ends */}
              </div>
            </TabPanel>
            {/* Blog Content Ends */}

            {/* Contact Content Starts */}
            <TabPanel className="contact">
              <TabTitle bg={menuLabels.contact}>
                get in <span>touch</span>
              </TabTitle>
              <div
                className="container"
                data-aos="fade-up"
                data-aos-duration="1200"
              >
                <div className="row">
                  {/*  Left Side Starts */}
                  <div className="col-12 col-lg-4">
                    <h3 className="text-uppercase custom-title mb-0 ft-wt-600 pb-3">
                      LET&rsquo;S CONNECT
                    </h3>
                    <p className="open-sans-font mb-4">
                      If you&rsquo;d like to discuss an opportunity, a project, or have a question, feel free to reach out. I&rsquo;m always open to thoughtful conversations and new ideas.
                    </p>
                    <Address />
                    {/* End Address */}

                    <Social />
                    {/* End Social */}
                  </div>
                  {/* Left Side Ends */}

                  {/*  Contact Form Starts  */}
                  <div className="col-12 col-lg-8">
                    <Contact />
                  </div>
                  {/*  Contact Form Ends */}
                </div>
              </div>
              {/* End .container */}
            </TabPanel>
            {/* Contact Content Ends */}
          </div>
        </Tabs>
      </div>
    </Wrapper>
  );
};

export default HomeDark;
