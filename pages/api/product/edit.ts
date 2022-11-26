import { DateTime } from 'luxon';
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

const defaultErr = 'Product could not be updated.';

async function editProduct(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'PUT') {
        try {
            const { db } = await connectToDatabase();

            const productsCollection = db.collection('products');
            const sku = safelyParse(req, 'body.sku', parseAsString, null);
            const existingProduct = await productsCollection.findOne({ sku });
            const currentDate = DateTime.now().setZone('Europe/London');

            if (!existingProduct) {
                res.status(400).json({ message: 'Product does not exist.' });
                return;
            }

            await productsCollection.updateOne(
                { sku },
                {
                    $set: {
                        sku: safelyParse(req, 'body.sku', parseAsString, existingProduct.sku),
                        created: existingProduct.created,
                        lastUpdated: currentDate.toISO(),
                        userId: new ObjectId(safelyParse(req, 'body.userId', parseAsString, existingProduct.userId)),
                        title: safelyParse(req, 'body.title', parseAsString, existingProduct.title),
                        slug: safelyParse(req, 'body.slug', parseAsString, existingProduct.slug),
                        content: safelyParse(req, 'body.content', parseAsString, existingProduct.content),
                        imageId: safelyParse(req, 'body.imageId', parseAsString, existingProduct.imageId),
                        galleryIds: safelyParse(
                            req,
                            'body.galleryIds',
                            parseAsArrayOfStrings,
                            existingProduct.galleryIds
                        ),
                        productType: safelyParse(req, 'body.productType', parseAsString, existingProduct.productType),
                        quantity: safelyParse(req, 'body.quantity', parseAsString, existingProduct.quantity),
                        cost: safelyParse(req, 'body.cost', parseAsNumber, existingProduct.cost),
                        isInfinite: safelyParse(req, 'body.isInfinite', parseAsBoolean, existingProduct.isInfinite),
                    },
                }
            );

            res.status(201).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default editProduct;
