import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import styles from './hero.module.css';

interface HeroWithImageProps {
    title: string;
    content: string[];
    image_url?: string;
    link?: string;
    link_title?: string;
    shouldReverse: boolean;
}

export const HeroWithImage: React.FC<HeroWithImageProps> = ({
    title,
    content,
    image_url,
    link,
    link_title,
    shouldReverse,
}) => {
    return (
        <div className="hero p-6 bg-white">
            <div className={`flex-col hero-content p-0 lg:flex-row${shouldReverse ? '-reverse' : ''}`}>
                {image_url && (
                    <div className={styles.imageContainer}>
                        <Image src={image_url} alt={`${title}-hero-image`} layout="fill" objectFit="cover" />
                    </div>
                )}
                <div className={`${shouldReverse ? 'mr-4' : 'ml-4'}`}>
                    <h1 className="mb-5 text-5xl font-bold">{title}</h1>
                    {content.length > 0 &&
                        content.map((contentItem, index) => (
                            <p className="mb-5" key={`hero-p-${index}`}>
                                {contentItem}
                            </p>
                        ))}
                    {link && (
                        <Link href={link} passHref>
                            <button className="btn btn-primary">{link_title}</button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeroWithImage;
