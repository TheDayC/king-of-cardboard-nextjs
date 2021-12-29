import React from 'react';
import { useRouter } from 'next/router';

import Header from '../../components/Header';
import { CommerceStaticProps } from '../../types/commerce';
import Product from '../../components/Product';
import { parseAsString, safelyParse } from '../../utils/parsers';

export const ProductPage: React.FC<CommerceStaticProps> = () => {
    const router = useRouter();
    const slug = safelyParse(router, 'query.slug', parseAsString, null);

    return (
        <React.Fragment>
            <Header />
            {slug && <Product slug={slug} />}
        </React.Fragment>
    );
};

export default ProductPage;
