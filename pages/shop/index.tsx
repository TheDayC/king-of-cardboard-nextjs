import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { fetchContent } from '../../utils/content';
import Header from '../../components/Header';
import Shop from '../../components/Shop';

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

export const ShopPage: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        fetchContent(QUERY).then((response) => {
            if (response) {
                const productCollection = response.data.data.productCollection;
                console.log('🚀 ~ file: index.tsx ~ line 34 ~ fetchContent ~ productCollection', productCollection);

                if (productCollection) {
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
