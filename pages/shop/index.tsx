import React from 'react';

import PageWrapper from '../../components/PageWrapper';
import Shop from '../../components/Shop';
import { CommerceStaticProps } from '../../types/commerce';

export const ShopPage: React.FC<CommerceStaticProps> = () => (
    <PageWrapper>
        <Shop category={null} />
    </PageWrapper>
);

export default ShopPage;
