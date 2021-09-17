import React from 'react';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';

export const Home: React.FC = () => {
    return (
        <React.Fragment>
            <Header />
            <ProductGrid useFilters={false} />
        </React.Fragment>
    );
};

export default Home;
