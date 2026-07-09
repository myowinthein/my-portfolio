import React from "react";
import Achievements from "./Achievements";
import Education from "./Education";
import Experience from "./Experience";
import PersonalInfo from "./PersonalInfo";
import Skills from "./Skills";
import { resumeURL, menuLabels } from "../../config";

import htmlIcon from "../../../public/assets/img/programming/html.svg";
import cssIcon from "../../../public/assets/img/programming/css.svg";
import bootstrapIcon from "../../../public/assets/img/programming/bootstrap.svg";
import tailwindIcon from "../../../public/assets/img/programming/tailwind.svg";
import elementuiIcon from "../../../public/assets/img/programming/element-plus.svg";

import javaScriptIcon from "../../../public/assets/img/programming/javascript.svg";
import typescriptIcon from "../../../public/assets/img/programming/typescript.svg";
import vueIcon from "../../../public/assets/img/programming/vue.svg";
import nuxtIcon from "../../../public/assets/img/programming/nuxt.svg";
import reactIcon from "../../../public/assets/img/programming/react.svg";
import nextIcon from "../../../public/assets/img/programming/next.svg";

import phpIcon from "../../../public/assets/img/programming/php.svg";
import laravelIcon from "../../../public/assets/img/programming/laravel.svg";
import nodeIcon from "../../../public/assets/img/programming/node.svg";
import expressIcon from "../../../public/assets/img/programming/express.svg";
import csharpIcon from "../../../public/assets/img/programming/csharp.svg";

import jestIcon from "../../../public/assets/img/programming/jest.svg";
import phpunitIcon from "../../../public/assets/img/programming/phpunit.svg";
import eslintIcon from "../../../public/assets/img/programming/eslint.svg";
import prettierIcon from "../../../public/assets/img/programming/prettier.svg";

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
import nginxIcon from "../../../public/assets/img/programming/nginx.svg";
import apacheIcon from "../../../public/assets/img/programming/apache.svg";

import ec2Icon from "../../../public/assets/img/programming/ec2.svg";
import ebsIcon from "../../../public/assets/img/programming/ebs.svg";
import rdsIcon from "../../../public/assets/img/programming/rds.svg";
import sqsIcon from "../../../public/assets/img/programming/sqs.svg";
import sesIcon from "../../../public/assets/img/programming/ses.svg";
import elasticcacheIcon from "../../../public/assets/img/programming/elasticcache.svg";
import s3Icon from "../../../public/assets/img/programming/s3.svg";
import cloudfrontIcon from "../../../public/assets/img/programming/cloudfront.svg";
import route53Icon from "../../../public/assets/img/programming/route53.svg";
import iamIcon from "../../../public/assets/img/programming/iam.svg";
import cloudwatchIcon from "../../../public/assets/img/programming/cloudwatch.svg";
import snsIcon from "../../../public/assets/img/programming/sns.svg";
import kmsIcon from "../../../public/assets/img/programming/kms.svg";

import linuxIcon from "../../../public/assets/img/programming/linux.svg";

const skillSets = [
    {
      title: 'Backend',
      skills: [
        { icon: phpIcon, name: 'PHP', core: true },
        { icon: laravelIcon, name: 'Laravel', core: true },
        { icon: nodeIcon, name: 'Node.js' },
        { icon: expressIcon, name: 'Express.js' },
        { icon: csharpIcon, name: 'C#' },
      ]
    },
    {
      title: 'Frontend',
      skills: [
        { icon: vueIcon, name: 'Vue.js', core: true },
        { icon: nuxtIcon, name: 'Nuxt.js', core: true },
        { icon: reactIcon, name: 'React.js' },
        { icon: nextIcon, name: 'Next.js' },
        { icon: javaScriptIcon, name: 'JavaScript', core: true },
        { icon: typescriptIcon, name: 'TypeScript' },
        { icon: htmlIcon, name: 'HTML' },
        { icon: cssIcon, name: 'CSS' },
        { icon: tailwindIcon, name: 'Tailwind CSS' },
        { icon: bootstrapIcon, name: 'Bootstrap' },
        { icon: elementuiIcon, name: 'Element Plus' },
      ]
    },
    {
      title: 'Databases',
      skills: [
        { icon: mysqlIcon, name: 'MySQL', core: true },
        { icon: mariadbIcon, name: 'MariaDB' },
        { icon: postgresqlIcon, name: 'PostgreSQL', core: true },
        { icon: microsoftSQLServerIcon, name: 'Microsoft SQL Server' },
        { icon: redisIcon, name: 'Redis' },
      ]
    },
    {
      title: 'Cloud (AWS)',
      skills: [
        { icon: ec2Icon, name: 'EC2', core: true },
        { icon: ebsIcon, name: 'EBS', core: true },
        { icon: rdsIcon, name: 'RDS', core: true },
        { icon: s3Icon, name: 'S3', core: true },
        { icon: cloudfrontIcon, name: 'CloudFront', core: true },
        { icon: route53Icon, name: 'Route53', core: true },
        { icon: iamIcon, name: 'IAM', core: true },
        { icon: sqsIcon, name: 'SQS' },
        { icon: snsIcon, name: 'SNS' },
        { icon: sesIcon, name: 'SES' },
        { icon: elasticcacheIcon, name: 'ElastiCache' },
        { icon: cloudwatchIcon, name: 'CloudWatch' },
        { icon: kmsIcon, name: 'KMS' },
      ]
    },
    {
      title: 'DevOps & CI/CD',
      skills: [
        { icon: dockerIcon, name: 'Docker' },
        { icon: githubIcon, name: 'GitHub Actions' },
        { icon: gitlabIcon, name: 'GitLab CI/CD' },
        { icon: linuxIcon, name: 'Linux' },
        { icon: nginxIcon, name: 'Nginx' },
        { icon: apacheIcon, name: 'Apache' },
        { icon: landoIcon, name: 'Lando' },
        { icon: vercelIcon, name: 'Vercel' },
        { icon: netlifyIcon, name: 'Netlify' },
        { icon: herokuIcon, name: 'Heroku' },
      ]
    },
    {
      title: 'Testing & Code Quality',
      skills: [
        { icon: phpunitIcon, name: 'PHPUnit' },
        { icon: jestIcon, name: 'Jest' },
        { icon: eslintIcon, name: 'ESLint' },
        { icon: prettierIcon, name: 'Prettier' },
      ]
    },
    {
      title: 'CMS',
      skills: [
        { icon: moodleIcon, name: 'Moodle' },
        { icon: opencartIcon, name: 'OpenCart' },
        { icon: bagistoIcon, name: 'Bagisto' },
      ]
    },
];

const About = () => {
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

        {/* Experience Starts */}
        <div className="row">
          <div className="col-12">
            <h3 className="text-uppercase pb-4 pb-sm-5 mb-3 mb-sm-0 text-center custom-title ft-wt-600">
              Experience
            </h3>
          </div>
          <div className="col-12">
            <div className="resume-box experience-timeline">
              <Experience />
            </div>
          </div>
        </div>
        {/* Experience Ends */}

        <hr className="separator" />

        {/* Skills Starts */}
        <div className="row">
          <div className="col-12">
            <h3 className="text-uppercase pb-4 pb-sm-5 mb-3 mb-sm-0 text-center custom-title ft-wt-600">
              Technical Skills
            </h3>
          </div>
          <Skills skillSets={skillSets}/>
        </div>
        {/* Skills Ends */}

        <hr className="separator" />

        {/* Education Starts */}
        <div className="row">
          <div className="col-12">
            <h3 className="text-uppercase pb-4 pb-sm-5 mb-3 mb-sm-0 text-center custom-title ft-wt-600">
              Education
            </h3>
          </div>
          <div className="col-12">
            <div className="edu-list">
              <Education />
            </div>
          </div>
        </div>
        {/* Education Ends */}
      </div>
    </section>
  );
};

export default About;
