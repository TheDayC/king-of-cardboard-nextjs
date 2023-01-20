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
        description="Sports cards and sealed sports cards products for the UK. Whether you're collecting Football, Basketball or UFC, we have something for everyone."
    >
        <div className="w-full flex flex-col justify-top items-center">
            {sliderImages.length > 0 && <Slider images={sliderImages} />}
            {content && <Content content={content} />}
            {heroes && heroes.length && (
                <div className="flex flex-col space-y-4">
                    {heroes.map((hero, i) => (
                        <HeroWithImage {...hero} shouldReverse={!isOdd(i)} key={`hero-${i}`} />
                    ))}
                </div>
            )}
        </div>
    </PageWrapper>
);

export default Home;
