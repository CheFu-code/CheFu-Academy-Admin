/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://academy.chefuinc.com',
    generateRobotsTxt: true, // optional, generates robots.txt
    changefreq: 'weekly',
    priority: 0.8,
    robotsTxtOptions: {
        transformRobotsTxt: async (_config, robotsTxt) => {
            if (robotsTxt.includes('Content-Signal:')) {
                return robotsTxt;
            }

            return robotsTxt.replace(
                'Allow: /',
                'Allow: /\nContent-Signal: ai-train=no, search=yes, ai-input=yes',
            );
        },
    },
};
