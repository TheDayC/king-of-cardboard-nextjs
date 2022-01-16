import React from 'react';

import Product from '../../components/Product';
import PageWrapper from '../../components/PageWrapper';

export const ProductPage: React.FC = () => {
    return (
        <PageWrapper>
            <Product />
        </PageWrapper>
    );
};

export default ProductPage;
