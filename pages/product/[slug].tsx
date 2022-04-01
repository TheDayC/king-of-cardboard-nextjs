import React from 'react';

import Product from '../../components/Product';
import PageWrapper from '../../components/PageWrapper';

export const ProductPage: React.FC = () => {
    return (
        <PageWrapper title="Product - King of Cardboard" description={null}>
            <Product />
        </PageWrapper>
    );
};

export default ProductPage;
