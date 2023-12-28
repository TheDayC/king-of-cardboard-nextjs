import { FC } from 'react';
import { GetServerSideProps } from 'next';
import { Document } from '@contentful/rich-text-types';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { ceil, divide } from 'lodash';

import PageWrapper from '../../components/PageWrapper';
import ArticleList from '../../components/Blog/ArticleList';
import Filters from '../../components/Blog/Filters';
import { getPageBySlug } from '../../utils/pages';
import Content from '../../components/Content';
import { SliderImage } from '../../types/pages';
import { listBlogs } from '../../utils/blogs';
import { ListBlog } from '../../types/blogs';
import { parseAsString, safelyParse } from '../../utils/parsers';
import Pagination from '../../components/Pagination';

const LIMIT = 6;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const page = safelyParse(context, 'query.page', parseAsString, '1');
    const q = safelyParse(context, 'query.q', parseAsString, null);
    const currentPage = parseInt(page) - 1;
    const skip = LIMIT * currentPage;
    const { content, sliderImages } = await getPageBySlug('blog', '');
    const { total, blogs } = await listBlogs(LIMIT, skip, q);

    return {
        props: {
            content,
            sliderImages,
            blogs,
            currentPage,
            totalBlogs: total,
            q,
        },
    };
};

interface BlogProps {
    content: Document | null;
    sliderImages: SliderImage[] | null;
    blogs: ListBlog[];
    currentPage: number;
    totalBlogs: number;
    q: string | null;
}

const BlogPage: FC<BlogProps> = ({ content, sliderImages, blogs, currentPage, totalBlogs, q }) => {
    const pageCount = ceil(divide(totalBlogs, LIMIT));
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handlePageNumber = (nextPage: number) => {
        const params = new URLSearchParams(searchParams.toString());

        params.set('page', `${nextPage + 1}`);
        replace(`${pathname}${params.size > 0 ? '?' : ''}${params.toString()}`);
    };

    const handleSearch = (q: string) => {
        const params = new URLSearchParams(searchParams.toString());

        q.length > 0 ? params.set('q', q) : params.delete('q');

        replace(`${pathname}${params.size > 0 ? '?' : ''}${params.toString()}`);
    };

    return (
        <PageWrapper
            title="King of Cardboard"
            description="Sports cards and sealed sports cards products for the UK. Whether you're collecting Football, Basketball or UFC, we have something for everyone."
        >
            <div className="flex flex-col w-full justify-start items-start space-y-4">
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
                <Filters handleSearch={handleSearch} q={q} />
                <div className="flex flex-row w-full justify-start items-start">
                    <ArticleList blogs={blogs} />
                </div>
                {pageCount > 1 && (
                    <Pagination currentPage={currentPage} pageCount={pageCount} handlePageNumber={handlePageNumber} />
                )}
            </div>
        </PageWrapper>
    );
};

export default BlogPage;
