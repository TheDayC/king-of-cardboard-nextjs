export enum Category {
    Sports,
    TCG,
    Other,
}

export enum StockStatus {
    InStock,
    OutOfStock,
    Import,
    PreOrder,
}

export enum Configuration {
    Sealed,
    Singles,
    Packs,
    Other,
}

export enum Interest {
    Baseball,
    Basketball,
    Football,
    Soccer,
    UFC,
    Wrestling,
    Pokemon,
    Other,
}

export enum FilterType {
    Category,
    Configuration,
    Interest,
    StockStatus,
}

export type FilterValue = Category | Configuration | Interest | StockStatus;
