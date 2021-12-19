import React from 'react';

import Header from '../../components/Header';
import Cart from '../../components/Cart';

export const CartPage: React.FC = () => {
    return (
        <React.Fragment>
            <Header />
            <div className="container mx-auto p-4 lg:p-8">
                <Cart />
            </div>
        </React.Fragment>
    );
};

export default CartPage;
