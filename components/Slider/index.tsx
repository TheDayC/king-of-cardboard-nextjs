import React from 'react';
import { Fade } from 'react-slideshow-image';

import { SliderImage } from '../../types/pages';

interface SliderProps {
    images: SliderImage[];
}

const Slider: React.FC<SliderProps> = ({ images }) => {
    return (
        <div className="slide-container w-full max-w-7xl mb-8 rounded-lg overflow-x-hidden">
            <Fade>
                {images.map((image, index) => (
                    <div className="each-fade" key={`slide-${index}`}>
                        <div className="image-container">
                            <img src={image.url} title={image.title} alt={image.description} />
                        </div>
                    </div>
                ))}
            </Fade>
        </div>
    );
};

export default Slider;
