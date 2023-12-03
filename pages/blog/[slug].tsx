import { FC } from 'react';
import { GetServerSideProps } from 'next';
import Image from 'next/image';

import PageWrapper from '../../components/PageWrapper';
import { getBlog } from '../../utils/blogs';
import { Blog } from '../../types/blogs';
import { parseAsString, safelyParse } from '../../utils/parsers';
import Custom404Page from '../404';
import { BsCalendar2Fill } from 'react-icons/bs';
import Content from '../../components/Content';
import Review from '../../components/Blog/Review';
import YoutubeEmbed from '../../components/YoutubeEmbed';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const slug = safelyParse(context, 'query.slug', parseAsString, null);

    if (!slug) {
        return {
            props: {
                blog: null,
            },
        };
    }

    const blog = await getBlog(slug);

    return {
        props: {
            blog,
        },
    };
};

interface SingleBlogPageProps {
    blog: Blog | null;
}

const SingleBlogPage: FC<SingleBlogPageProps> = ({ blog }) => {
    if (!blog) return <Custom404Page />;

    return (
        <PageWrapper
            title="King of Cardboard"
            description="Sports cards and sealed sports cards products for the UK. Whether you're collecting Football, Basketball or UFC, we have something for everyone."
        >
            <div className="flex flex-col w-full justify-start items-start space-y-4">
                {blog.banner.url.length > 0 && (
                    <Image
                        src={`https:${blog.banner.url}`}
                        alt={blog.banner.description}
                        title={blog.banner.title}
                        width={1920}
                        height={200}
                    />
                )}
                <h1 className="text-5xl">{blog.title}</h1>
                <div className="badge badge-accent inline font-semibold flex flex-row items-center">
                    <BsCalendar2Fill className="mr-2" /> {blog.publishDate}
                </div>

                {blog.content && <Content content={[blog.content]} />}
                <h3 className="text-3xl font-semibold">Video Review</h3>
                <YoutubeEmbed embedId={blog.youtubeEmbedId} />
                <Review
                    summary={blog.reviewSummary}
                    score={blog.reviewScore}
                    image={blog.image}
                    title={blog.reviewTitle}
                />
                {/* {sliderImages && sliderImages.length > 0 && (
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
                </div> */}
            </div>
        </PageWrapper>
    );
};

export default SingleBlogPage;
