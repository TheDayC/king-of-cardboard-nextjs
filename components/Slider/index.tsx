import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

import { SliderImage } from '../../types/pages';
import { useRecursiveTimeout } from '../../utils/pages';

const AUTOPLAY_INTERVAL = 5000;

interface SliderProps {
    items: SliderImage[];
}

export const Slider: React.FC<SliderProps> = ({ items }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        axis: 'x',
        loop: true,
    });

    // Create a callback to handle the autoplay order.
    const autoplay = useCallback(() => {
        if (!emblaApi) {
            return;
        }

        if (emblaApi.canScrollNext()) {
            emblaApi.scrollNext();
        } else {
            emblaApi.scrollTo(0);
        }
    }, [emblaApi]);

    // A recursive timeout function to let us start and stop the autoplaying carousel.
    const { play, stop } = useRecursiveTimeout(autoplay, AUTOPLAY_INTERVAL);

    // Check for pointer up and down to see if we should effectively pause the carousel.
    useEffect(() => {
        if (!emblaApi) {
            return;
        }

        emblaApi.on('pointerDown', stop);
        emblaApi.on('pointerUp', play);
    }, [emblaApi, stop, play]);

    // Start the carousel.
    useEffect(() => {
        play();
    }, [play]);

    return (
        <div className="mb-8">
            <div className="embla" ref={emblaRef}>
                <div className="embla__container">
                    {items.map((item, index) => (
                        <div className="embla__slide" key={`sliderItem-${index}`}>
                            <img src={item.url} alt={item.description} title={item.title} className="w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Slider;
