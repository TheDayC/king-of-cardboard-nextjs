import React from 'react';
import { useRouter } from 'next/router';

import Shop from '../../components/Shop';
import PageWrapper from '../../components/PageWrapper';
import { parseAsString, safelyParse } from '../../utils/parsers';

export const Category: React.FC = () => {
    const router = useRouter();
    const category = safelyParse(router, 'query.cat', parseAsString, null);

    return (
        <PageWrapper title={`${category} - Shop - King of Cardboard`} description={`The ${category} shop category.`}>
            <Shop category={category} />
        </PageWrapper>
    );
};

export default Category;
