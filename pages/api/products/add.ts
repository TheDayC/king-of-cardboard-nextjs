import { toNumber } from 'lodash';
import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

import { Category, Configuration, Interest, StockStatus } from '../../../enums/products';
import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { PriceHistory } from '../../../types/products';
import {
    parseAsArrayOfStrings,
    parseAsBoolean,
    parseAsNumber,
    parseAsString,
    safelyParse,
} from '../../../utils/parsers';

const defaultErr = 'Product could not be added.';

async function addProduct(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();

            const productsCollection = db.collection('products');
            const sku = safelyParse(req, 'body.sku', parseAsString, null);
            const existingProduct = await productsCollection.findOne({ sku });
            const currentDate = DateTime.now().setZone('Europe/London');
            const priceHistory: PriceHistory[] = req.body.priceHistory || [];

            if (existingProduct) {
                res.status(400).json({ message: 'Product already exists.' });
                return;
            }

            const releaseDate = safelyParse(req, 'body.releaseDate', parseAsString, null);

            await productsCollection.insertOne({
                sku,
                created: new Date(currentDate.toISO()),
                lastUpdated: new Date(currentDate.toISO()),
                userId: new ObjectId(safelyParse(req, 'body.userId', parseAsString, '')),
                title: safelyParse(req, 'body.title', parseAsString, null),
                slug: safelyParse(req, 'body.slug', parseAsString, null),
                content: safelyParse(req, 'body.content', parseAsString, null),
                mainImage: safelyParse(req, 'body.mainImage', parseAsString, null),
                gallery: safelyParse(req, 'body.gallery', parseAsArrayOfStrings, null),
                category: safelyParse(req, 'body.category', parseAsNumber, Category.Other),
                configuration: safelyParse(req, 'body.configuration', parseAsNumber, Configuration.Other),
                interest: safelyParse(req, 'body.interest', parseAsNumber, Interest.Other),
                stockStatus: safelyParse(req, 'body.stockStatus', parseAsNumber, StockStatus.OutOfStock),
                quantity: safelyParse(req, 'body.quantity', parseAsNumber, 0),
                price: safelyParse(req, 'body.price', parseAsNumber, 0),
                salePrice: safelyParse(req, 'body.salePrice', parseAsNumber, 0),
                priceHistory: priceHistory.map((pH) => ({
                    timestamp: new Date(pH.timestamp),
                    price: toNumber(pH.price),
                })),
                releaseDate: releaseDate ? new Date(releaseDate) : null,
                isInfinite: safelyParse(req, 'body.isInfinite', parseAsBoolean, false),
                metaTitle: safelyParse(req, 'body.metaTitle', parseAsString, ''),
                metaDescription: safelyParse(req, 'body.metaDescription', parseAsString, ''),
            });

            res.status(201).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default addProduct;
