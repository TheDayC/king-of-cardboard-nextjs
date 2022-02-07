import React, { useState } from 'react';
import { SideBySideMagnifier } from 'react-image-magnifiers';
import Image from 'next/image';

import { ImageItem } from '../../../types/products';

interface ImageProps {
    mainImage: ImageItem;
    imageCollection: ImageItem[];
}

export const Images: React.FC<ImageProps> = ({ mainImage, imageCollection }) => {
    const [currentImage, setCurrentImage] = useState(mainImage.url);

    const changeImage = (url: string) => {
        if (url !== currentImage) {
            setCurrentImage(url);
        }
    };

    return (
        <div
            id="productImagesWrapper"
            className="flex flex-col w-full justify-start items-center mb-4 lg:w-1/4 lg:mb-0"
        >
            {mainImage.url.length > 0 && (
                <div id="productImages" className="flex flex-row justify-center items-start w-full mb-4">
                    <SideBySideMagnifier
                        imageSrc={`${mainImage.url}?w=375`}
                        largeImageSrc={`${mainImage.url}?w=2000`}
                        imageAlt={mainImage.title}
                        className="overflow-hidden rounded-md shadow-md"
                        alwaysInPlace={true}
                        inPlaceMinBreakpoint={1024}
                    />
                </div>
            )}

            {imageCollection.length > 0 && (
                <div className="grid grid-cols-4 relative w-full">
                    {imageCollection.map((image, index) => (
                        <div
                            className="w-full h-20 cursor-pointer p-2"
                            key={`line-item-${index}`}
                            onClick={() => changeImage(image.url)}
                        >
                            <div className="block rounded-md overflow-hidden w-full h-full relative shadow-sm transition duration-300 ease-in-out hover:shadow-lg">
                                <Image src={`${image.url}?w=65`} alt="shipment image" layout="fill" objectFit="cover" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Images;
