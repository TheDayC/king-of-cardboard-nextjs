import { get } from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';

import Header from '../components/Header';
import Slider from '../components/Slider';
import selector from './selector';

export const Home: React.FC = () => {
    const { page } = useSelector(selector);
    const sliderItems = get(page, 'sliderCollection.items', null);

    return (
        <React.Fragment>
            <Header />
            <div className="relative">
                <Slider items={sliderItems} />
            </div>
        </React.Fragment>
    );
};

export default Home;
