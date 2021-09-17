import { Categories, ProductType } from '../../enums/shop';
import { Product } from '../types/state';

const productsInitialState: Product[] = [
    {
        id: 0,
        name: 'Product 1',
        price: 20,
        stock: 10,
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec elementum laoreet est, mattis lobortis nibh vulputate sit amet. Nullam quis neque lectus. Sed sapien lectus, scelerisque vitae ullamcorper et, pretium non nulla. Etiam et dapibus orci. Pellentesque fermentum quam et nibh ullamcorper fringilla. Vestibulum non magna commodo, maximus arcu porta, consequat magna. Nunc luctus faucibus ex et hendrerit. Sed egestas, est non consequat imperdiet, neque massa molestie nibh, ac hendrerit mi neque vitae risus. Nullam placerat nisi lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis elementum odio eu nisi tristique aliquam. Proin sollicitudin mollis leo ac lobortis.',
        types: [ProductType.Sports],
        categories: [Categories.Sealed],
    },
    {
        id: 1,
        name: 'Product 2',
        price: 10,
        stock: 5,
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec elementum laoreet est, mattis lobortis nibh vulputate sit amet. Nullam quis neque lectus. Sed sapien lectus, scelerisque vitae ullamcorper et, pretium non nulla. Etiam et dapibus orci. Pellentesque fermentum quam et nibh ullamcorper fringilla. Vestibulum non magna commodo, maximus arcu porta, consequat magna. Nunc luctus faucibus ex et hendrerit. Sed egestas, est non consequat imperdiet, neque massa molestie nibh, ac hendrerit mi neque vitae risus. Nullam placerat nisi lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis elementum odio eu nisi tristique aliquam. Proin sollicitudin mollis leo ac lobortis.',
        types: [ProductType.TCG],
        categories: [Categories.Sealed],
    },
    {
        id: 2,
        name: 'Product 3',
        price: 50,
        stock: 2,
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec elementum laoreet est, mattis lobortis nibh vulputate sit amet. Nullam quis neque lectus. Sed sapien lectus, scelerisque vitae ullamcorper et, pretium non nulla. Etiam et dapibus orci. Pellentesque fermentum quam et nibh ullamcorper fringilla. Vestibulum non magna commodo, maximus arcu porta, consequat magna. Nunc luctus faucibus ex et hendrerit. Sed egestas, est non consequat imperdiet, neque massa molestie nibh, ac hendrerit mi neque vitae risus. Nullam placerat nisi lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis elementum odio eu nisi tristique aliquam. Proin sollicitudin mollis leo ac lobortis.',
        types: [ProductType.Sports],
        categories: [Categories.Singles],
    },
    {
        id: 3,
        name: 'Product 4',
        price: 50,
        stock: 6,
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec elementum laoreet est, mattis lobortis nibh vulputate sit amet. Nullam quis neque lectus. Sed sapien lectus, scelerisque vitae ullamcorper et, pretium non nulla. Etiam et dapibus orci. Pellentesque fermentum quam et nibh ullamcorper fringilla. Vestibulum non magna commodo, maximus arcu porta, consequat magna. Nunc luctus faucibus ex et hendrerit. Sed egestas, est non consequat imperdiet, neque massa molestie nibh, ac hendrerit mi neque vitae risus. Nullam placerat nisi lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis elementum odio eu nisi tristique aliquam. Proin sollicitudin mollis leo ac lobortis.',
        types: [ProductType.TCG],
        categories: [Categories.Singles],
    },
    {
        id: 4,
        name: 'Product 5',
        price: 2.5,
        stock: 8,
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec elementum laoreet est, mattis lobortis nibh vulputate sit amet. Nullam quis neque lectus. Sed sapien lectus, scelerisque vitae ullamcorper et, pretium non nulla. Etiam et dapibus orci. Pellentesque fermentum quam et nibh ullamcorper fringilla. Vestibulum non magna commodo, maximus arcu porta, consequat magna. Nunc luctus faucibus ex et hendrerit. Sed egestas, est non consequat imperdiet, neque massa molestie nibh, ac hendrerit mi neque vitae risus. Nullam placerat nisi lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis elementum odio eu nisi tristique aliquam. Proin sollicitudin mollis leo ac lobortis.',
        types: [ProductType.Sports, ProductType.TCG],
        categories: [Categories.Breaks],
    },
];

export default productsInitialState;
