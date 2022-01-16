import React from 'react';

const breaks = [1, 2, 3, 4, 5, 6, 7, 8];

export const Skeleton: React.FC = () => {
    return (
        <div className="flex flex-col w-full">
            <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl2:grid-cols-6">
                {breaks.map((b) => (
                    <div
                        className="card shadow-md rounded-md bordered pt-4 transition duration-300 ease-in-out hover:shadow-2xl"
                        key={`skeleton-break-${b}`}
                    >
                        <div className="flex flex-col justify-center items-center relative h-20 cursor-pointer md:h-30 lg:h-40">
                            <div className="h-20 bg-base-200 rounded-sm w-3/4 md:h-30 lg:h-40 animate-pulse"></div>
                        </div>
                        <div className="justify-between items-start card-body p-0">
                            <div className="flex flex-col justify-start items-start w-full">
                                <div className="p-4 mt-4 lg:p-6">
                                    <div className="h-8 bg-base-200 rounded-sm w-32 mb-2 animate-pulse"></div>
                                    <div className="h-6 bg-base-200 rounded-sm w-52 mb-6 animate-pulse"></div>
                                    <div className="pl-0">
                                        <p className="text-base-200 text-sm">
                                            <div className="h-3 bg-base-200 rounded-sm w-20 mb-2 animate-pulse"></div>
                                        </p>
                                        <p className="text-base-200 text-sm">
                                            <div className="h-3 bg-base-200 rounded-sm w-20 mb-2 animate-pulse"></div>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex h-10 w-full bg-base-200 p-2 py-0 mb-4 text-neutral-content animate-pulse"></div>
                                <div className="flex flex-row flex-wrap justify-center items-start w-full px-2 lg:px-6">
                                    <div className="h-6 bg-base-200 rounded-xl w-10 animate-pulse"></div>
                                </div>
                            </div>
                            <div className="card-actions w-full p-6 pt-0 mt-0 flex flex-col items-center">
                                <div className="h-8 bg-base-200 rounded-sm w-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Skeleton;
