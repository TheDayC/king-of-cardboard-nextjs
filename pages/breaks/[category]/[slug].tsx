import React from 'react';
import { useRouter } from 'next/router';

import Break from '../../../components/Break';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import PageWrapper from '../../../components/PageWrapper';

export const BreakPage: React.FC = () => {
    const router = useRouter();
    const slug = safelyParse(router, 'query.slug', parseAsString, null);

    return <PageWrapper>{slug && <Break slug={slug} />}</PageWrapper>;
};

export default BreakPage;
