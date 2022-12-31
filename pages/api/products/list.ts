import { NextApiRequest, NextApiResponse } from 'next';
import { SortOption } from '../../../enums/products';

import { connectToDatabase } from '../../../middleware/database';
import { errorHandler } from '../../../middleware/errors';
import { buildProductListMongoQueryValues } from '../../../utils/account/database';
import { getSortQuery } from '../../../utils/account/products';
import { parseAsArrayOfNumbers, parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';

const defaultErr = 'No products found.';

async function listProducts(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === 'POST') {
        try {
            const { db } = await connectToDatabase();

            const productsCollection = db.collection('products');
            const count = safelyParse(req, 'body.count', parseAsNumber, 10);
            const page = safelyParse(req, 'body.page', parseAsNumber, 0);
            const categories = safelyParse(req, 'body.categories', parseAsArrayOfNumbers, null);
            const interests = safelyParse(req, 'body.interests', parseAsArrayOfNumbers, null);
            const configurations = safelyParse(req, 'body.configurations', parseAsArrayOfNumbers, null);
            const stockStatuses = safelyParse(req, 'body.stockStatuses', parseAsArrayOfNumbers, null);
            const searchTerm = safelyParse(req, 'body.searchTerm', parseAsString, null);
            const sortOption = safelyParse(req, 'body.sortOption', parseAsNumber, SortOption.DateAddedDesc);
            const query = buildProductListMongoQueryValues(categories, interests, configurations, stockStatuses);
            const searchQuery =
                searchTerm && searchTerm.length > 0
                    ? {
                          $text: {
                              $search: searchTerm,
                              $caseSensitive: false,
                          },
                      }
                    : {};
            const sortQuery = getSortQuery(sortOption);

            const productCount = await productsCollection.countDocuments(query);
            const productList = await productsCollection
                .find(
                    {
                        ...query,
                        ...searchQuery,
                    },
                    { skip: page, limit: count, sort: sortQuery }
                )
                .toArray();

            res.status(200).json({ products: productList, count: productCount });
        } catch (err: unknown) {
            const status = safelyParse(err, 'response.status', parseAsNumber, 500);

            res.status(status).json(errorHandler(err, defaultErr));
        }

        return Promise.resolve();
    }
}

export default listProducts;
