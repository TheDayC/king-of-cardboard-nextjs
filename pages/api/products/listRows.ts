import { NextApiRequest, NextApiResponse } from 'next';

import { Interest, StockStatus } from '../../../enums/products';
import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { parseAsNumber, safelyParse } from '../../../utils/parsers';

const defaultErr = 'No products found.';

async function listRows(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();

            const productsCollection = db.collection('products');
            const productList = await productsCollection
                .aggregate([
                    {
                        $facet: {
                            baseball: [
                                {
                                    $match: {
                                        $and: [
                                            { interest: Interest.Baseball },
                                            {
                                                $or: [
                                                    { stockStatus: StockStatus.InStock },
                                                    { stockStatus: StockStatus.PreOrder },
                                                ],
                                            },
                                        ],
                                    },
                                },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            basketball: [
                                {
                                    $match: {
                                        $and: [
                                            { interest: Interest.Basketball },
                                            {
                                                $or: [
                                                    { stockStatus: StockStatus.InStock },
                                                    { stockStatus: StockStatus.PreOrder },
                                                ],
                                            },
                                        ],
                                    },
                                },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            football: [
                                {
                                    $match: {
                                        $and: [
                                            { interest: Interest.Football },
                                            {
                                                $or: [
                                                    { stockStatus: StockStatus.InStock },
                                                    { stockStatus: StockStatus.PreOrder },
                                                ],
                                            },
                                        ],
                                    },
                                },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            soccer: [
                                {
                                    $match: {
                                        $and: [
                                            { interest: Interest.Soccer },
                                            {
                                                $or: [
                                                    { stockStatus: StockStatus.InStock },
                                                    { stockStatus: StockStatus.PreOrder },
                                                ],
                                            },
                                        ],
                                    },
                                },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            ufc: [
                                {
                                    $match: {
                                        $and: [
                                            { interest: Interest.UFC },
                                            {
                                                $or: [
                                                    { stockStatus: StockStatus.InStock },
                                                    { stockStatus: StockStatus.PreOrder },
                                                ],
                                            },
                                        ],
                                    },
                                },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            wrestling: [
                                {
                                    $match: {
                                        $and: [
                                            { interest: Interest.Wrestling },
                                            {
                                                $or: [
                                                    { stockStatus: StockStatus.InStock },
                                                    { stockStatus: StockStatus.PreOrder },
                                                ],
                                            },
                                        ],
                                    },
                                },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            tcg: [
                                {
                                    $match: {
                                        $and: [
                                            { interest: Interest.TCG },
                                            {
                                                $or: [
                                                    { stockStatus: StockStatus.InStock },
                                                    { stockStatus: StockStatus.PreOrder },
                                                ],
                                            },
                                        ],
                                    },
                                },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            other: [
                                {
                                    $match: {
                                        $and: [
                                            { interest: Interest.Other },
                                            {
                                                $or: [
                                                    { stockStatus: StockStatus.InStock },
                                                    { stockStatus: StockStatus.PreOrder },
                                                ],
                                            },
                                        ],
                                    },
                                },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                            f1: [
                                {
                                    $match: {
                                        $and: [
                                            { interest: Interest.F1 },
                                            {
                                                $or: [
                                                    { stockStatus: StockStatus.InStock },
                                                    { stockStatus: StockStatus.PreOrder },
                                                ],
                                            },
                                        ],
                                    },
                                },
                                { $sort: { created: -1 } },
                                { $limit: 4 },
                            ],
                        },
                    },
                ])
                .toArray();

            res.status(200).json(productList[0]);
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default listRows;
