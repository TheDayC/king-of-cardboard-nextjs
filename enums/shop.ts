export enum FilterTypes {
    ProductType,
    Category,
}

export enum ProductType {
    Sports = 'sports',
    TCG = 'tcg',
}

export enum Categories {
    Sealed = 'sealed',
    Singles = 'singles',
    Breaks = 'breaks',
}

export type combinedFilters = ProductType | Categories;
