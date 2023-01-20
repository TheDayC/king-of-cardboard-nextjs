import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
        <div className="hero bg-white">
            <div className="flex flex-col hero-content p-0 w-full lg:flex-row">
                {shouldReverse ? (
                    <React.Fragment>
                        <div className="rounded-md shadow-2xl relative overflow-hidden w-full h-40 lg:inline-block lg:w-1/4 lg:h-80">
                            <Image
                                src={image_url || ''}
                                alt={`${title}-hero-image`}
                                fill
                                style={{ objectFit: 'cover' }}
                                role="img"
                            />
                        </div>
                        <div className="w-full lg:w-3/4 lg:ml-4">
                            <h1 className="font-bold mb-4 text-2xl lg:text-5xl" role="heading">
                                {title}
                            </h1>
                            {content.length > 0 &&
                                content.map((contentItem, index) => (
                                    <p className="mb-5" key={`hero-p-${index}`}>
                                        {contentItem}
                                    </p>
                                ))}
                            {link && (
                                <Link href={link} passHref>
                                    <button className="btn btn-primary w-full rounded-md lg:w-1/4">{link_title}</button>
                                </Link>
                            )}
                        </div>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <div className="w-full lg:w-3/4 lg:mr-4">
                            <h1 className="font-bold mb-4 text-2xl lg:text-5xl" role="heading">
                                {title}
                            </h1>
                            {content.length > 0 &&
                                content.map((contentItem, index) => (
                                    <p className="mb-5" key={`hero-p-${index}`}>
                                        {contentItem}
                                    </p>
                                ))}
                            {link && (
                                <Link href={link} passHref>
                                    <button className="btn btn-primary w-full rounded-md lg:w-1/4">{link_title}</button>
                                </Link>
                            )}
                        </div>
                        <div className="rounded-md shadow-2xl relative overflow-hidden w-full h-40 lg:inline-block lg:w-1/4 lg:h-80">
                            <Image
                                src={image_url || ''}
                                alt={`${title}-hero-image`}
                                layout="fill"
                                objectFit="cover"
                                role="img"
                            />
                        </div>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default HeroWithImage;
