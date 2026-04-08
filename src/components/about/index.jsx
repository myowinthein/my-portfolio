import React from "react";
import Achievements from "./Achievements";
import Education from "./Education";
import Experience from "./Experience";
import PersonalInfo from "./PersonalInfo";
import Skills from "./Skills";
import Image from "next/image";

import { resumeURL, menuLabels } from "../../config";
import heroImgMobile from "../../../public/assets/img/hero/img-mobile.jpeg";

import htmlIcon from "../../../public/assets/img/programming/html.svg";
import markdownIcon from "../../../public/assets/img/programming/markdown.svg";
import cssIcon from "../../../public/assets/img/programming/css.svg";
import bootstrapIcon from "../../../public/assets/img/programming/bootstrap.svg";
import elementuiIcon from "../../../public/assets/img/programming/element-ui.svg";

import javaScriptIcon from "../../../public/assets/img/programming/javascript.svg";
import jqueryIcon from "../../../public/assets/img/programming/jquery.svg";
import vueIcon from "../../../public/assets/img/programming/vue.svg";
import nuxtIcon from "../../../public/assets/img/programming/nuxt.svg";
import reactIcon from "../../../public/assets/img/programming/react.svg";
import nextIcon from "../../../public/assets/img/programming/next.svg";

import phpIcon from "../../../public/assets/img/programming/php.svg";
import laravelIcon from "../../../public/assets/img/programming/laravel.svg";
import nodeIcon from "../../../public/assets/img/programming/node.svg";
import expressIcon from "../../../public/assets/img/programming/express.svg";
import dotnetIcon from "../../../public/assets/img/programming/dotnet.svg";

import jestIcon from "../../../public/assets/img/programming/jest.svg";
import phpunitIcon from "../../../public/assets/img/programming/phpunit.svg";

import opencartIcon from "../../../public/assets/img/programming/opencart.svg";
import bagistoIcon from "../../../public/assets/img/programming/bagisto.svg";
import moodleIcon from "../../../public/assets/img/programming/moodle.svg";

import mysqlIcon from "../../../public/assets/img/programming/mysql.svg";
import mariadbIcon from "../../../public/assets/img/programming/mariadb.svg";
import postgresqlIcon from "../../../public/assets/img/programming/postgresql.svg";
import microsoftSQLServerIcon from "../../../public/assets/img/programming/microsoft-sql-server.svg";
import redisIcon from "../../../public/assets/img/programming/redis.svg";

import dockerIcon from "../../../public/assets/img/programming/docker.svg";
import landoIcon from "../../../public/assets/img/programming/lando.svg";
import githubIcon from "../../../public/assets/img/programming/github.svg";
import gitlabIcon from "../../../public/assets/img/programming/gitlab.svg";
import herokuIcon from "../../../public/assets/img/programming/heroku.svg";
import vercelIcon from "../../../public/assets/img/programming/vercel.svg";
import netlifyIcon from "../../../public/assets/img/programming/netlify.svg";

import ec2Icon from "../../../public/assets/img/programming/ec2.svg";
import ebsIcon from "../../../public/assets/img/programming/ebs.svg";
import lightsailIcon from "../../../public/assets/img/programming/lightsail.svg";
import rdsIcon from "../../../public/assets/img/programming/rds.svg";
import sqsIcon from "../../../public/assets/img/programming/sqs.svg";
import sesIcon from "../../../public/assets/img/programming/ses.svg";
import elastictranscoderIcon from "../../../public/assets/img/programming/elastic_transcoder.svg";
import elasticcacheIcon from "../../../public/assets/img/programming/elasticcache.svg";
import s3Icon from "../../../public/assets/img/programming/s3.svg";
import cloudfrontIcon from "../../../public/assets/img/programming/cloudfront.svg";
import route53Icon from "../../../public/assets/img/programming/route53.svg";
import iamIcon from "../../../public/assets/img/programming/iam.svg";
import cloudwatchIcon from "../../../public/assets/img/programming/cloudwatch.svg";
import snsIcon from "../../../public/assets/img/programming/sns.svg";
import kmsIcon from "../../../public/assets/img/programming/kms.svg";

import npmIcon from "../../../public/assets/img/programming/npm.svg";
import yarnIcon from "../../../public/assets/img/programming/yarn.svg";
import composerIcon from "../../../public/assets/img/programming/composer.svg";

import windowsIcon from "../../../public/assets/img/programming/windows.svg";
import macosIcon from "../../../public/assets/img/programming/macos.svg";
import linuxIcon from "../../../public/assets/img/programming/linux.svg";

const index = () => {
  const skillSets = [
    {
      title: 'Backend',
      skills: [
        { icon: phpIcon, name: 'PHP', core: true },
        { icon: laravelIcon, name: 'Laravel', core: true },
        { icon: nodeIcon, name: 'Node.js' },
        { icon: expressIcon, name: 'Express.js' },
        // { icon: dotnetIcon, name: '.NET Framework' },
      ]
    },
    {
      title: 'DBMS',
      skills: [
        { icon: mysqlIcon, name: 'MySQL', core: true },
        { icon: redisIcon, name: 'Redis' },
        { icon: postgresqlIcon, name: 'PostgreSQL' },
        { icon: mariadbIcon, name: 'MariaDB' },
        { icon: microsoftSQLServerIcon, name: 'Microsoft SQL Server' },
      ]
    },
    {
      title: 'AWS',
      skills: [
        // Core infrastructure
        { icon: ec2Icon, name: 'EC2', core: true },
        { icon: rdsIcon, name: 'RDS', core: true },
        { icon: s3Icon, name: 'S3', core: true },
        { icon: cloudfrontIcon, name: 'CloudFront', core: true },
        { icon: route53Icon, name: 'Route53', core: true },
        { icon: iamIcon, name: 'IAM', core: true },

        // Frequently used services
        { icon: elasticcacheIcon, name: 'ElastiCache' },
        { icon: sqsIcon, name: 'SQS' },
        { icon: sesIcon, name: 'SES' },
        { icon: cloudwatchIcon, name: 'CloudWatch' },

        // Supporting / situational
        { icon: ebsIcon, name: 'EBS' },
        { icon: snsIcon, name: 'SNS' },
        { icon: kmsIcon, name: 'KMS' },
        { icon: lightsailIcon, name: 'Lightsail' },
        // { icon: elastictranscoderIcon, name: 'Elastic Transcoder' },
      ]
    },
    {
      title: 'DevOps',
      skills: [
        { icon: dockerIcon, name: 'Docker' },
        { icon: landoIcon, name: 'Lando' },
        { icon: githubIcon, name: 'GitHub Actions' },
        { icon: gitlabIcon, name: 'GitLab CI/CD' },
        { icon: herokuIcon, name: 'Heroku' },
        { icon: vercelIcon, name: 'Vercel' },
        { icon: netlifyIcon, name: 'Netlify' },
      ]
    },
    {
      'title': 'Frontend',
      'skills': [
        {'icon': javaScriptIcon, 'name': 'JavaScript'},
        {'icon': jqueryIcon, 'name': 'jQuery'},
        {'icon': vueIcon, 'name': 'Vue.js'},
        {'icon': nuxtIcon, 'name': 'Nuxt.js'},
        {'icon': reactIcon, 'name': 'React.js'},
        {'icon': nextIcon, 'name': 'Next.js'},
      ]
    },
    {
      'title': 'Markup & UI',
      'skills': [
        {'icon': htmlIcon, 'name': 'HTML'},
        {'icon': markdownIcon, 'name': 'Markdown'},
        {'icon': cssIcon, 'name': 'CSS'},
        {'icon': bootstrapIcon, 'name': 'Bootstrap'},
        {'icon': elementuiIcon, 'name': 'Element UI'},
      ]
    },
    {
      'title': 'Testing',
      'skills': [
        {'icon': phpunitIcon, 'name': 'PHPUnit'},
        {'icon': jestIcon, 'name': 'Jest'},
      ]
    },
    {
      'title': 'CMS',
      'skills': [
        {'icon': opencartIcon, 'name': 'OpenCart'},
        {'icon': bagistoIcon, 'name': 'Bagisto'},
        {'icon': moodleIcon, 'name': 'Moodle'},
      ]
    },
    {
      'title': 'Package Manager',
      'skills': [
        {'icon': composerIcon, 'name': 'Composer'},
        {'icon': npmIcon, 'name': 'npm'},
        {'icon': yarnIcon, 'name': 'Yarn'},
      ]
    },
    {
      'title': 'OS',
      'skills': [
        {'icon': linuxIcon, 'name': 'Linux'},
        {'icon': macosIcon, 'name': 'macOS'},
        {'icon': windowsIcon, 'name': 'Windows'},
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
                  personal info
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
                <a className="button" href={resumeURL} target="_blank" rel="noreferrer">
                  <span className="button-text">View Resume</span>
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
              Technical Skills
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
