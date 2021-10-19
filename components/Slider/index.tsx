import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { autoplayPlugin, slidesToShowPlugin } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';

import { SliderImage } from '../../types/pages';

const Carousel = dynamic(() => import('@brainhubeu/react-carousel'), {
    ssr: false,
});
interface SliderProps {
    items: SliderImage[];
}

export const Slider: React.FC<SliderProps> = ({ items }) => {
    if (items && items.length > 0) {
        return (
            <div className="mb-8">
                <Carousel
                    plugins={[
                        'infinite',
                        {
                            resolve: autoplayPlugin,
                            options: {
                                interval: 5000,
                            },
                        },
                        'fastSwipe',
                        {
                            resolve: slidesToShowPlugin,
                            options: {
                                numberOfSlides: 1,
                            },
                        },
                    ]}
                    animationSpeed={1000}
                >
                    {items.map((item, index) => (
                        <img
                            src={item.url}
                            alt={item.description}
                            title={item.title}
                            className="w-full"
                            key={`sliderItem-${index}`}
                        />
                    ))}
                </Carousel>
            </div>
        );
    } else {
        return null;
    }
};

export default Slider;
