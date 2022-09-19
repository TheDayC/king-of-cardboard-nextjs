import { GetServerSideProps } from 'next';
import React from 'react';
import { Document } from '@contentful/rich-text-types';

import HeroWithImage from '../components/Hero/withImage';
import PageWrapper from '../components/PageWrapper';
import { isOdd } from '../utils';
import { pageWithHeroBySlug } from '../utils/pages';
import Content from '../components/Content';
import { Hero, SliderImage } from '../types/pages';
import Slider from '../components/Slider';

export const getServerSideProps: GetServerSideProps = async () => {
    const { heroes, content, sliderImages } = await pageWithHeroBySlug('home', '');

    return {
        props: {
            heroes,
            content,
            sliderImages,
        },
    };
};

interface HomePageProps {
    heroes: Hero[] | null;
    content: Document[] | null;
    sliderImages: SliderImage[];
}

export const Home: React.FC<HomePageProps> = ({ heroes, content, sliderImages }) => (
    <PageWrapper
        title="King of Cardboard"
        description="The most interactive and entertaining trading card break site in the UK. No matter if you collect sports or trading cards, we have something for everyone."
    >
        <div className="w-full flex flex-col justify-top items-center">
            {sliderImages.length > 0 && <Slider images={sliderImages} />}
            {content && <Content content={content} />}
            {heroes &&
                heroes.map((hero, i) => (
                    <React.Fragment key={`hero-${i}`}>
                        <HeroWithImage {...hero} shouldReverse={!isOdd(i)} />
                        {i !== heroes.length - 1 && <div className="divider my-4 before:bg-white"></div>}
                    </React.Fragment>
                ))}
        </div>
    </PageWrapper>
);

export default Home;
