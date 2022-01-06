import React from 'react';

import PageWrapper from '../../components/PageWrapper';
import Shop from '../../components/Shop';

export const ShopPage: React.FC = () => (
    <PageWrapper>
        <Shop category={null} />
    </PageWrapper>
);

export default ShopPage;
