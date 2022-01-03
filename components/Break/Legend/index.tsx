import React from 'react';
import { GiPerspectiveDiceSixFacesRandom, GiCardRandom } from 'react-icons/gi';

export const Legend: React.FC = () => {
    return (
        <div className="flex flex-col w-full relative pr-6">
            <h3 className="text-2xl">Key / Legend</h3>
            <div className="divider lightDivider"></div>
            <p className="text-sm mb-4">
                <GiPerspectiveDiceSixFacesRandom className="text-3xl text-accent mr-2 inline-block" />
                <span>You&apos;ll receive a random slot with your purchase at the start of the stream.</span>
            </p>
            <p className="text-sm">
                <GiCardRandom className="text-3xl text-gray-500 mr-2 inline-block" />
                <span>Your purchased slot will be random.</span>
            </p>
        </div>
    );
};

export default Legend;
