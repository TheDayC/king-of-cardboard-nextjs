import { TableCell, TableRow } from '@mui/material';
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
            <TableRow>
                <TableCell rowSpan={3} />
                <TableCell colSpan={2}>Subtotal</TableCell>
                <TableCell align="right">{subTotal}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>Tax</TableCell>
                <TableCell align="right">{taxes}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell align="right">{total}</TableCell>
            </TableRow>
        </React.Fragment>
    );
};

export default CartTotals;
