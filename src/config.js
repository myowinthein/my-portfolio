import { format } from "date-fns";

// personal information
export const name = 'Martin';
export const firstName = 'Myo Win';
export const lastName = 'Thein';
export const nationality = 'Myanmar';
export const careerSince = 2013;
export const email = 'myowinthein@protonmail.com';
export const languages = 'English, Burmese';
export const position = 'Full Stack Developer';
export const address = 'Bangkok, Thailand';
export const totalExperiences = format(new Date(), 'yyyy') - careerSince;
export const totalProjects = 23;
export const totalAPIs = 600;
export const totalPages = 200;

// links
export const resumeURL = 'https://drive.google.com/uc?export=download&id=1GXGGF_SNVm6FMNBKqhZ-I51G5SRFCfGG';
export const facebookURL = 'https://www.facebook.com/myowinthein91/';
export const instagramURL = 'https://www.instagram.com/myowinthein91/';
export const githubURL = 'https://github.com/myowinthein/';
export const mediumURL = 'https://myowinthein.medium.com/';
export const linkedinURL = 'https://www.linkedin.com/in/myowinthein/';
export const siteURL = process.env.SITE_URL

// meta
export const metaTitle = `"${name} - ${position} from ${nationality}"`
export const metaDescription = `Over ${totalExperiences} Years of Expertise in Software Engineering | Skilled in PHP, JavaScript, and Cloud Platforms.`
export const metaImage = 'https://drive.google.com/uc?export=view&id=1eAriXH-Qr9u6RMV0FNEnEhaXjXa8m0mY'

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