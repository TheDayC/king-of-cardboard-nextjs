import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import { AiFillStar, AiTwotoneCalendar } from 'react-icons/ai';
import { BsTwitch, BsFillCheckCircleFill } from 'react-icons/bs';

import { ImageItem } from '../../../../types/products';
import selector from './selector';
import { getSkus } from '../../../../utils/commerce';
import Countdown from './Countdown';
import { isArrayOfErrors, isError } from '../../../../utils/typeguards';
import { addAlert } from '../../../../store/slices/alerts';
import { AlertLevel } from '../../../../enums/system';

interface BreakProps {
    cardImage: ImageItem;
    title: string;
    tags: string[];
    breakType: string;
    breakSlug: string;
    slotSkus: string[];
    format: string;
    breakDate: string;
    isLive: boolean;
    isComplete: boolean;
    vodLink: string;
}

export const BreakCard: React.FC<BreakProps> = ({
    cardImage,
    title,
    tags,
    breakType,
    breakSlug,
    slotSkus,
    format,
    breakDate,
    isLive,
    isComplete,
    vodLink,
}) => {
    const { accessToken } = useSelector(selector);
    const [slotsAvailable, setSlotsAvailable] = useState<number | null>(null);
    const hasSlots = slotsAvailable && slotsAvailable > 0;
    const breakDateLuxon = DateTime.fromISO(breakDate, { zone: 'Europe/London' });
    const isActive = !isLive && !isComplete;
    const dispatch = useDispatch();

    const fetchSlotSkuData = useCallback(async (token: string, skus: string[]) => {
        const skuData = await getSkus(token, skus);

        if (isArrayOfErrors(skuData)) {
            skuData.forEach((value) => {
                dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
            });
        } else {
            if (skuData) {
                setSlotsAvailable(skuData.length);
            } else {
                setSlotsAvailable(0);
            }
        }
    }, []);

    useEffect(() => {
        if (accessToken) {
            fetchSlotSkuData(accessToken, slotSkus);
        }
    }, [accessToken, slotSkus]);

    return (
        <div className="card shadow-md rounded-md bordered pt-4">
            {cardImage && (
                <div className="relative h-20 md:h-30 lg:h-40">
                    <Image
                        src={cardImage.url}
                        alt={cardImage.description}
                        title={cardImage.title}
                        layout="fill"
                        objectFit="scale-down"
                        className="rounded-sm"
                    />
                    {isActive && (
                        <div className="badge badge-accent absolute -bottom-2 left-0 ml-4 lg:ml-6 shadow-md">
                            {hasSlots
                                ? `${slotsAvailable} ${slotsAvailable > 1 ? 'slots' : 'slot'} available`
                                : 'Sold Out!'}
                        </div>
                    )}
                    {isComplete && (
                        <div className="badge badge-success absolute -bottom-4 left-0 ml-4 lg:ml-6 shadow-md">
                            Opened on {breakDateLuxon.toFormat('MMM dd, y')}
                        </div>
                    )}
                </div>
            )}
            <div className="justify-between items-start card-body p-0">
                <div className="flex flex-col justify-start items-start w-full">
                    <div className="p-4 mt-4 lg:p-6">
                        <h2 className="card-title text-2xl mb-2">{title}</h2>
                        <div className="pl-2">
                            <p className="text-base-200 text-sm">
                                <AiFillStar className="inline mr-1 w-4 h-4 text-yellow-300" />
                                {format}
                            </p>
                            <p className="text-base-200 text-sm">
                                <AiTwotoneCalendar className="inline mr-1 w-4 h-4 text-red-300" />
                                {breakDateLuxon.toLocaleString(DateTime.DATE_FULL)}
                            </p>
                        </div>
                    </div>
                    {!isLive && !isComplete && (
                        <div className="flex justify-center items-center w-full bg-secondary bg-gradient-to-r from-secondary to-secondary-focus p-2 py-0 mb-4 text-neutral-content">
                            <Countdown breakDate={breakDateLuxon} />
                        </div>
                    )}
                    {isLive && !isComplete && (
                        <a href="https://twitch.tv/dayc" className="w-full" target="__blank">
                            <div className="flex justify-center items-center w-full bg-gradient-to-r from-accent to-accent-focus p-2 mb-4 text-neutral-content cursor-pointer">
                                <BsTwitch className="inline mr-2" />
                                <span className="text-lg">Live</span>
                            </div>
                        </a>
                    )}
                    {isComplete && (
                        <a href={vodLink} className="w-full" target="__blank">
                            <div className="flex justify-center items-center w-full bg-gradient-to-r from-green-300 to-green-500 p-2 mb-4 text-neutral-content cursor-pointer">
                                <BsFillCheckCircleFill className="inline mr-2" />
                                <span className="text-lg">Complete</span>
                            </div>
                        </a>
                    )}
                    {tags && (
                        <div className="flex flex-row flex-wrap justify-center items-start w-full px-2 lg:px-6">
                            {tags.map((tag) => (
                                <div
                                    className="badge badge-secondary badge-outline m-1 text-xs lg:text-md"
                                    key={`tag-${tag}`}
                                >
                                    {tag}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="card-actions w-full p-6 pt-0 mt-0">
                    <Link href={`/breaks/${breakType}/${breakSlug}`} passHref>
                        <button className="btn btn-primary btn-sm rounded-md shadow-md w-full mt-0">View Break</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BreakCard;
