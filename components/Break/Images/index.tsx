import React from 'react';
import { SideBySideMagnifier } from 'react-image-magnifiers';
import Image from 'next/image';

import { ImageItem } from '../../../types/products';
import styles from './images.module.css';

interface ImageProps {
    mainImage: ImageItem;
    images: ImageItem[];
}

export const Images: React.FC<ImageProps> = ({ mainImage, images }) => (
    <div id="productImagesWrapper" className="flex flex-col items-center w-full mb-4 lg:mb-6">
        <div id="productImages" className="w-2/3">
            {mainImage.url.length > 0 && (
                <SideBySideMagnifier
                    imageSrc={`${mainImage.url}?w=315`}
                    largeImageSrc={`${mainImage.url}?w=2000`}
                    imageAlt={mainImage.title}
                    className="overflow-hidden rounded-md shadow-md"
                    alwaysInPlace={true}
                    inPlaceMinBreakpoint={1024}
                />
            )}
        </div>

        <div className="flex flex-1 flex-row flex-wrap space-x-2 mt-4">
            {images.length > 0 &&
                images.map((image, index) => (
                    <div className={styles.imageContainer} key={`line-item-${index}`}>
                        <Image src={image.url} alt="shipment image" layout="fill" objectFit="cover" />
                    </div>
                ))}
        </div>
    </div>
);

export default Images;
