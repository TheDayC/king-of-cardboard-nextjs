import React from 'react';
import { useSelector } from 'react-redux';

import Header from '../components/Header';
import HeroWithImage from '../components/Hero/withImage';
import { isOdd } from '../utils';
import selector from './selector';

export const Home: React.FC = () => {
    const { page } = useSelector(selector);

    if (!page) {
        return null;
    }

    return (
        <React.Fragment>
            <Header />
            <div className="relative">
                <div className="container mx-auto">
                    {page.hero &&
                        page.hero.map((hero, index: number) => (
                            <React.Fragment key={`hero-${index}`}>
                                <HeroWithImage {...hero} shouldReverse={!isOdd(index)} />
                                {index !== page.hero.length && (
                                    <div className="divider my-0 lg:my-4 before:bg-white"></div>
                                )}
                            </React.Fragment>
                        ))}
                </div>
            </div>
        </React.Fragment>
    );
};

export default Home;
