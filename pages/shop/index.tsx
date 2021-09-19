import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GetStaticProps } from 'next';

import { fetchContent } from '../../utils/content';
import Header from '../../components/Header';
import Shop from '../../components/Shop';
import { getCommerceAuth } from '../../utils/commerce';
import { CommerceAuthProps } from '../../types/commerce';
import { setAccessToken, setExpires } from '../../store/slices/global';
import { addProductCollection } from '../../store/slices/products';
import { normaliseProductCollection } from '../../utils/products';

export const getStaticProps: GetStaticProps = async () => {
    const tokenProps = await getCommerceAuth();

    if (tokenProps) {
        return tokenProps;
    } else {
        return {
            props: {}, // will be passed to the page component as props
        };
    }
};

const QUERY = `
    query {
        productCollection {
            items {
                name
                description {
                    json
                }
                productLink
            }
        }
    }
`;

export const ShopPage: React.FC<CommerceAuthProps> = ({ accessToken, expires }) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setAccessToken(accessToken));
        dispatch(setExpires(expires));
    }, [dispatch, accessToken, expires]);

    useEffect(() => {
        fetchContent(QUERY).then((response) => {
            if (response) {
                const productCollection = response.data.data.productCollection;

                if (productCollection) {
                    const normalisedCollections = normaliseProductCollection(productCollection.items);
                    console.log(
                        '🚀 ~ file: index.tsx ~ line 55 ~ fetchContent ~ normalisedCollections',
                        normalisedCollections
                    );
                    // TODO: Fetch product with product link and organise into correct data structure.
                    // dispatch(addProductCollection(productCollection));
                }
            }
        });
    }, []);

    return (
        <React.Fragment>
            <Header />
            <Shop category={null} />
        </React.Fragment>
    );
};

export default ShopPage;
