import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DateTime } from 'luxon';
import { AiFillStar, AiTwotoneCalendar } from 'react-icons/ai';
import { BsTwitch, BsCollectionPlay, BsYoutube } from 'react-icons/bs';

import { ImageItem } from '../../../../types/products';
import Countdown from './Countdown';

interface BreakProps {
    cardImage: ImageItem;
    breakNumber: number;
    title: string;
    tags: string[];
    breakType: string;
    breakSlug: string;
    slots: number;
    format: string;
    breakDate: string;
    isLive: boolean;
    isComplete: boolean;
    vodLink: string;
}

export const BreakCard: React.FC<BreakProps> = ({
    cardImage,
    breakNumber,
    title,
    tags,
    breakType,
    breakSlug,
    slots,
    format,
    breakDate,
    isLive,
    isComplete,
    vodLink,
}) => {
    const plural = slots > 1 ? 'slots' : 'slot';
    const breakDateLuxon = DateTime.fromISO(breakDate, { zone: 'Europe/London' });
    const isActive = !isLive && !isComplete;
    const bannerColour =
        isActive && slots > 0
            ? 'bg-gradient-to-r from-secondary to-secondary-focus'
            : 'bg-gradient-to-r from-red-500 to-red-700';

    return (
        <div className="card shadow-md rounded-md bordered pt-4 transition duration-300 ease-in-out hover:shadow-2xl">
            {cardImage && (
                <div className="relative cursor-pointer h-40 flex flex-row justify-center">
                    {cardImage.url.length > 0 && (
                        <Link
                            href={{
                                pathname: '/breaks/[category]/[slug]',
                                query: { category: breakType, slug: breakSlug },
                            }}
                            passHref
                        >
                            <div className="relative w-28 h-40 rounded-md overflow-hidden shadow-md">
                                <img
                                    src={`${cardImage.url}?h=128`}
                                    alt={cardImage.description}
                                    title={cardImage.title}
                                    className="w-auto h-full"
                                />
                            </div>
                        </Link>
                    )}
                    {isActive && slots > 0 && (
                        <div className="badge bg-secondary border-0 absolute -bottom-2.5 left-1/4 shadow-md p-3">
                            {`${slots} ${plural} ${slots <= 3 ? 'remaining!' : 'available'}`}
                        </div>
                    )}
                    {isActive && slots <= 0 && (
                        <div className="badge bg-red-500 border-0 absolute -bottom-2.5 left-1/4 shadow-md p-3">
                            Sold out!
                        </div>
                    )}
                    {isLive && !isComplete && (
                        <div className="badge bg-accent border-0 absolute -bottom-2.5 left-1/4 shadow-md p-3">
                            Breaking Now!
                        </div>
                    )}
                    {isComplete && (
                        <div className="badge bg-green-500 border-0 absolute -bottom-2 left-0 ml-4 lg:ml-6 shadow-md p-3">
                            Opened on {breakDateLuxon.toFormat('MMM dd, y')}
                        </div>
                    )}
                </div>
            )}
            <div className="justify-between items-start card-body p-0">
                <div className="flex flex-col justify-start items-start w-full">
                    <div className="p-4 mt-4 lg:p-6">
                        <Link
                            href={{
                                pathname: '/breaks/[category]/[slug]',
                                query: { category: breakType, slug: breakSlug },
                            }}
                            passHref
                        >
                            <h2 className="card-title text-3xl mb-2 font-semibold cursor-pointer hover:underline">
                                Break #{breakNumber}
                            </h2>
                        </Link>
                        <h2 className="card-title text-xl mb-6">{title}</h2>
                        <div className="pl-2">
                            <p className="text-gray-400 text-sm">
                                <AiFillStar className="inline mr-1 w-4 h-4 text-yellow-300 -mt-1" />
                                {format}
                            </p>
                            <p className="text-gray-400 text-sm">
                                <AiTwotoneCalendar className="inline mr-1 w-4 h-4 text-red-300 -mt-1" />
                                {breakDateLuxon.toLocaleString(DateTime.DATE_FULL)}
                            </p>
                        </div>
                    </div>
                    {!isLive && !isComplete && (
                        <div
                            className={`flex justify-center items-center w-full p-2 h-14 mb-4 text-neutral-content ${bannerColour}`}
                        >
                            <Countdown breakDate={breakDateLuxon} />
                        </div>
                    )}
                    {isLive && !isComplete && (
                        <a href="https://twitch.tv/dayc" className="w-full" target="__blank">
                            <div className="flex justify-center items-center w-full bg-gradient-to-r from-accent to-accent-focus p-2 h-14 mb-4 text-neutral-content cursor-pointer">
                                <BsTwitch className="inline w-6 h-6 mr-2 animate-bounce" />
                                <span className="text-lg">Live</span>
                            </div>
                        </a>
                    )}
                    {isComplete && (
                        <a href={vodLink} className="w-full" target="__blank">
                            <div className="flex justify-center items-center w-full bg-gradient-to-r from-green-500 to-green-700 p-2 h-14 mb-4 text-neutral-content cursor-pointer">
                                <span className="text-lg">VoD</span>
                                <BsYoutube className="inline w-6 h-6 ml-2 mt-0.5" />
                            </div>
                        </a>
                    )}
                    {tags && (
                        <div className="flex flex-row flex-wrap justify-center items-start w-full px-2 lg:px-6">
                            {tags.map((tag) => (
                                <div className="badge badge-secondary badge m-1 text-xs lg:text-md" key={`tag-${tag}`}>
                                    {tag}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {!isLive && !isComplete && (
                    <div className="card-actions w-full p-6 pt-0 mt-0">
                        <Link
                            href={{
                                pathname: '/breaks/[category]/[slug]',
                                query: { category: breakType, slug: breakSlug },
                            }}
                            passHref
                        >
                            <button className="btn btn-primary btn-sm rounded-md shadow-md w-full mt-0">
                                View Break
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BreakCard;
