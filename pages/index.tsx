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
import { listProducts } from '../utils/account/products';
import { Configuration, SortOption, StockStatus } from '../enums/products';
import { Product } from '../types/products';
import LatestArrivals from '../components/LatestArrivals';

const LIMIT = 4;
const SKIP = 4;
const CONFIGURATIONS: Configuration[] = [];
const STOCK_STATUSES: StockStatus[] = [StockStatus.InStock, StockStatus.Import, StockStatus.PreOrder];

export const getServerSideProps: GetServerSideProps = async () => {
    const { heroes, content, sliderImages } = await pageWithHeroBySlug('home', '');
    const { products } = await listProducts(
        LIMIT,
        SKIP,
        true,
        [],
        CONFIGURATIONS,
        [],
        STOCK_STATUSES,
        '',
        SortOption.DateAddedDesc
    );

    return {
        props: {
            heroes,
            content,
            sliderImages,
            products,
        },
    };
};

interface HomePageProps {
    heroes: Hero[] | null;
    content: Document[] | null;
    sliderImages: SliderImage[];
    products: Product[];
}

export const Home: React.FC<HomePageProps> = ({ heroes, content, sliderImages, products }) => (
    <PageWrapper
        title="King of Cardboard"
        description="Sports cards and sealed sports cards products for the UK. Whether you're collecting Football, Basketball or UFC, we have something for everyone."
    >
        <div className="w-full flex flex-col gap-y-8 justify-top items-center">
            {sliderImages.length > 0 && <Slider images={sliderImages} />}
            {content && <Content content={content} />}
            {heroes && heroes.length && (
                <div className="flex flex-col space-y-4 max-w-7xl">
                    {heroes.map((hero, i) => (
                        <HeroWithImage {...hero} shouldReverse={!isOdd(i)} shouldUseH1={i === 0} key={`hero-${i}`} />
                    ))}
                </div>
            )}
            {products.length > 0 && <LatestArrivals products={products} />}
        </div>
    </PageWrapper>
);

export default Home;
