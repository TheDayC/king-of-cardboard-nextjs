import React from 'react';
import { useSelector } from 'react-redux';

import selector from './selector';

export const CartTotals: React.FC = () => {
    const { order } = useSelector(selector);

    const subTotal = order && order.formatted_subtotal_amount ? order.formatted_subtotal_amount : null;
    const taxes = order && order.formatted_total_tax_amount ? order.formatted_total_tax_amount : null;
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
                <td className="text-sm">Tax</td>
                <td align="right" className="text-sm">
                    {taxes}
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
