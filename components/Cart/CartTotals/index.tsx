import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import selector from './selector';
import {
    calculateSubtotal,
    calculateTaxes,
    calculateTotal,
    ccyFormat,
    calculateTaxPercentage,
} from '../../../utils/cart';
import { setTotals } from '../../../store/slices/checkout';

export const CartTotals: React.FC = () => {
    const { fullCartItemData, taxRate } = useSelector(selector);
    const dispatch = useDispatch();

    const subTotal = useMemo(() => calculateSubtotal(fullCartItemData), [fullCartItemData]);
    const taxes = useMemo(() => calculateTaxes(subTotal, taxRate), [subTotal, taxRate]);
    const total = useMemo(() => calculateTotal(subTotal, taxes), [subTotal, taxes]);

    useEffect(() => {
        dispatch(setTotals({ subTotal, taxes, total }));
    }, [subTotal, taxes, total]);

    return (
        <React.Fragment>
            <tr>
                <td colSpan={3}>&nbsp;</td>
                <td>Subtotal</td>
                <td align="right">&pound;{ccyFormat(subTotal)}</td>
            </tr>
            <tr>
                <td colSpan={3}>&nbsp;</td>
                <td>Tax</td>
                <td align="right">&pound;{`${ccyFormat(taxes)} (${calculateTaxPercentage(taxRate)})`}</td>
            </tr>
            <tr>
                <td colSpan={3}>&nbsp;</td>
                <td>Total</td>
                <td align="right">&pound;{ccyFormat(total)}</td>
            </tr>
        </React.Fragment>
    );
};

export default CartTotals;
