import { FC } from 'react';
import Image from 'next/image';

import { ListBlog } from '../../../types/blogs';
import { BsArrowRightCircle } from 'react-icons/bs';

interface ArticleListProps {
    blogs: ListBlog[];
}

const ArticleList: FC<ArticleListProps> = ({ blogs }) => {
    if (blogs.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 relative">
            {blogs.map((blog) => (
                <div className="card card-compact shadow-md hover:shadow-2xl transition duration-300 ease-in-out">
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
                        <h2 className="card-title">{blog.title}</h2>
                        {blog.preview && <p>{blog.preview}</p>}
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary">
                                Read more
                                <BsArrowRightCircle className="ml-2 mt-0.5 text-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ArticleList;
