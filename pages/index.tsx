import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GetStaticProps } from 'next';

import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import { setAccessToken, setExpires } from '../store/slices/global';
import { getCommerceAuth } from '../utils/commerce';
import { CommerceAuthProps } from '../types/commerce';

export const getStaticProps: GetStaticProps = async () => {
    const token = await getCommerceAuth();

    if (token) {
        return {
            props: token,
        };
    } else {
        return {
            props: {}, // will be passed to the page component as props
        };
    }
};

export const Home: React.FC<CommerceAuthProps> = ({ accessToken, expires }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setAccessToken(accessToken));
        dispatch(setExpires(expires));
    }, [dispatch, accessToken, expires]);

    return (
        <React.Fragment>
            <Header />
            <div className="container mx-auto px-16">
                <ProductGrid useFilters={false} />
            </div>
        </React.Fragment>
    );
};

export default Home;
