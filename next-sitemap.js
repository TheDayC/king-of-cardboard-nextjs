module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
    generateRobotsTxt: true,
    robotsTxtOptions: [{ userAgent: '*', disallow: '/' }],
    exclude: [
        '/account/*',
        '/checkout/*',
        '/confirmation',
        '/confirmation/*',
        '/resetPassword',
        '/resetPassword/*',
        '/selector',
        '/500',
        '/404',
    ],
};
