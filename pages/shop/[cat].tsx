import React from 'react';
import { useRouter } from 'next/router';
import { isString } from 'lodash';

import Header from '../../components/Header';
import ShopBody from '../../components/ShopBody';

export const Category: React.FC = () => {
    const router = useRouter();
    const { cat } = router.query;
    const category = isString(cat) ? cat : null;

    return (
        <React.Fragment>
            <Header />
            <ShopBody category={category} />
        </React.Fragment>
    );
};

export default Category;
