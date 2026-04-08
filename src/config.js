import { format } from "date-fns";

// personal information
export const name = 'Martin';
export const firstName = 'Myo Win';
export const lastName = 'Thein';
export const nationality = 'Myanmar';
export const careerSince = 2013;
export const workPreference = 'Remote / Hybrid';
export const focus = 'Backend, DevOps & System Architecture';
export const email = 'martin@myowin.dev';
export const languages = 'English, Burmese';
export const position = 'Senior Backend Engineer';
export const address = 'Bangkok, Thailand';
export const timezone = 'UTC+7';
export const totalExperiences = format(new Date(), 'yyyy') - careerSince;
export const totalPlatformTypes = 5;
export const totalDeliveredProjects = 14;

// links
export const resumeURL = 'https://drive.google.com/file/d/1GXGGF_SNVm6FMNBKqhZ-I51G5SRFCfGG/view?usp=sharing';
export const facebookURL = 'https://www.facebook.com/myowinthein91/';
export const instagramURL = 'https://www.instagram.com/myowinthein91/';
export const githubURL = 'https://github.com/myowinthein/';
export const mediumURL = 'https://myowinthein.medium.com/';
export const linkedinURL = 'https://www.linkedin.com/in/myowinthein/';
export const siteURL = process.env.SITE_URL

// navigation
export const menuLabels = {
  home: "Home",
  work: "Work",
  profile: "Profile",
  writing: "Writing",
  contact: "Contact",
};

// meta
export const metaTitle = `${firstName} ${lastName} — ${position}`
export const metaDescription = `${position} with over ${totalExperiences} years of experience building and operating production web platforms. Strong in PHP/Laravel, backend systems, and AWS infrastructure.`;
export const metaImage = siteURL + 'assets/img/hero/meta.jpeg'

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