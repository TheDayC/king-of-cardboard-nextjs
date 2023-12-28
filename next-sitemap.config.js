/** @type {import('next-sitemap').IConfig} */
const axios = require('axios');

module.exports = {
    siteUrl: 'https://www.kingofcardboard.co.uk/',
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
        '/blog',
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
        const res = await axios.post(
            'https://www.kingofcardboard.co.uk/api/products/list',
            {
                count: 9999,
                page: 0,
                categories: undefined,
                configurations: undefined,
                interests: undefined,
                stockStatuses: undefined,
                sortOption: undefined,
                searchTerm: undefined,
            },
            {
                headers: { 'Accept-Encoding': 'application/json' },
            }
        );
        const products = res.data.products;

        for (const path of paths) {
            if (config.transform) {
                result.push(await config.transform(config, path));
            }
        }

        for (const product of products) {
            const slug = product.slug;

            if (config.transform) {
                result.push(await config.transform(config, `/product/${slug}`));
            }
        }

        return result;
    },
};
