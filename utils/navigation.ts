import { ProductType } from '../enums/shop';

export function getCategoryTabIndex(cat: string): number | null {
    switch (cat) {
        case ProductType.Sports:
            return 2;
        case ProductType.TCG:
            return 3;
        default:
            return null;
    }
}
