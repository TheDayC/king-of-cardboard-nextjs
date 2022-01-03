import React from 'react';

import Header from '../../components/Header';
import Cart from '../../components/Cart';
import Footer from '../../components/Footer';

export const CartPage: React.FC = () => {
    return (
        <React.Fragment>
            <Header />
            <div className="flex flex-col w-full bg-primary-content">
                <div className="container mx-auto p-4 lg:p-8">
                    <Cart />
                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
};

export default CartPage;
