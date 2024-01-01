import React from 'react';
import { GetServerSideProps } from 'next';

import Cart from '../../components/Cart';
import PageWrapper from '../../components/PageWrapper';

export const getServerSideProps: GetServerSideProps = async () => {
    // Shutting up shop.
    return {
        redirect: {
            permanent: true,
            destination: '/',
        },
    };

    return {
        props: {},
    };
};

export const CartPage: React.FC = () => {
    return (
        <PageWrapper
            title="Cart - King of Cardboard"
            description="Add one of our cheap box break slots, sealed products or single cards to your cart."
        >
            <Cart />
        </PageWrapper>
    );
};

export default CartPage;
