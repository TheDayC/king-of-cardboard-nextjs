import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { Document } from '@contentful/rich-text-types';

import PageWrapper from '../../components/PageWrapper';
import ArticleList from '../../components/Blog/ArticleList';
import Filters from '../../components/Blog/Filters';
import { getPageBySlug } from '../../utils/pages';
import Content from '../../components/Content';
import { SliderImage } from '../../types/pages';
import { listBlogs } from '../../utils/blogs';
import { ListBlog } from '../../types/blogs';

export const getServerSideProps: GetServerSideProps = async () => {
    const { content, sliderImages } = await getPageBySlug('blog', '');
    const blogs = await listBlogs(7, 0);

    return {
        props: {
            content,
            sliderImages,
            blogs,
        },
    };
};

interface BlogProps {
    content: Document | null;
    sliderImages: SliderImage[] | null;
    blogs: ListBlog[];
}

const BlogPage: FC<BlogProps> = ({ content, sliderImages, blogs }) => {
    return (
        <PageWrapper
            title="King of Cardboard"
            description="Sports cards and sealed sports cards products for the UK. Whether you're collecting Football, Basketball or UFC, we have something for everyone."
        >
            <div className="flex flex-col w-full justify-start items-start">
                {sliderImages && sliderImages.length > 0 && (
                    <div className="image-container">
                        <img
                            src={sliderImages[0].url}
                            title={sliderImages[0].title}
                            alt={sliderImages[0].description}
                        />
                    </div>
                )}
                <div className="block">{content && <Content content={[content]} />}</div>
                <Filters />
                <div className="flex flex-row w-full justify-start items-start">
                    <ArticleList blogs={blogs} />
                </div>
            </div>
        </PageWrapper>
    );
};

export default BlogPage;
