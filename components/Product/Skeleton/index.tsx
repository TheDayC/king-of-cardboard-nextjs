import React from 'react';

export const Skeleton: React.FC = () => {
    return (
        <div className="flex flex-col relative lg:flex-row lg:space-x-8">
            <div className="flex flex-col w-full animate-pulse lg:w-auto">
                <div className="flex-1 w-40 lg:w-60 mx-auto">
                    <div className="w-full h-80 bg-base-200 rounded-sm w-3/4"></div>
                </div>
            </div>

            <div id="productDetails" className="flex-grow">
                <div className="card rounded-md shadow-lg p-2 md:p-4 lg:p-8">
                    <div className="block relative w-full space-y-4 animate-pulse">
                        <div className="h-10 bg-base-200 rounded-sm w-1/2"></div>
                        <div className="h-5 bg-base-200 rounded-sm w-16"></div>
                        <div className="h-3.5 bg-base-200 rounded-sm w-10"></div>
                        <div className="h-5 bg-base-200 rounded-sm w-10"></div>
                    </div>
                    <div className="quantity mt-4 flex flex-col justify-center animate-pulse">
                        <div className="flex flex-col lg:flex-row justify-start align-center lg:space-x-2">
                            <div className="h-16 bg-base-200 rounded-sm w-44"></div>
                            <div className="h-16 bg-base-200 rounded-sm w-44"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skeleton;
