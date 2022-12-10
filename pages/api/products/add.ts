import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { ProductType } from '../../../enums/products';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
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

            if (existingProduct) {
                res.status(400).json({ message: 'Product already exists.' });
                return;
            }

            await productsCollection.insertOne({
                sku,
                created: currentDate.toISO(),
                lastUpdated: currentDate.toISO(),
                userId: new ObjectId(safelyParse(req, 'body.userId', parseAsString, '')),
                title: safelyParse(req, 'body.title', parseAsString, null),
                slug: safelyParse(req, 'body.slug', parseAsString, null),
                content: safelyParse(req, 'body.content', parseAsString, null),
                mainImage: safelyParse(req, 'body.mainImage', parseAsString, null),
                gallery: safelyParse(req, 'body.gallery', parseAsArrayOfStrings, null),
                productType: safelyParse(req, 'body.productType', parseAsNumber, ProductType.Other),
                quantity: safelyParse(req, 'body.quantity', parseAsNumber, 0),
                price: safelyParse(req, 'body.price', parseAsNumber, 0),
                salePrice: safelyParse(req, 'body.salePrice', parseAsNumber, 0),
                isInfinite: safelyParse(req, 'body.isInfinite', parseAsBoolean, false),
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
