import { FC } from 'react';
import { BsStar, BsStarFill } from 'react-icons/bs';
import Image from 'next/image';

import { ImageItem } from '../../../types/contentful';

interface SingleBlogPageProps {
    title: string;
    summary: string;
    score: number;
    image: ImageItem;
}

const starBaseClass = 'text-2xl text-primary';

const Review: FC<SingleBlogPageProps> = ({ title, summary, score, image }) => {
    if (summary.length === 0) return null;
    const stars = Array.from(Array(10).keys());

    return (
        <div className="flex flex-col shadow-xl bg-white p-8 space-y-2 rounded-2xl w-full">
            <h3 className="text-4xl font-semibold">Review</h3>
            <div className="flex flex-row items-center justify-between space-x-10">
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="mask mask-squircle p-4">
                        <span className="bg-secondary text-5xl text-white text-bold p-8">{score}</span>
                    </div>
                    <div className="flex flex-row">
                        {stars.map((star) => {
                            if (star < score) {
                                return <BsStarFill className={starBaseClass} key={`star-${score}`} />;
                            } else {
                                return <BsStar className={starBaseClass} key={`star-${score}`} />;
                            }
                        })}
                    </div>
                </div>
                <div className="flex flex-col space-y-2 w-1/2">
                    <h4 className="text-3xl font-semibold">{title}</h4>
                    <p>{summary}</p>
                </div>
                <div className="mask mask-circle">
                    <Image
                        src={`https:${image.url}`}
                        alt={image.description}
                        title={image.title}
                        width={250}
                        height={250}
                    />
                </div>
            </div>
        </div>
    );
};

export default Review;
