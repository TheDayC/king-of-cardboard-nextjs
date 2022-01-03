import React from 'react';
import { useRouter } from 'next/router';

import Header from '../../../components/Header';
import Break from '../../../components/Break';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import Footer from '../../../components/Footer';

export const BreakPage: React.FC = () => {
    const router = useRouter();
    const slug = safelyParse(router, 'query.slug', parseAsString, null);

    return (
        <React.Fragment>
            <Header />
            {slug && <Break slug={slug} />}
            <Footer />
        </React.Fragment>
    );
};

export default BreakPage;
