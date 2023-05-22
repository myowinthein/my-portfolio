import React from "react";
import Achievements from "./Achievements";
import Education from "./Education";
import Experience from "./Experience";
import PersonalInfo from "./PersonalInfo";
import Skills from "./Skills";
import { resumeURL } from "../../config";
import heroImgMobile from "../../../public/assets/img/hero/img-mobile.jpeg";
import Image from "next/image";

const index = () => {
  const skillSets = [
    {
      'title': 'Web Design',
      'skills': [
        {'icon': 'html.svg', 'name': 'HTML'},
        {'icon': 'markdown.svg', 'name': 'Markdown'},
        {'icon': 'css.svg', 'name': 'CSS'},
        {'icon': 'bootstrap.svg', 'name': 'Bootstrap'},
        {'icon': 'element-ui.svg', 'name': 'Element UI'},
      ]
    },
    {
      'title': 'Front-End',
      'skills': [
        {'icon': 'javaScript.svg', 'name': 'JavaScript'},
        {'icon': 'jquery.svg', 'name': 'jQuery'},
        {'icon': 'vue.svg', 'name': 'Vue.js'},
        {'icon': 'nuxt.svg', 'name': 'Nuxt.js'},
        {'icon': 'react.svg', 'name': 'React.js'},
        {'icon': 'next.svg', 'name': 'Next.js'},
      ]
    },
    {
      'title': 'Backend',
      'skills': [
        {'icon': 'php.svg', 'name': 'PHP'},
        {'icon': 'laravel.svg', 'name': 'Laravel'},
        {'icon': 'node.svg', 'name': 'Node.js'},
        {'icon': 'express.svg', 'name': 'Express.js'},
      ]
    },
    {
      'title': 'Testing',
      'skills': [
        {'icon': 'jest.svg', 'name': 'Jest'},
        {'icon': 'phpunit.svg', 'name': 'PHPUnit'},
      ]
    },
    {
      'title': 'CMS',
      'skills': [
        {'icon': 'opencart.svg', 'name': 'OpenCart'},
        {'icon': 'bagisto.svg', 'name': 'Bagisto'},
        {'icon': 'moodle.svg', 'name': 'Moodle'},
      ]
    },
    {
      'title': 'DBMS',
      'skills': [
        {'icon': 'mysql.svg', 'name': 'MySQL'},
        {'icon': 'mariadb.svg', 'name': 'MariaDB'},
        {'icon': 'postgresql.svg', 'name': 'PostgreSQL'},
        {'icon': 'redis.svg', 'name': 'Redis'},
      ]
    },
    {
      'title': 'DevOps',
      'skills': [
        {'icon': 'docker.svg', 'name': 'Docker'},
        {'icon': 'Lando.svg', 'name': 'Lando'},
        {'icon': 'github.svg', 'name': 'GitHub Actions'},
        {'icon': 'gitlab.svg', 'name': 'GitLab CI/CD'},
        {'icon': 'heroku.svg', 'name': 'Heroku'},
        {'icon': 'vercel.svg', 'name': 'Vercel'},
        {'icon': 'netlify.svg', 'name': 'Netlify'},
      ]
    },
    {
      'title': 'AWS',
      'skills': [
        {'icon': 'ec2.svg', 'name': 'EC2'},
        {'icon': 'ebs.svg', 'name': 'EBS'},
        {'icon': 'lightsail.svg', 'name': 'Lightsail'},
        {'icon': 'rds.svg', 'name': 'RDS'},
        {'icon': 'sqs.svg', 'name': 'SQS'},
        {'icon': 'ses.svg', 'name': 'SES'},
        {'icon': 'elastic_transcoder.svg', 'name': 'Elastic Transcoder'},
        {'icon': 'elasticcache.svg', 'name': 'ElastiCache'},
        {'icon': 's3.svg', 'name': 'S3'},
        {'icon': 'cloudfront.svg', 'name': 'CloudFront'},
        {'icon': 'route53.svg', 'name': 'Route53'},
        {'icon': 'iam.svg', 'name': 'IAM'},
        {'icon': 'cloudwatch.svg', 'name': 'CloudWatch'},
        {'icon': 'sns.svg', 'name': 'SNS'},
        {'icon': 'kms.svg', 'name': 'KMS'},
      ]
    },
    {
      'title': 'Package Manager',
      'skills': [
        {'icon': 'npm.svg', 'name': 'NPM'},
        {'icon': 'yarn.svg', 'name': 'Yarn'},
        {'icon': 'composer.svg', 'name': 'Composer'},
      ]
    },
    {
      'title': 'OS',
      'skills': [
        {'icon': 'windows.svg', 'name': 'Windows'},
        {'icon': 'macos.svg', 'name': 'macOS'},
        {'icon': 'ubuntu.svg', 'name': 'Ubuntu'},
        {'icon': 'fedora.svg', 'name': 'Fedora'},
        {'icon': 'centos.svg', 'name': 'CentOS'},
      ]
    },
  ]

  return (
    <section className="main-content" data-aos="fade-up">
      <div className="container">
        <div className="row">
          {/* Personal Info Starts */}
          <div className="col-xl-6 col-lg-5 col-12">
            <div className="row">
              <div className="col-12">
                <h3 className="text-uppercase custom-title mb-0 ft-wt-600">
                  personal infos
                </h3>
              </div>
              {/* End .col */}

              <div className="col-12 d-block d-sm-none">
                <Image
                  src={heroImgMobile}
                  className="img-fluid main-img-mobile"
                  alt="about avatar"
                />
              </div>
              {/* image for mobile menu */}

              <div className="col-12">
                <PersonalInfo />
              </div>
              {/* End personal info */}

              <div className="col-12 mt-1">
                <a className="button" href={resumeURL} download>
                  <span className="button-text">Download Resume</span>
                  <span className="button-icon fa fa-download"></span>
                </a>
              </div>
              {/* End download button */}
            </div>
          </div>
          {/*  Personal Info Ends */}

          {/*  Boxes Starts */}
          <div className="col-xl-6 col-lg-7 col-12 mt-5 mt-lg-0">
            <Achievements />
          </div>
          {/* Achievements Ends */}
        </div>
        {/* End .row */}

        <hr className="separator" />

        {/* Skills Starts */}
        <div className="row">
          <div className="col-12">
            <h3 className="text-uppercase pb-4 pb-sm-5 mb-3 mb-sm-0 text-start text-sm-center custom-title ft-wt-600">
              My Skills
            </h3>
          </div>
          <Skills skillSets={skillSets}/>
        </div>
        {/* Skills Ends */}

        <hr className="separator mt-1" />

        {/* Experience & Education Starts */}
        {/* <div className="row">
          <div className="col-12">
            <h3 className="text-uppercase pb-5 mb-0 text-start text-sm-center custom-title ft-wt-600">
              Experience <span>&</span> Education
            </h3>
          </div>
          <div className="col-lg-6 m-15px-tb">
            <div className="resume-box">
              <Experience />
            </div>
          </div>
          <div className="col-lg-6 m-15px-tb">
            <div className="resume-box">
              <Education />
            </div>
          </div>
        </div> */}





        <div className="row">
          <h3 className="text-uppercase pb-5 mb-0 text-center custom-title ft-wt-600">
            Experience & Education
          </h3>
          <div className="col-lg-6">
            <div className="resume-box m-15px-tb">
              <Experience />
            </div>
          </div>

          <div className="col-lg-6">
            <div className="resume-box m-15px-tb">
              <Education />
            </div>
          </div>
        </div>


        {/*  Experience & Education Ends */}
      </div>
    </section>
  );
};

export default index;
