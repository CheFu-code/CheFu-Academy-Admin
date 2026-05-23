/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://academy.chefuinc.com',
    generateRobotsTxt: true, // optional, generates robots.txt
    changefreq: 'weekly',
    priority: 0.8,
};
