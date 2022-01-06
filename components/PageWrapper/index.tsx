import React from 'react';

import Header from '../Header';
import Footer from '../Footer';

export const PageWrapper: React.FC = ({ children }) => (
    <React.Fragment>
        <Header />
        <div className="block w-full relative bg-primary-content p-2 md:p-4 lg:p-8">
            <div className="container mx-auto">{children}</div>
        </div>
        <Footer />
    </React.Fragment>
);

export default PageWrapper;