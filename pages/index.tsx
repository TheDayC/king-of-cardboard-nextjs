import { Container } from '@mui/material';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import { setAccessToken, setExpires } from '../store/slices/global';
import { CommerceAuthProps } from '../types/commerce';

export const Home: React.FC<CommerceAuthProps> = ({ accessToken, expires }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setAccessToken(accessToken));
        dispatch(setExpires(expires));
    }, [dispatch, accessToken, expires]);

    return (
        <React.Fragment>
            <Header />
            <Container maxWidth="xl">
                <ProductGrid useFilters={false} />
            </Container>
        </React.Fragment>
    );
};

export default Home;
