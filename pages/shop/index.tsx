import React from 'react';

import PageWrapper from '../../components/PageWrapper';
import Shop from '../../components/Shop';

export const ShopPage: React.FC = () => (
    <PageWrapper
        title="Shop - King of Cardboard"
        description="A broad selection of sports and trading card singles and sealed products."
    >
        <Shop category={null} />
    </PageWrapper>
);

export default ShopPage;
