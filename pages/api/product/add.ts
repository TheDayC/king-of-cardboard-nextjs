import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

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

            if (existingProduct) {
                res.status(400).json({ message: 'Product already exists.' });
                return;
            }

            await productsCollection.insertOne({
                sku: safelyParse(req, 'body.sku', parseAsString, null),
                created: safelyParse(req, 'body.created', parseAsString, null),
                lastUpdated: safelyParse(req, 'body.lastUpdated', parseAsString, null),
                userId: new ObjectId(safelyParse(req, 'body.userId', parseAsString, '')),
                title: safelyParse(req, 'body.title', parseAsString, null),
                slug: safelyParse(req, 'body.slug', parseAsString, null),
                content: safelyParse(req, 'body.content', parseAsString, null),
                imageId: safelyParse(req, 'body.imageId', parseAsString, null),
                galleryIds: safelyParse(req, 'body.galleryIds', parseAsArrayOfStrings, null),
                productType: safelyParse(req, 'body.productType', parseAsString, null),
                quantity: safelyParse(req, 'body.quantity', parseAsString, null),
                cost: safelyParse(req, 'body.cost', parseAsNumber, null),
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
