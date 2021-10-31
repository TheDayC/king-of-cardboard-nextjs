import React from 'react';
import { useRouter } from 'next/router';
import { get } from 'lodash';

import Header from '../../../components/Header';
import Break from '../../../components/Break';

export const BreakPage: React.FC = () => {
    const router = useRouter();
    const category = get(router, 'query.category', null);
    const slug = get(router, 'query.slug', null);

    return (
        <React.Fragment>
            <Header />
            {slug && <Break slug={slug} />}
        </React.Fragment>
    );
};

export default BreakPage;
