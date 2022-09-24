const contentful = require('contentful');

module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '',
    generateRobotsTxt: true,
    generateIndexSitemap: true,
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
    additionalPaths: async (config) => {
        const paths = [
            '/information/what-is-king-of-cardboard',
            '/information/break-info',
            '/information/collecting',
            '/information/investing',
            '/information/rarities-parallels-patches-and-autographs',
            '/information/roadmap',
            '/customer-service/faq',
            '/customer-service/shipping-and-delivery',
            '/customer-service/returns-and-exchanges',
            '/legal/terms-and-conditions',
            '/legal/privacy-policy',
        ];
        const result = [];
        const client = contentful.createClient({
            space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
            accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_TOKEN || '',
            environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENV || '',
        });
        const products = await client.getEntries({
            content_type: 'product',
            limit: 1000,
        });

        for (const path of paths) {
            result.push(await config.transform(config, path));
        }

        for (const product of products.items) {
            const slug = product.fields.slug;

            result.push(await config.transform(config, `/product/${slug}`));
        }

        return result;
    },
};
