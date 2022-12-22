import { isArray } from '../typeguards';

interface SearchInQuery {
    [key: string]: {
        $in: number[];
    };
}

export function buildProductListMongoQueryValues(
    categories: number[] | null,
    interests: number[] | null,
    configurations: number[] | null
): SearchInQuery {
    const queryValues = [
        {
            key: 'category',
            value: categories,
        },
        {
            key: 'interest',
            value: interests,
        },
        {
            key: 'configuration',
            value: configurations,
        },
    ];
    const query: SearchInQuery = {};

    queryValues.forEach(({ key, value }) => {
        if (isArray(value)) {
            query[key] = { $in: value };
        }
    });

    return query;
}
