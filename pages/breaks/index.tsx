import React from 'react';

import Breaks from '../../components/Breaks';
import PageWrapper from '../../components/PageWrapper';

export const BreakPage: React.FC = () => {
    return (
        <PageWrapper
            title="Breaks - King of Cardboard"
            description="Sports card breaks for the UK collector. A great way to keep your favourite hobby cheap and accessible."
        >
            <Breaks />
        </PageWrapper>
    );
};

export default BreakPage;
