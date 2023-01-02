import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BsArrowRightSquareFill, BsCalendarDate } from 'react-icons/bs';

import { StockStatus } from '../../../../enums/products';
import { getStockStatusColor, getStockStatusTitle, getStockStatusTooltip } from '../../../../utils/account/products';
import { DateTime } from 'luxon';

interface CardProps {
    name: string;
    image: string;
    imgDesc: string;
    imgTitle: string;
    tags: string[];
    amount: string;
    compareAmount: string;
    slug: string;
    shouldShowCompare: boolean;
    stock: number;
    stockStatus: StockStatus;
    releaseDate: string | null;
}

export const ProductCard: React.FC<CardProps> = ({
    name,
    image,
    imgDesc,
    imgTitle,
    tags,
    amount,
    compareAmount,
    slug,
    shouldShowCompare,
    stock,
    stockStatus,
    releaseDate = null,
}) => {
    const linkOptions = {
        pathname: '/product/[slug]',
        query: { slug },
    };
    const stockText = stock > 0 ? `${stock} available` : 'Out of stock';
    const stockStatusTitle = getStockStatusTitle(stockStatus);
    const stockStatusColor = getStockStatusColor(stockStatus);
    const stockStatusMsg = getStockStatusTooltip(stockStatus);
    const shouldShowStockStatusTitle = stockStatus !== StockStatus.InStock;

    return (
        <div
            className="card shadow-md rounded-md bordered pt-4 transition duration-300 ease-in-out relative hover:shadow-2xl"
            data-testid="product-card"
        >
            {image.length > 0 && (
                <Link href={linkOptions} passHref>
                    <div className="relative w-full h-40 cursor-pointer flex flex-row justify-center">
                        <div className="relative">
                            {releaseDate && (
                                <div
                                    className="absolute flex flex-col items-center rounded-full bg-secondary p-3 -top-3 -right-3 tooltip tooltip-right shadow-sm"
                                    data-tip={`Expected release: ${DateTime.fromISO(releaseDate).toFormat(
                                        'dd/MM/yyyy'
                                    )}`}
                                >
                                    <BsCalendarDate className="inline text-white text-xl" />
                                </div>
                            )}
                            <Image
                                src={`${process.env.NEXT_PUBLIC_AWS_S3_URL}${image}`}
                                width={160}
                                height={160}
                                alt={imgDesc}
                                title={imgTitle}
                                className="rounded-md shadow-md"
                            />
                            {shouldShowStockStatusTitle && (
                                <div
                                    className="badge absolute -bottom-2 -right-2 text-md border-0 shadow-sm tooltip tooltip-bottom"
                                    style={{ backgroundColor: stockStatusColor }}
                                    data-tip={stockStatusMsg}
                                >
                                    {stockStatusTitle}
                                </div>
                            )}
                        </div>
                    </div>
                </Link>
            )}
            <div className="justify-between items-center card-body px-6 py-4">
                <div className="flex flex-col justify-start items-center space-y-2">
                    <Link href={linkOptions} passHref>
                        <h2 className="card-title text-center text-2xl cursor-pointer hover:underline">{name}</h2>
                    </Link>
                    {tags.length > 0 && (
                        <div className="flex flex-row flex-wrap justify-start items-center">
                            {tags.map((tag) => (
                                <div className="badge m-2 badge-secondary" key={`tag-${tag}`}>
                                    {tag}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="card-actions w-full justify-center">
                    <div className="flex flex-col justify-between items-end w-full 2xl:flex-row">
                        <div className="flex flex-col">
                            <p className="text-md text-green-600">{stockText}</p>
                        </div>
                        <div className="flex flex-row justify-end items-center">
                            {shouldShowCompare && (
                                <span className="text-md line-through text-base-200 mr-2 mt-1">{compareAmount}</span>
                            )}
                            <span className="text-2xl font-bold">{amount}</span>
                        </div>
                    </div>
                    <Link href={linkOptions} passHref className="w-full">
                        <button className="btn btn-block btn-md btn-primary rounded-md shadow-none">
                            View Product
                            <BsArrowRightSquareFill className="inline w-5 h-5 ml-4 inline lg:hidden xl:inline" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
