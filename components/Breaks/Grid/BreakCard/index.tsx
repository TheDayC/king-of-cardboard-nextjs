import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { DateTime } from 'luxon';
import { AiFillStar, AiTwotoneCalendar } from 'react-icons/ai';

import { ImageItem } from '../../../../types/products';
import selector from './selector';
import { getSkus } from '../../../../utils/commerce';
import Countdown from '../../../Countdown';

interface BreakProps {
    cardImage: ImageItem;
    title: string;
    tags: string[];
    breakType: string;
    breakSlug: string;
    slotSkus: string[];
    format: string;
    breakDate: string;
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
}) => {
    const { accessToken } = useSelector(selector);
    const [slotsAvailable, setSlotsAvailable] = useState<number | null>(null);
    const hasSlots = slotsAvailable && slotsAvailable > 0;
    const breakDateLuxon = DateTime.fromISO(breakDate, { zone: 'Europe/London' });

    const fetchSlotSkuData = useCallback(async (token: string, skus: string[]) => {
        const skuData = await getSkus(token, skus);

        if (skuData) {
            setSlotsAvailable(skuData.length);
        } else {
            setSlotsAvailable(0);
        }
    }, []);

    useEffect(() => {
        if (accessToken) {
            fetchSlotSkuData(accessToken, slotSkus);
        }
    }, [accessToken, slotSkus]);

    return (
        <div className="card shadow-md rounded-md bordered">
            {cardImage && (
                <div className="relative w-full h-40">
                    <Image
                        src={cardImage.url}
                        alt={cardImage.description}
                        title={cardImage.title}
                        layout="fill"
                        objectFit="scale-down"
                        className="rounded-sm"
                    />
                    <div className="badge badge-accent absolute -bottom-2 left-0 ml-6 shadow-md">
                        {hasSlots
                            ? `${slotsAvailable} ${slotsAvailable > 1 ? 'slots' : 'slot'} available`
                            : 'Sold Out!'}
                    </div>
                </div>
            )}
            <div className="justify-between items-start card-body p-0">
                <div className="flex flex-col justify-start items-start w-full">
                    <div className="p-6 pb-2">
                        <h2 className="card-title text-2xl mb-1">{title}</h2>
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
                    <div className="flex justify-center items-center w-full bg-secondary bg-gradient-to-r from-secondary to-secondary-focus p-2 py-0 mb-4 text-neutral-content">
                        <Countdown breakDate={breakDateLuxon} />
                    </div>
                    {tags && (
                        <div className="flex flex-row flex-wrap justify-center items-center w-full space-x-2 px-6">
                            {tags.map((tag) => (
                                <div className="badge m-0 badge-secondary badge-outline" key={`tag-${tag}`}>
                                    {tag}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="card-actions w-full p-6 pt-0 mt-0">
                    <Link href={`/breaks/${breakType}/${breakSlug}`} passHref>
                        <button className="btn btn-primary btn-sm rounded-md shadow-md w-full">View Break</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BreakCard;
