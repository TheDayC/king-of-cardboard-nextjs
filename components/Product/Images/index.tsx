import React from 'react';
import { GlassMagnifier } from 'react-image-magnifiers';
import Image from 'next/image';

import { ImageItem } from '../../../types/products';
import styles from './images.module.css';

interface ImageProps {
    mainImage: ImageItem;
    imageCollection: ImageItem[];
}

export const Images: React.FC<ImageProps> = ({ mainImage, imageCollection }) => (
    <div id="productImagesWrapper" className="flex flex-col w-full lg:w-auto">
        {mainImage.url.length > 0 && (
            <div id="productImages" className="flex-1 w-40 lg:w-60 mx-auto">
                <GlassMagnifier
                    imageSrc={mainImage.url}
                    imageAlt={mainImage.title}
                    allowOverflow
                    magnifierSize="50%"
                    magnifierBorderSize={5}
                    magnifierBorderColor="rgba(255, 255, 255, .5)"
                    square={false}
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
