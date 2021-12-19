import { get } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';

import Drawer from '../components/Drawer';

import Header from '../components/Header';
import HeroWithImage from '../components/Hero/withImage';
// import Slider from '../components/Slider';
import { isOdd } from '../utils';
import selector from './selector';

export const Home: React.FC = () => {
    const { page } = useSelector(selector);
    // const sliderItems = get(page, 'sliderCollection.items', null);
    const heroData = get(page, 'hero', null);

    return (
        <React.Fragment>
            <Drawer>
                <Header />
                <div className="relative">
                    {/* sliderItems && <Slider items={sliderItems} /> */}
                    <div className="container mx-auto">
                        {heroData &&
                            heroData.map((hero, index: number) => (
                                <React.Fragment key={`hero-${index}`}>
                                    <HeroWithImage {...hero} shouldReverse={!isOdd(index)} />
                                    {index !== heroData.length && (
                                        <div className="divider my-0 lg:my-4 before:bg-white"></div>
                                    )}
                                </React.Fragment>
                            ))}
                    </div>
                </div>
            </Drawer>
        </React.Fragment>
    );
};

export default Home;
