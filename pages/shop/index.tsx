import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GetStaticProps } from 'next';

import Header from '../../components/Header';
import Shop from '../../components/Shop';
import { getCommerceAuth, initCommerceClient } from '../../utils/commerce';
import { CommerceStaticProps } from '../../types/commerce';
import { setAccessToken, setExpires } from '../../store/slices/global';
import { addProductCollection } from '../../store/slices/products';
import { fetchProductCollection } from '../../utils/products';
import { PRODUCT_QUERY } from '../../utils/content';

export const getStaticProps: GetStaticProps = async () => {
    const token = await getCommerceAuth();
    const cl = token ? initCommerceClient(token.accessToken) : null;
    const stockItems = cl ? await cl.stock_items.list() : null;
    const prices = cl ? await cl.prices.list() : null;
    const products = await fetchProductCollection(PRODUCT_QUERY, stockItems, prices);

    if (token && products) {
        return {
            props: {
                ...token,
                products: products,
            },
        };
    } else {
        return {
            props: {}, // will be passed to the page component as props
        };
    }
};

export const ShopPage: React.FC<CommerceStaticProps> = ({ accessToken, expires, products }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setAccessToken(accessToken));
        dispatch(setExpires(expires));
    }, [dispatch, accessToken, expires]);

    useEffect(() => {
        dispatch(addProductCollection(products));
    }, [dispatch, products]);

    return (
        <React.Fragment>
            <Header />
            <Shop category={null} />
        </React.Fragment>
    );
};

export default ShopPage;
