import React from 'react';

import Legend from '../Legend';

const slots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export const Skeleton: React.FC = () => {
    return (
        <div className="flex flex-col lg:flex-row relative">
            <div className="flex flex-col w-1/3">
                <div id="productImagesWrapper" className="flex flex-col items-center w-full mb-6">
                    <div id="productImages" className="w-2/3">
                        <div className="h-52 bg-base-200 rounded-sm w-full animate-pulse"></div>
                    </div>
                </div>
                <Legend />
            </div>
            <div id="productDetails" className="flex flex-col items-center w-full lg:w-3/4">
                <div className="card rounded-md shadow-lg bordered p-4 w-full lg:p-6">
                    <div className="h-10 bg-base-200 rounded-sm w-1/2 animate-pulse mb-4"></div>
                    <div className="flex flex-row flex-wrap justify-center items-center mb-4 space-x-2 lg:justify-start">
                        <div className="h-5 bg-base-200 rounded-xl w-10 animate-pulse mb-4"></div>
                    </div>
                    <div className="h-5 bg-base-200 rounded-sm w-3/4 animate-pulse mb-4"></div>
                    <div className="h-5 bg-base-200 rounded-sm w-1/2 animate-pulse mb-8"></div>
                    <div className="w-full relative">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 relative z-10">
                            {slots.map((slot) => (
                                <div
                                    className="flex flex-col justify-center items-center p-2 rounded-sm relative cursor-pointer mb-6"
                                    key={`slot-skeleton-${slot}`}
                                >
                                    <div className="flex flex-row justify-center items-center w-full h-10 md:h-20 lg:h-32 relative mb-2">
                                        <div className="h-32 bg-base-200 rounded-sm w-3/4 animate-pulse"></div>
                                    </div>
                                    <div className="h-3 bg-base-200 rounded-sm w-full animate-pulse mb-4"></div>
                                    <div className="flex flex-row justify-center items-center w-full">
                                        <div className="h-8 bg-base-200 rounded-sm w-1/2 animate-pulse"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skeleton;
