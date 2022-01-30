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
        <div id="productImagesWrapper" className="flex flex-col w-full mb-4 lg:w-auto lg:mb-0">
            {mainImage.url.length > 0 && (
                <div id="productImages" className="flex flex-row w-80 mx-auto mb-4">
                    <SideBySideMagnifier
                        imageSrc={`${currentImage}?w=320`}
                        largeImageSrc={`${currentImage}?w=2000`}
                        imageAlt={mainImage.title}
                        className="input-position"
                        alwaysInPlace={false}
                        inPlaceMinBreakpoint={641}
                    />
                </div>
            )}

            {imageCollection.length > 0 && (
                <div className="grid grid-cols-4 relative">
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
