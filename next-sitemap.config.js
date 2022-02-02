module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '',
    generateRobotsTxt: true,
    robotsTxtOptions: {
        policies: [{ userAgent: '*', allow: '/' }],
    },
    exclude: [
        '/account/*',
        '/account/*',
        '/checkout',
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
