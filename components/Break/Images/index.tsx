import React from 'react';
import { GlassMagnifier } from 'react-image-magnifiers';
import Image from 'next/image';

import { ImageItem } from '../../../types/products';
import styles from './images.module.css';

interface ImageProps {
    mainImage: ImageItem | null;
    imageCollection: ImageItem[] | null;
}

export const Images: React.FC<ImageProps> = ({ mainImage, imageCollection }) => {
    return (
        <div id="productImagesWrapper" className="flex flex-col w-3/4 mb-4 mx-auto sm:w-1/2 lg:m-0 lg:w-1/4">
            {mainImage && (
                <div id="productImages" className="w-full">
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

            {imageCollection && (
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
};

export default Images;
