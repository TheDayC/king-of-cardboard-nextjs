import React from 'react';

import PageWrapper from '../components/PageWrapper';
import Error404 from '../components/404';

export const Custom404Page: React.FC = () => (
    <PageWrapper title="404 - King of Cardboard" description="We can't seem to find the page you requested!">
        <Error404 />
    </PageWrapper>
);

export default Custom404Page;
