import { GetServerSideProps } from 'next';
import React from 'react';
import { Document } from '@contentful/rich-text-types';

import HeroWithImage from '../components/Hero/withImage';
import PageWrapper from '../components/PageWrapper';
import { isOdd } from '../utils';
import { pageWithHeroBySlug } from '../utils/pages';
import Content from '../components/Content';
import { Hero } from '../types/pages';

export const getServerSideProps: GetServerSideProps = async () => {
    const { heroes, content } = await pageWithHeroBySlug('home', '');

    return {
        props: {
            heroes,
            content,
        },
    };
};

interface HomePageProps {
    heroes: Hero[] | null;
    content: Document[] | null;
}

export const Home: React.FC<HomePageProps> = ({ heroes, content }) => {
    return (
        <PageWrapper>
            {content && <Content content={content} />}
            {heroes &&
                heroes.map((hero, i) => (
                    <React.Fragment key={`hero-${i}`}>
                        <HeroWithImage {...hero} shouldReverse={!isOdd(i)} />
                        {i !== heroes.length - 1 && <div className="divider my-0 lg:my-4 before:bg-white"></div>}
                    </React.Fragment>
                ))}
        </PageWrapper>
    );
};

export default Home;
