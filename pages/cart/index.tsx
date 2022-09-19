import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useDispatch } from 'react-redux';

import Cart from '../../components/Cart';
import PageWrapper from '../../components/PageWrapper';
import { createToken } from '../../utils/auth';
import { CreateToken } from '../../types/commerce';
import { setAccessToken, setExpires } from '../../store/slices/global';

export const getServerSideProps: GetServerSideProps = async () => {
    const accessToken = await createToken();

    return {
        props: {
            errorCode: !accessToken ? 500 : null,
            accessToken,
        },
    };
};

interface CartProps {
    accessToken: CreateToken;
}

export const CartPage: React.FC<CartProps> = ({ accessToken }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setAccessToken(accessToken.token));
        dispatch(setExpires(accessToken.expires));
    }, [dispatch, accessToken]);

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
