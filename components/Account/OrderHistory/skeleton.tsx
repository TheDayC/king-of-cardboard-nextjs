import React from 'react';

const orders = [1, 2, 3, 4, 5];

export const Skeleton: React.FC = () => {
    return (
        <React.Fragment>
            {orders.map((order) => (
                <div className="card card-side bordered rounded-md mb-2" key={`order-skeleton-${order}`}>
                    <div className="card-body p-2 md:p-4">
                        <div className="flex flex-row justify-between items-center">
                            <div className="flex flex-col">
                                <div className="h-8 bg-base-200 rounded-sm w-1/3 animate-pulse mb-4"></div>
                                <div className="flex flex-col mb-4 md:flex-row">
                                    <div className="text-xs text-gray-400 mb-1 md:mb-0">
                                        Placed on:{' '}
                                        <div className="h-3 bg-base-200 rounded-sm w-10 animate-pulse inline-block"></div>
                                    </div>
                                    <div className="text-xs text-gray-400 md:ml-2">
                                        Updated on:{' '}
                                        <div className="h-3 bg-base-200 rounded-sm w-10 animate-pulse inline-block"></div>
                                    </div>
                                </div>
                                <div className="flex flex-row mb-4">
                                    <div className="text-xs text-gray-400 mr-2">
                                        <b>Items:</b>{' '}
                                        <div className="h-3 bg-base-200 rounded-sm w-10 animate-pulse inline-block"></div>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        <b>Shipments:</b>{' '}
                                        <div className="h-3 bg-base-200 rounded-sm w-10 animate-pulse inline-block"></div>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row mb-2">
                                    <div className="flex flex-row justify-start items-center text-md lg:text-lg lg:justify-center lg:items-center lg:mr-6">
                                        <h3 className="mr-2">Order:</h3>
                                        <div
                                            className={`rounded-full w-2.5 h-2.5 md:w-3 md:h-3 bg-gray-400 mr-2`}
                                        ></div>
                                        <div className="h-5 bg-base-200 rounded-sm w-24 animate-pulse inline-block"></div>
                                    </div>
                                    <div className="flex flex-row justify-start items-center text-md lg:text-lg lg:justify-center lg:items-center lg:mr-6">
                                        <h3 className="mr-2">Payment:</h3>
                                        <div
                                            className={`rounded-full w-2.5 h-2.5 md:w-3 md:h-3 bg-gray-400 mr-2`}
                                        ></div>
                                        <div className="h-5 bg-base-200 rounded-sm w-24 animate-pulse inline-block"></div>
                                    </div>
                                    <div className="flex flex-row justify-start items-center text-md mr-0 lg:text-lg lg:justify-center lg:items-center">
                                        <h3 className="mr-2">Fulfillment:</h3>
                                        <div
                                            className={`rounded-full w-2.5 h-2.5 md:w-3 md:h-3 bg-gray-400 mr-2`}
                                        ></div>
                                        <div className="h-5 bg-base-200 rounded-sm w-24 animate-pulse inline-block"></div>
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="text-xl">
                                        <b>Total:</b>{' '}
                                        <div className="h-5 bg-base-200 rounded-sm w-24 animate-pulse inline-block"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex">
                                <div className="stack">
                                    <div className="h-32 bg-base-200 rounded-sm w-32 animate-pulse inline-block"></div>
                                    <div className="h-32 bg-base-200 rounded-sm w-32 animate-pulse inline-block"></div>
                                    <div className="h-32 bg-base-200 rounded-sm w-32 animate-pulse inline-block"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </React.Fragment>
    );
};

export default Skeleton;
