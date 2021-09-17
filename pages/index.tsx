import React from 'react';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';

export const Home: React.FC = () => {
    return (
        <React.Fragment>
            <Header />
            <div className="container mx-auto px-16">
                <ProductGrid useFilters={false} />
            </div>
        </React.Fragment>
    );
};

export default Home;
