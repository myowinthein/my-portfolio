import React from "react";
import useExpandableList from "../../hooks/useExpandableList";

const experienceContent = [
  // StudyMe
  {
    companyName: "StudyMe, Australia · Remote from Bangkok, Thailand",
    companyInfo: "Melbourne-based AI-driven platform matching students with universities, acquired by Wellspring International.",
    positions: [
      {"position": "Technical Lead", "year": "Dec 2021 – Aug 2025"},
    ],
    details: [
      `Refactored a non-standard Laravel codebase into a versioned REST API architecture, adding service-repository layers, API resources, and a 330+ request Postman collection from scratch`,
      `Designed authentication, authorization, and payment workflows across the API platform, including JWT, social login, SSO, Stripe web checkout, and RevenueCat mobile subscriptions`,
      `Improved backend performance with query optimization, Redis caching, and SQS-backed workers, including 30+ custom commands, 20+ running on schedule`,
      `Built observability across the codebase and servers for StudyMe and Wellspring 2.0, pairing Bugsnag error tracking with CloudWatch infrastructure alarms`,
      `Secured RDS against brute-force login attempts spotted in logs with a self-hosted OpenVPN gateway, plus encryption across Elastic Beanstalk, S3, and SQS`,
      `Eliminated hardcoded AWS credentials via OIDC-based GitHub Actions deploys for frontend and IAM instance roles for backend application access to AWS`,
      `Defended against SMS toll fraud on OTP verification with Twilio carrier filtering, rate limiting, session tokens, and reCAPTCHA`,
      `Stopped fake-email signups from driving up SES bounce rates, gating login behind NeverBounce validation and signature-verified SNS webhooks`,
      `Founded and architected Wellspring 2.0, replacing an unsupportable legacy Blade stack with a decoupled Laravel API and React frontend, then provisioned AWS infrastructure and CI/CD`,
      `Guided implementation and QA for 7 developers through the Wellspring 2.0 rewrite, adding an RDS read replica and cutting the backend codebase roughly 23%`,
      `Linked StudyMe and Wellspring databases across separate AWS accounts and regions (US, AU) for read-only cross-platform school data, peering VPCs to cut latency`
    ]
  },

  // Snappymob
  {
    companyName: "Snappymob, Malaysia · Remote from Yangon, Myanmar",
    companyInfo: `Kuala Lumpur-based technology consultancy building web and mobile software for enterprise clients.`,
    positions: [
      {"position": "Full Stack Developer", "year": "Sep 2021 – Dec 2021"},
    ],
    details: [
      `Shipped backend integrations for Tavis, an online tuition platform on a customized Moodle CMS, implementing iPay88 payments and multi-provider social auth for web, mobile, and desktop`,
      `Identified limitations in the CMS-based system and proposed a custom backend structure, presenting technical trade-offs to the PM and CTO to support implementation decisions`
    ]
  },

  // Nexlabs
  {
    companyName: "Nexlabs · Yangon, Myanmar",
    companyInfo: `Digital consultancy delivering measurable web solutions through strategy, engineering and UX.`,
    positions: [
      {"position": "Head of Engineering (FastForward Product Initiative)", "year": "Dec 2020 – Sep 2021"},
      {"position": "Frontend & CMS Team Lead", "year": "Feb 2019 – Dec 2020"},
      {"position": "Senior Full Stack Developer", "year": "Aug 2018 – Feb 2019"},
      {"position": "Senior PHP Developer", "year": "Jun 2016 – Aug 2018"},
    ],
    details: [
      `Designed backend systems and API contracts across e-commerce, education, insurance, and civic platforms, translating domain needs into maintainable architecture`,
      `Delivered backend features for an insurance agency platform, including repository-service architecture, commission logic, KPI tracking, scheduled jobs, and external system integration`,
      `Integrated Myanmar-specific payment methods, including Wave Money and KBZ/2C2P card processing, extending checkout and transaction workflows for local e-commerce`,
      `Led 5–7 engineers across concurrent client projects, setting technical direction, unblocking delivery, reviewing code, and mentoring junior developers`,
      `Partnered with the CTO and cross-functional teams to define requirements, estimate effort, explain trade-offs, and coordinate backend delivery across client engagements`,
      `Promoted to lead FastForward, an internal e-commerce initiative, researching Bagisto and shared-database multi-tenancy while contributing a per-tenant analytics module`
    ]
  },

  // Global Wave Technology
  {
    companyName: "Global Wave Technology · Yangon, Myanmar",
    companyInfo: `Software company delivering retail and HR systems with web and multi-platform integration.`,
    positions: [
      {"position": "Senior Developer", "year": "Mar 2015 – Oct 2015"},
      {"position": "Developer", "year": "Apr 2014 – Mar 2015"},
      {"position": "Programmer", "year": "Mar 2013 – Apr 2014"},
      {"position": "Intern", "year": "Jan 2013 – Mar 2013"},
    ],
    details: [
      `Built eGovernment web applications for business licensing, building permits, and revenue services, enabling citizens to complete regulatory workflows online`,
      `Designed backend workflows with role-based access control, multi-stage approvals, and notification systems to support government operational processes`,
      `Developed C# systems for YCDC field operations, integrating ACR1252U smart card readers and Motorola MC3190-Z RFID/barcode handhelds for license and document tracking`
    ]
  },
];

const VISIBLE_COUNT = 3;

const Experience = () => {
  const { visible: visibleContent, showAll, toggle: toggleExperience } = useExpandableList(experienceContent, VISIBLE_COUNT);

  return (
    <>
      <ul>
        {visibleContent.map((val) => (
          <li key={val.companyName}>
            <div className="icon">
              <i className="fa fa-briefcase"></i>
            </div>

            {val.positions.map((item) => (
              <div key={item.year} className="exp-gutter">
                <small className="d-block text-uppercase">
                  {item.year}
                </small>
                <h5 className="poppins-font text-uppercase">
                  {item.position}
                </h5>
              </div>
            ))}

            <p className="place open-sans-font">
              {val.companyName}
            </p>

            {val.companyInfo && (
              <p className="open-sans-font text-gray mb-3 exp-company-info">
                {val.companyInfo}
              </p>
            )}

            {val.details.map((text) => (
              <p
                key={text}
                className="open-sans-font text-gray mb-3"
              >
                •&nbsp;&nbsp;{text}
              </p>
            ))}
          </li>
        ))}
      </ul>
      <div className="exp-toggle-area">
        <button
          className="exp-toggle-btn open-sans-font"
          onClick={toggleExperience}
        >
          {showAll ? (
            <><i className="fa fa-chevron-up"></i> Show less</>
          ) : (
            <><i className="fa fa-chevron-down"></i> Show earlier experience</>
          )}
        </button>
      </div>
    </>
  );
};

export default Experience;
