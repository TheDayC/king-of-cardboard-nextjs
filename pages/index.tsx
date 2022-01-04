import React from 'react';
import { useSelector } from 'react-redux';

import HeroWithImage from '../components/Hero/withImage';
import PageWrapper from '../components/PageWrapper';
import { isOdd } from '../utils';
import selector from './selector';

export const Home: React.FC = () => {
    const { page } = useSelector(selector);

    if (!page) {
        return null;
    }

    return (
        <PageWrapper>
            {page.hero.map((hero, index: number) => (
                <React.Fragment key={`hero-${index}`}>
                    <HeroWithImage {...hero} shouldReverse={!isOdd(index)} />
                    {index !== page.hero.length - 1 && <div className="divider my-0 lg:my-4 before:bg-white"></div>}
                </React.Fragment>
            ))}
        </PageWrapper>
    );
};

export default Home;
