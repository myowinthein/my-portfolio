/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://myowin.dev',
    generateRobotsTxt: true,
    exclude: ['/home-dark'],
    changefreq: 'monthly',
    priority: 0.7,
}