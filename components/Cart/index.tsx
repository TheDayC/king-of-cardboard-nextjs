import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import {
    Button,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';

import selector from './selector';
import CartItem from './CartItem';
import CartTotals from './CartTotals';

export const Cart: React.FC = () => {
    const { cartItemCount, items } = useSelector(selector);
    const dispatch = useDispatch();

    const itemPlural = cartItemCount === 1 ? 'item' : 'items';

    return (
        <Stack spacing={2} direction="column">
            <Typography variant="h1">{`Your basket (${cartItemCount} ${itemPlural})`}</Typography>
            {cartItemCount > 0 ? (
                <TableContainer className="overflow-x-auto">
                    <Table className="table w-full">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Remove</TableCell>
                                <TableCell align="center">Product</TableCell>
                                <TableCell align="center">Price</TableCell>
                                <TableCell align="center">Quantity</TableCell>
                                <TableCell align="center">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items &&
                                items.map((item) => (
                                    <CartItem
                                        id={item.id}
                                        sku={item.sku_code || null}
                                        name={item.name || null}
                                        unitAmount={item.formatted_unit_amount || null}
                                        totalAmount={item.formatted_total_amount || null}
                                        quantity={item.quantity || null}
                                        key={item.name}
                                    />
                                ))}
                            <CartTotals />
                            <TableRow>
                                <TableCell align="right" colSpan={5}>
                                    <Button component={Link} href="/checkout">
                                        Checkout
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <p>
                    You have no items in your basket, start shopping <Link href="/shop">here</Link>.
                </p>
            )}
        </Stack>
    );
};

export default Cart;
