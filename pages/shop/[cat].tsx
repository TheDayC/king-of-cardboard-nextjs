import React from 'react';
import { useRouter } from 'next/router';
import { isString } from 'lodash';

import Shop from '../../components/Shop';
import PageWrapper from '../../components/PageWrapper';

export const Category: React.FC = () => {
    const router = useRouter();
    const { cat } = router.query;
    const category = isString(cat) ? cat : null;

    return (
        <PageWrapper>
            <Shop category={category} />
        </PageWrapper>
    );
};

export default Category;
