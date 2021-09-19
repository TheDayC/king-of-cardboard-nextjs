import React from 'react';
import { GetStaticProps } from 'next';

import Header from '../../components/Header';
import Cart from '../../components/Cart';
import { getCommerceAuth, initCommerceClient } from '../../utils/commerce';
import { CartStaticProps } from '../../types/cart';

export const getStaticProps: GetStaticProps = async () => {
    const token = await getCommerceAuth();
    const cl = token ? initCommerceClient(token.accessToken) : null;
    const order = cl ? await cl.orders.create({ guest: true }) : null;

    if (order) {
        return {
            props: {
                order,
            },
        };
    } else {
        return {
            props: {}, // will be passed to the page component as props
        };
    }
};

export const CartPage: React.FC<CartStaticProps> = ({ order }) => {
    console.log('🚀 ~ file: index.tsx ~ line 28 ~ order', order);
    return (
        <React.Fragment>
            <Header />
            <div className="container mx-auto p-8">
                <Cart />
            </div>
        </React.Fragment>
    );
};

export default CartPage;
