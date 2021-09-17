import React from 'react';
import { useSelector } from 'react-redux';

import selector from './selector';
import { calculateTaxPercentage, ccyFormat } from '../../../../utils/cart';

export const PricingBreakdown: React.FC = () => {
    const { subTotal, taxes, total, taxRate } = useSelector(selector);

    return (
        <table className="table full-w" aria-label="basket table">
            <tbody>
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
            </tbody>
        </table>
    );
};

export default PricingBreakdown;
