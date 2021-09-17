import { CartItem, Product } from '../store/types/state';
import { FullCartItem } from '../types/cart';

export function ccyFormat(num: number): string {
    return `${num.toFixed(2)}`;
}

export function createFullItemData(products: Product[], cart: CartItem[]): FullCartItem[] {
    const cartIds = cart.map((c) => c.id);
    const matchingProducts = products.filter((p) => cartIds.includes(p.id));

    const fullCartItemData: FullCartItem[] = matchingProducts.map((mP) => {
        const cartItem = cart.find((c) => c.id === mP.id);

        return {
            ...mP,
            amount: cartItem ? cartItem.amount : 0,
        };
    });

    return fullCartItemData;
}

export function calculateSubtotal(cartItems: FullCartItem[]): number {
    return cartItems.map(({ price, amount }) => price * amount).reduce((sum, currentValue) => sum + currentValue);
}

export function calculateTaxes(subTotal: number, taxRate: number): number {
    return taxRate * subTotal;
}

export function calculateTotal(subTotal: number, taxes: number): number {
    return taxes + subTotal;
}

export function calculateTaxPercentage(taxRate: number): string {
    return `${(taxRate * 100).toFixed(0)}%`;
}
