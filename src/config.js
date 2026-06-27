import { format } from "date-fns";
import { sentenceCase } from "../utils/text";

// personal information
export const firstName = 'Myo Win';
export const lastName = 'Thein';
export const careerSince = 2013;
export const workPreference = 'Remote / Hybrid';
export const focus = 'Backend, DevOps & System Architecture';
export const email = 'martin@myowin.dev';
export const languages = 'English, Burmese';
export const position = 'Senior Software Engineer';
export const roleTags = ['Product-Minded', 'Backend & Cloud'];
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
  `${sentenceCase(position)} with ${totalExperiences}+ years of experience building, modernizing, and operating business-critical software across SaaS, enterprise, and government domains.`,
  `I enjoy taking products from idea to production, combining backend engineering, cloud infrastructure, and pragmatic technical decisions to deliver simple, reliable, and maintainable solutions.`,
  `Deep experience in Laravel, AWS, distributed APIs, CI/CD, technical leadership, and AI-assisted engineering workflows.`,
];

// meta
export const metaTitle = `${firstName} ${lastName} — ${position}`
export const metaDescription = summary[0];
export const metaImage = `${siteURL}/assets/img/hero/meta.jpeg`

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