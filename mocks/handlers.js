import { rest } from 'msw';

export const handlers = [
    rest.get('/api/getAccessToken', (req, res, ctx) => {
        return res(
            // Respond with a 200 status code
            ctx.status(200),

            // Send back the token data.
            ctx.json({
                token: 'thisisatesttoken',
                expires: 571,
            })
        );
    }),

    rest.post('/api/content/fetchContent', (req, res, ctx) => {
        return res(
            // Respond with a 200 status code
            ctx.status(200),

            // Send back the token data.
            ctx.json({
                content: {
                    productCollection: {
                        items: [
                            {
                                name: 'Snapcaster Mage 2',
                                slug: 'snapcaster-mage-2',
                                description:
                                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis enim efficitur, egestas nunc non, suscipit quam. Integer ultrices consectetur tristique. Vivamus molestie porttitor tincidunt. Proin eleifend nec orci sed mollis. Fusce dignissim massa ut ipsum auctor cursus. Praesent venenatis, elit nec pretium vestibulum, diam justo bibendum magna, et venenatis magna leo a libero. Aenean ex metus, vehicula a mauris non, luctus sodales massa. Pellentesque eu ullamcorper sem. Mauris bibendum augue sed egestas auctor. Sed laoreet dolor non enim finibus ornare. Curabitur vel nisi ut ipsum dignissim placerat sed non augue. Nam ut dapibus libero. Cras eget elementum mi. Quisque egestas, diam sit amet sodales cursus, sapien orci tempor magna, eu tincidunt dolor nisi vel sapien. Sed libero arcu, mollis non leo non, gravida suscipit tellus.\n\nNullam ornare lorem arcu, nec ornare quam dictum eget. Nunc nec metus mauris. Vivamus tempus metus ullamcorper odio cursus condimentum. Vivamus viverra aliquam porta. Praesent vel est quis nisl viverra lacinia non nec mi. Morbi accumsan neque id felis feugiat, et consectetur elit maximus. Maecenas quis nibh et metus vulputate sodales vitae vel erat. Proin quis quam quis eros sodales porta. Ut at massa a lacus placerat facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                                productLink: 'SNG-MTG-ISD-79',
                                types: ['tcg'],
                                categories: ['singles'],
                                imageCollection: {
                                    items: [
                                        {
                                            title: 'Snapcaster Mage Image',
                                            description: 'Snapcaster Image - Mythic',
                                            url: 'https://images.ctfassets.net/qeycwswfx7l5/2kbHu8rLe29JJfyW0BNeok/a255e93328fd26f93c454a200afe727c/uma-71-snapcaster-mage.png',
                                        },
                                    ],
                                },
                                cardImage: {
                                    title: 'Snapcaster Mage Image',
                                    description: 'Snapcaster Image - Mythic',
                                    url: 'https://images.ctfassets.net/qeycwswfx7l5/2kbHu8rLe29JJfyW0BNeok/a255e93328fd26f93c454a200afe727c/uma-71-snapcaster-mage.png',
                                    width: 745,
                                    height: 1040,
                                },
                                tags: ['Single', 'New'],
                            },
                            {
                                name: 'Snapcaster Mage',
                                slug: 'snapcaster-mage',
                                description:
                                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis enim efficitur, egestas nunc non, suscipit quam. Integer ultrices consectetur tristique. Vivamus molestie porttitor tincidunt. Proin eleifend nec orci sed mollis. Fusce dignissim massa ut ipsum auctor cursus. Praesent venenatis, elit nec pretium vestibulum, diam justo bibendum magna, et venenatis magna leo a libero. Aenean ex metus, vehicula a mauris non, luctus sodales massa. Pellentesque eu ullamcorper sem. Mauris bibendum augue sed egestas auctor. Sed laoreet dolor non enim finibus ornare. Curabitur vel nisi ut ipsum dignissim placerat sed non augue. Nam ut dapibus libero. Cras eget elementum mi. Quisque egestas, diam sit amet sodales cursus, sapien orci tempor magna, eu tincidunt dolor nisi vel sapien. Sed libero arcu, mollis non leo non, gravida suscipit tellus.\n\nNullam ornare lorem arcu, nec ornare quam dictum eget. Nunc nec metus mauris. Vivamus tempus metus ullamcorper odio cursus condimentum. Vivamus viverra aliquam porta. Praesent vel est quis nisl viverra lacinia non nec mi. Morbi accumsan neque id felis feugiat, et consectetur elit maximus. Maecenas quis nibh et metus vulputate sodales vitae vel erat. Proin quis quam quis eros sodales porta. Ut at massa a lacus placerat facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
                                productLink: 'SNG-MTG-ISD-78',
                                types: ['tcg'],
                                categories: ['singles'],
                                imageCollection: {
                                    items: [
                                        {
                                            title: 'Snapcaster Mage Image',
                                            description: 'Snapcaster Image - Mythic',
                                            url: 'https://images.ctfassets.net/qeycwswfx7l5/2kbHu8rLe29JJfyW0BNeok/a255e93328fd26f93c454a200afe727c/uma-71-snapcaster-mage.png',
                                        },
                                    ],
                                },
                                cardImage: {
                                    title: 'Snapcaster Mage Image',
                                    description: 'Snapcaster Image - Mythic',
                                    url: 'https://images.ctfassets.net/qeycwswfx7l5/2kbHu8rLe29JJfyW0BNeok/a255e93328fd26f93c454a200afe727c/uma-71-snapcaster-mage.png',
                                    width: 745,
                                    height: 1040,
                                },
                                tags: ['Single', 'New'],
                            },
                        ],
                    },
                },
            })
        );
    }),

    rest.get('https://king-of-cardboard.commercelayer.io/api/skus/*', (req, res, ctx) => {
        const params = req.url.params;
        //?filter[q][code_in]=SNG-MTG-ISD-79,SNG-MTG-ISD-78&filter[q][stock_items_quantity_gt]=0&include=prices&fields[skus]=id,code&fields[prices]=sku_code,formatted_amount,formatted_compare_at_amount
        if (params) {
            return res(
                ctx.status(200),
                ctx.json({
                    data: [
                        {
                            id: 'WPwySjLzGZ',
                            type: 'skus',
                            links: {
                                self: 'https://king-of-cardboard.commercelayer.io/api/skus/WPwySjLzGZ',
                            },
                            attributes: {
                                code: 'SNG-MTG-ISD-78',
                            },
                            meta: {
                                mode: 'test',
                                organization_id: 'WnZPoFrqLy',
                            },
                        },
                        {
                            id: 'ZbpjSNKNXg',
                            type: 'skus',
                            links: {
                                self: 'https://king-of-cardboard.commercelayer.io/api/skus/ZbpjSNKNXg',
                            },
                            attributes: {
                                code: 'SNG-MTG-ISD-79',
                            },
                            meta: {
                                mode: 'test',
                                organization_id: 'WnZPoFrqLy',
                            },
                        },
                    ],
                    included: [
                        {
                            id: 'pmnyUQrlBA',
                            type: 'prices',
                            links: {
                                self: 'https://king-of-cardboard.commercelayer.io/api/prices/pmnyUQrlBA',
                            },
                            attributes: {
                                sku_code: 'SNG-MTG-ISD-78',
                                formatted_amount: '£200.00',
                                formatted_compare_at_amount: '£200.00',
                            },
                            meta: {
                                mode: 'test',
                                organization_id: 'WnZPoFrqLy',
                            },
                        },
                        {
                            id: 'AzOWUWOxGy',
                            type: 'prices',
                            links: {
                                self: 'https://king-of-cardboard.commercelayer.io/api/prices/AzOWUWOxGy',
                            },
                            attributes: {
                                sku_code: 'SNG-MTG-ISD-79',
                                formatted_amount: '£60.00',
                                formatted_compare_at_amount: '£70.00',
                            },
                            meta: {
                                mode: 'test',
                                organization_id: 'WnZPoFrqLy',
                            },
                        },
                    ],
                    meta: {
                        record_count: 2,
                        page_count: 1,
                    },
                    links: {
                        first: 'https://king-of-cardboard.commercelayer.io/api/skus?fields%5Bprices%5D=sku_code%2Cformatted_amount%2Cformatted_compare_at_amount&fields%5Bskus%5D=id%2Ccode&filter%5Bq%5D%5Bcode_in%5D=SNG-MTG-ISD-79%2CSNG-MTG-ISD-78&filter%5Bq%5D%5Bstock_items_quantity_gt%5D=0&include=prices&page%5Bnumber%5D=1&page%5Bsize%5D=10',
                        last: 'https://king-of-cardboard.commercelayer.io/api/skus?fields%5Bprices%5D=sku_code%2Cformatted_amount%2Cformatted_compare_at_amount&fields%5Bskus%5D=id%2Ccode&filter%5Bq%5D%5Bcode_in%5D=SNG-MTG-ISD-79%2CSNG-MTG-ISD-78&filter%5Bq%5D%5Bstock_items_quantity_gt%5D=0&include=prices&page%5Bnumber%5D=1&page%5Bsize%5D=10',
                    },
                })
            );
        }
    }),
];
