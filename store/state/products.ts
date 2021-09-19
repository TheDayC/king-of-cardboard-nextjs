import { Categories, ProductType } from '../../enums/shop';
import { Product } from '../types/state';

const productsInitialState: Product[] = [
    {
        id: '0',
        name: 'Product 1',
        price: 20,
        stock: 10,
        description: [
            {
                data: {},
                marks: [],
                nodeType: 'text',
                value: 'A stock description',
            },
        ],
        types: [ProductType.Sports],
        categories: [Categories.Sealed],
    },
    {
        id: '1',
        name: 'Product 2',
        price: 10,
        stock: 5,
        description: [
            {
                data: {},
                marks: [],
                nodeType: 'text',
                value: 'A stock description 2',
            },
        ],
        types: [ProductType.Sports],
        categories: [Categories.Sealed],
    },
    {
        id: '2',
        name: 'Product 3',
        price: 5,
        stock: 2,
        description: [
            {
                data: {},
                marks: [],
                nodeType: 'text',
                value: 'A stock description 3',
            },
        ],
        types: [ProductType.Sports],
        categories: [Categories.Sealed],
    },
];

export default productsInitialState;
