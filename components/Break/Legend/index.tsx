import React from 'react';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';

export const Legend: React.FC = () => {
    return (
        <div className="flex flex-col w-full relative pr-6">
            <h3 className="text-2xl">Key / Legend</h3>
            <div className="divider lightDivider"></div>
            <p className="text-sm">
                <GiPerspectiveDiceSixFacesRandom className="text-3xl text-accent mr-2 inline-block" />A random slot
                (Team, Colour, Type) with your purchase.
            </p>
        </div>
    );
};

export default Legend;
