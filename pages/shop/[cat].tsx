import React from 'react';
import { useRouter } from 'next/router';
import { isString } from 'lodash';

import Header from '../../components/Header';
import Shop from '../../components/Shop';
import Footer from '../../components/Footer';

export const Category: React.FC = () => {
    const router = useRouter();
    const { cat } = router.query;
    const category = isString(cat) ? cat : null;

    return (
        <React.Fragment>
            <Header />
            <Shop category={category} />
            <Footer />
        </React.Fragment>
    );
};

export default Category;
