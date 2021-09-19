import React from 'react';

import Header from '../../components/Header';
import Shop from '../../components/Shop';
import { CommerceStaticProps } from '../../types/commerce';

export const ShopPage: React.FC<CommerceStaticProps> = () => {
    return (
        <React.Fragment>
            <Header />
            <Shop category={null} />
        </React.Fragment>
    );
};

export default ShopPage;
