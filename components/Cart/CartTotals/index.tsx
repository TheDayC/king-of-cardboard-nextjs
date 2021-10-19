import React from 'react';
import { useSelector } from 'react-redux';

import selector from './selector';

interface CartTotalsProps {
    isConfirmation: boolean;
}

export const CartTotals: React.FC<CartTotalsProps> = ({ isConfirmation }) => {
    const { cartOrder, confirmationOrder } = useSelector(selector);
    const order = isConfirmation ? confirmationOrder : cartOrder;

    const subTotal = order && order.formatted_subtotal_amount ? order.formatted_subtotal_amount : null;
    // const discount = order && order.formatted_discount_amount ? order.formatted_discount_amount : null;
    const shipping = order && order.formatted_shipping_amount ? order.formatted_shipping_amount : null;
    const total = order && order.formatted_total_amount_with_taxes ? order.formatted_total_amount_with_taxes : null;

    return (
        <React.Fragment>
            <tr>
                <td colSpan={3}>&nbsp;</td>
                <td className="text-sm">Subtotal</td>
                <td align="right" className="text-sm">
                    {subTotal}
                </td>
            </tr>
            <tr>
                <td colSpan={3}>&nbsp;</td>
                <td className="text-sm">Shipping</td>
                <td align="right" className="text-sm">
                    {shipping}
                </td>
            </tr>
            <tr>
                <td colSpan={3}>&nbsp;</td>
                <td className="text-xl font-semibold">Total</td>
                <td align="right" className="text-xl font-semibold">
                    {total}
                </td>
            </tr>
        </React.Fragment>
    );
};

export default CartTotals;
