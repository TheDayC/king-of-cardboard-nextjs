import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { Document } from '@contentful/rich-text-types';

import PageWrapper from '../../components/PageWrapper';
import ArticleList from '../../components/Blog/ArticleList';
import { getPageBySlug } from '../../utils/pages';
import Content from '../../components/Content';
import { SliderImage } from '../../types/pages';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { content, sliderImages } = await getPageBySlug('blog', '');

    return {
        props: {
            content,
            sliderImages,
        },
    };
};

interface BlogProps {
    content: Document | null;
    sliderImages: SliderImage[] | null;
}

const BlogPage: FC<BlogProps> = ({ content, sliderImages }) => {
    return (
        <PageWrapper
            title="King of Cardboard"
            description="Sports cards and sealed sports cards products for the UK. Whether you're collecting Football, Basketball or UFC, we have something for everyone."
        >
            <div className="flex flex-col w-full justify-start items-start">
                {sliderImages && sliderImages.length && (
                    <div className="image-container">
                        <img
                            src={sliderImages[0].url}
                            title={sliderImages[0].title}
                            alt={sliderImages[0].description}
                        />
                    </div>
                )}
                <div className="block">{content && <Content content={[content]} />}</div>
                <div className="flex flex-row w-full justify-start items-start">
                    <div className="w-1/4">
                        <ArticleList />
                    </div>
                    <div className="w-3/4">
                        <ArticleList />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

export default BlogPage;
