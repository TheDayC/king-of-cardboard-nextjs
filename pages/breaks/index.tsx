import React from 'react';

import Breaks from '../../components/Breaks';
import PageWrapper from '../../components/PageWrapper';

export const BreakPage: React.FC = () => {
    return (
        <PageWrapper
            title="Breaks - King of Cardboard"
            description="Hobby and booster box breaks in a variety of formats. A great way to keep the hobby low cost and accessible."
        >
            <Breaks />
        </PageWrapper>
    );
};

export default BreakPage;
