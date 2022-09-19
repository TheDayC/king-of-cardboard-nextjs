export enum FilterTypes {
    ProductType,
    Category,
}

export enum ProductType {
    Sports = 'sports',
    TCG = 'tcg',
    Other = 'other',
    Basketball = 'basketball',
    Football = 'football',
    Soccer = 'soccer',
    UFC = 'ufc',
    WWE = 'wwe',
    Pokemon = 'pokemon',
}

export enum Categories {
    Sealed = 'sealed',
    Singles = 'singles',
    Packs = 'packs',
    Other = 'other',
}

export type combinedFilters = ProductType | Categories;
