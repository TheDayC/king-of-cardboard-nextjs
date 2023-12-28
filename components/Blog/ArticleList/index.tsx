import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BsArrowRightCircle, BsCalendar2Fill } from 'react-icons/bs';

import { ListBlog } from '../../../types/blogs';

interface ArticleListProps {
    blogs: ListBlog[];
}

const ArticleList: FC<ArticleListProps> = ({ blogs }) => {
    if (blogs.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative">
            {blogs.map((blog) => (
                <div
                    className="card card-compact shadow-md hover:shadow-2xl transition duration-300 ease-in-out"
                    key={`blog-${blog.title}`}
                >
                    <figure className="h-40 relative overflow-hidden">
                        <Image
                            src={`https:${blog.image.url}`}
                            alt={blog.image.description}
                            title={blog.image.title}
                            width={384}
                            height={160}
                        />
                    </figure>
                    <div className="card-body">
                        <div className="flex flex-row justify-end items-center">
                            <div className="badge badge-secondary inline font-semibold flex flex-row">
                                <BsCalendar2Fill className="mr-2" /> {blog.publishDate}
                            </div>
                        </div>
                        <h2 className="card-title">{blog.title}</h2>
                        {blog.preview && <p>{blog.preview}</p>}
                        <div className="card-actions justify-end">
                            <Link
                                href={{
                                    pathname: '/blog/[slug]',
                                    query: { slug: blog.slug },
                                }}
                                passHref
                                className="btn btn-primary uppercase font-semibold"
                            >
                                Read more
                                <BsArrowRightCircle className="ml-2 mt-0.5 text-lg" />
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ArticleList;
