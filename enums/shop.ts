export enum FilterTypes {
    ProductType,
    Category,
}

export enum ProductType {
    Sports = 'sports',
    TCG = 'tcg',
    Other = 'other',
    Baseball = 'baseball',
    Basketball = 'basketball',
    Football = 'football',
    Soccer = 'soccer',
    UFC = 'ufc',
    Wrestling = 'wrestling',
    Pokemon = 'pokemon',
}

export enum Categories {
    Sealed = 'sealed',
    Singles = 'singles',
    Packs = 'packs',
    Other = 'other',
}

export type combinedFilters = ProductType | Categories;
