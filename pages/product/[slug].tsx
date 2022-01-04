import React from 'react';
import { useRouter } from 'next/router';

import { CommerceStaticProps } from '../../types/commerce';
import Product from '../../components/Product';
import { parseAsString, safelyParse } from '../../utils/parsers';
import PageWrapper from '../../components/PageWrapper';

export const ProductPage: React.FC<CommerceStaticProps> = () => {
    const router = useRouter();
    const slug = safelyParse(router, 'query.slug', parseAsString, '');

    return (
        <PageWrapper>
            <Product slug={slug} />
        </PageWrapper>
    );
};

export default ProductPage;
