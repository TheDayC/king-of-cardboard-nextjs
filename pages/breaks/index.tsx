import React from 'react';

import Header from '../../components/Header';
import Breaks from '../../components/Breaks';
import Footer from '../../components/Footer';

export const BreakPage: React.FC = () => {
    return (
        <React.Fragment>
            <Header />
            <Breaks />
            <Footer />
        </React.Fragment>
    );
};

export default BreakPage;
