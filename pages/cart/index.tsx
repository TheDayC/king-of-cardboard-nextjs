import React from 'react';
import { Container } from '@mui/material';

import Header from '../../components/Header';
import Cart from '../../components/Cart';

export const CartPage: React.FC = () => {
    return (
        <React.Fragment>
            <Header />
            <Container maxWidth="xl">
                <Cart />
            </Container>
        </React.Fragment>
    );
};

export default CartPage;
