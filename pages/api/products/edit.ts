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

const defaultErr = 'Product could not be updated.';

async function editProduct(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'PUT') {
        try {
            const { db } = await connectToDatabase();

            const productsCollection = db.collection('products');
            const id = safelyParse(req, 'body.id', parseAsString, '');
            const existingProduct = await productsCollection.findOne({ _id: new ObjectId(id) });
            const currentDate = DateTime.now().setZone('Europe/London');

            if (!existingProduct) {
                res.status(400).json({ message: 'Product does not exist.' });
                return;
            }

            const priceHistory: PriceHistory[] = req.body.priceHistory
                ? req.body.priceHistory.map((pH: PriceHistory) => ({
                      timestamp: new Date(pH.timestamp),
                      price: toNumber(pH.price),
                  }))
                : existingProduct.priceHistory;

            const releaseDate = safelyParse(req, 'body.releaseDate', parseAsString, null);

            await productsCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        sku: safelyParse(req, 'body.sku', parseAsString, existingProduct.sku),
                        lastUpdated: new Date(currentDate.toISO()),
                        userId: new ObjectId(safelyParse(req, 'body.userId', parseAsString, existingProduct.userId)),
                        title: safelyParse(req, 'body.title', parseAsString, existingProduct.title),
                        slug: safelyParse(req, 'body.slug', parseAsString, existingProduct.slug),
                        content: safelyParse(req, 'body.content', parseAsString, existingProduct.content),
                        mainImage: safelyParse(req, 'body.mainImage', parseAsString, existingProduct.mainImage),
                        gallery: safelyParse(req, 'body.gallery', parseAsArrayOfStrings, existingProduct.gallery),
                        category: safelyParse(req, 'body.category', parseAsNumber, Category.Other),
                        configuration: safelyParse(req, 'body.configuration', parseAsNumber, Configuration.Other),
                        interest: safelyParse(req, 'body.interest', parseAsNumber, Interest.Other),
                        stockStatus: safelyParse(req, 'body.stockStatus', parseAsNumber, StockStatus.OutOfStock),
                        quantity: safelyParse(req, 'body.quantity', parseAsNumber, existingProduct.quantity),
                        price: safelyParse(req, 'body.price', parseAsNumber, existingProduct.price),
                        salePrice: safelyParse(req, 'body.salePrice', parseAsNumber, existingProduct.salePrice),
                        priceHistory: priceHistory.map((pH) => ({
                            timestamp: new Date(pH.timestamp),
                            price: toNumber(pH.price),
                        })),
                        releaseDate: releaseDate ? new Date(releaseDate) : null,
                        isInfinite: safelyParse(req, 'body.isInfinite', parseAsBoolean, existingProduct.isInfinite),
                        metaTitle: safelyParse(req, 'body.metaTitle', parseAsString, existingProduct.metaTitle),
                        metaDescription: safelyParse(
                            req,
                            'body.metaDescription',
                            parseAsString,
                            existingProduct.metaDescription
                        ),
                    },
                }
            );

            res.status(204).end();
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default editProduct;
