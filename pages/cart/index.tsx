import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setNavValue } from '../../store/slices/global';
import Header from '../../components/Header';
import Cart from '../../components/Cart';

export const CartPage: React.FC = () => {
    return (
        <React.Fragment>
            <Header />
            <Cart />
        </React.Fragment>
    );
};

export default CartPage;
