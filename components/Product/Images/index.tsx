import React from 'react';
import { SideBySideMagnifier } from 'react-image-magnifiers';
import Image from 'next/image';

import { ImageItem } from '../../../types/products';
import styles from './images.module.css';

interface ImageProps {
    mainImage: ImageItem;
    imageCollection: ImageItem[];
}

export const Images: React.FC<ImageProps> = ({ mainImage, imageCollection }) => (
    <div id="productImagesWrapper" className="flex flex-col w-full mb-4 lg:w-auto lg:mb-0">
        {mainImage.url.length > 0 && (
            <div id="productImages" className="flex-1 w-40 mx-auto lg:w-60">
                <SideBySideMagnifier
                    imageSrc={`${mainImage.url}?w=315`}
                    largeImageSrc={`${mainImage.url}?w=2000`}
                    imageAlt={mainImage.title}
                />
            </div>
        )}

        {imageCollection.length > 0 && (
            <div className="flex flex-1 flex-row flex-wrap space-x-2 mt-4">
                {imageCollection.map((image, index) => (
                    <div className={styles.imageContainer} key={`line-item-${index}`}>
                        <Image src={image.url} alt="shipment image" layout="fill" objectFit="cover" />
                    </div>
                ))}
            </div>
        )}
    </div>
);

export default Images;
