import { format } from "date-fns";
import { sentenceCase } from "../utils/text";

// personal information
export const firstName = 'Myo Win';
export const lastName = 'Thein';
export const careerSince = 2013;
export const workPreference = 'Remote / Hybrid';
export const focus = 'Backend, Cloud & System Architecture';
export const email = 'martin@myowin.dev';
export const languages = 'English (C1, Advanced), Burmese (Native)';
export const position = 'Senior Backend Engineer';
export const roleTags = ['Laravel', 'AWS', 'API Platforms'];
export const address = 'Bangkok, Thailand';
export const timezone = 'GMT+7';
export const totalExperiences = format(new Date(), 'yyyy') - careerSince;
export const totalPlatformTypes = 5;
export const totalDeliveredProjects = 14;

// links
export const resumeURL = 'https://drive.google.com/file/d/1GXGGF_SNVm6FMNBKqhZ-I51G5SRFCfGG/view?usp=sharing';
export const facebookURL = 'https://facebook.com/myowinthein91/';
export const instagramURL = 'https://instagram.com/myowinthein91/';
export const githubURL = 'https://github.com/myowinthein/';
export const mediumURL = 'https://myowinthein.medium.com/';
export const linkedinURL = 'https://linkedin.com/in/myowinthein/';
export const siteURL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://myowin.dev'

// navigation
export const menuLabels = {
  home: "Home",
  work: "Work",
  profile: "Profile",
  writing: "Writing",
  contact: "Contact",
};

// summary — first paragraph is reused as the SEO meta description
export const summary = [
  `Senior Backend Engineer / Technical Lead with 12+ years of hands-on backend and cloud engineering experience, specializing in Laravel/PHP systems, AWS infrastructure, and REST API platforms.`,
  `Strong background in legacy codebase modernization, backend system design, API-first development, database design and performance, production reliability, and CI/CD security across SaaS, education, enterprise, and government domains.`,
  `Most recently led backend delivery for a student-university matching platform through its acquisition, staying close to architecture and code while coordinating engineers.`,
];

// meta
export const metaTitle = `${firstName} ${lastName} — ${position}`
export const metaDescription = summary[0];
export const metaImage = `${siteURL}/assets/img/hero/meta.jpeg`

// contact — EmailJS service + reCAPTCHA v2 (public client-side keys; see CLAUDE.md)
export const emailjsServiceId = 'service_ymrfc1k';
export const emailjsTemplateId = 'template_vnchh1m';
export const emailjsPublicKey = 'qf-Hdel_0um8Wj7YK';
export const recaptchaSiteKey = '6LcUUFwsAAAAAKgz_JIK4HkIh-Z9SLy52-rd7gUw';

// toast
export const rssAPIKey = 'wsbd0emvqw0uvzb3hthc07qrovqki0jmdmxqs2z6'
export const toastOptions = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    theme: "colored",
}