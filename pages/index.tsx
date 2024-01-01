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
import { getFeaturedProduct, listProducts } from '../utils/account/products';
import { Configuration, SortOption, StockStatus } from '../enums/products';
import { Product } from '../types/products';
import LatestArrivals from '../components/LatestArrivals';
import FeaturedProduct from '../components/FeaturedProduct';

const CONFIGURATIONS: Configuration[] = [];
const STOCK_STATUSES: StockStatus[] = [StockStatus.InStock, StockStatus.PreOrder];

export const getServerSideProps: GetServerSideProps = async () => {
    const { heroes, content, sliderImages } = await pageWithHeroBySlug('home', '');
    const { products } = await listProducts(
        4,
        0,
        true,
        [],
        CONFIGURATIONS,
        [],
        STOCK_STATUSES,
        '',
        SortOption.DateAddedDesc,
        false
    );

    const featuredProduct = await getFeaturedProduct();

    return {
        props: {
            heroes,
            content,
            sliderImages,
            products,
            featuredProduct,
        },
    };
};

interface HomePageProps {
    heroes: Hero[] | null;
    content: Document[] | null;
    sliderImages: SliderImage[];
    products: Product[];
    featuredProduct: Product | null;
}

export const Home: React.FC<HomePageProps> = ({ heroes, content, sliderImages, products, featuredProduct }) => (
    <PageWrapper
        title="King of Cardboard"
        description="Sports cards and sealed sports cards products for the UK. Whether you're collecting Football, Basketball or UFC, we have something for everyone."
    >
        <div className="w-full flex flex-col gap-y-8 justify-top items-start">
            {/* sliderImages.length > 0 && <Slider images={sliderImages} /> */}
            {/* content && <Content content={content} /> */}
            {/* heroes && heroes.length && (
                <div className="flex flex-col space-y-4 max-w-7xl">
                    {heroes.map((hero, i) => (
                        <HeroWithImage {...hero} shouldReverse={!isOdd(i)} shouldUseH1={i === 0} key={`hero-${i}`} />
                    ))}
                </div>
            ) */}
            {/* products.length > 0 && <LatestArrivals products={products} /> */}
            {/* featuredProduct && <FeaturedProduct product={featuredProduct} /> */}
            <h1 className="font-bold mb-4 text-2xl lg:text-5xl" role="heading">
                Collect. Invest. Share.
            </h1>
            <p>
                A motto I used to help promote the essence of the sports card trading hobby that I, and we all loved
                together. Today is a sad day for myself and those that have supported me greatly in this venture to
                create cheaper and more accessible sports cards for the UK, today King of Cardboard shuts its doors.
            </p>
            <p>
                To those I have met, made friends with and to those that have supported me every step of the way, thank
                you, this journey has given me some incredible life lessons and helped me to grow as a person. Don't
                worry though, I won't vanish. I'll still be around, remaining orders will still be fulfilled and new
                exciting ideas will be produced in the future.
            </p>
            <p>
                You can still email me at{' '}
                <a href="mailto:support@kingofcardboard.co.uk" className="underline">
                    support@kingofcardboard.co.uk
                </a>{' '}
                if you have any product questions or just want to chat. The{' '}
                <a
                    href="https://instagram.com/kocardboard"
                    target="__blank"
                    rel="noopener noreferrer"
                    role="link"
                    className="underline"
                >
                    Instagram account
                </a>{' '}
                will still be checked if you'd like to message me and follow my sports card journey over there too. Keep
                an eye out for more exciting things to come from me in the sports card world!
            </p>
            <p>Thank you.</p>
        </div>
    </PageWrapper>
);

export default Home;
