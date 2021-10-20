import React from 'react';
import { useRouter } from 'next/router';
import { get } from 'lodash';

import Header from '../../components/Header';
import { CommerceStaticProps } from '../../types/commerce';
import Product from '../../components/Product';

export const ProductPage: React.FC<CommerceStaticProps> = () => {
    const router = useRouter();
    const slug = get(router, 'query.slug', null);

    return (
        <React.Fragment>
            <Header />
            {slug && <Product slug={slug} />}
        </React.Fragment>
    );
};

export default ProductPage;
