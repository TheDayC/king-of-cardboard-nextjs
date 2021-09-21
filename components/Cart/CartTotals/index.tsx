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
                <td>Subtotal</td>
                <td align="right">{subTotal}</td>
            </tr>
            <tr>
                <td colSpan={3}>&nbsp;</td>
                <td>Tax</td>
                <td align="right">{taxes}</td>
            </tr>
            <tr>
                <td colSpan={3}>&nbsp;</td>
                <td>Total</td>
                <td align="right">{total}</td>
            </tr>
        </React.Fragment>
    );
};

export default CartTotals;
