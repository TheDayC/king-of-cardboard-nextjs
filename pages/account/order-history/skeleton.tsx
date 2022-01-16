import React from 'react';
import { IoLocationSharp } from 'react-icons/io5';

export const Skeleton: React.FC = () => {
    return (
        <div className="flex flex-col relative w-full px-2 py-0 md:w-3/4 md:px-4 md:px-8">
            <div className="flex w-full flex-col">
                <div className="h-10 bg-base-200 rounded-sm w-1/2 mb-2 animate-pulse"></div>
                <div className="flex flex-row mb-2">
                    <div className="h-5 bg-base-200 rounded-sm w-1/3 animate-pulse"></div>
                </div>
                <div className="flex flex-row">
                    <div className="h-5 bg-base-200 rounded-sm w-20 mr-2 animate-pulse"></div>
                    <div className="h-5 bg-base-200 rounded-sm w-20 animate-pulse"></div>
                </div>
                <div className="divider lightDivider"></div>
                <div className="flex flex-row w-full">
                    <div className="flex flex-row justify-center items-center">
                        <h3 className="text-lg mr-2">Order:</h3>
                        <div className="rounded-full w-3 h-3 bg-base-200 mr-2 animate-pulse"></div>
                        <div className="h-5 bg-base-200 rounded-sm w-20 animate-pulse"></div>
                    </div>
                    <div className="divider divider-vertical lightDivider"></div>
                    <div className="flex flex-row justify-center items-center">
                        <h3 className="text-lg mr-2">Payment:</h3>
                        <div className="rounded-full w-3 h-3 bg-base-200 mr-2 animate-pulse"></div>
                        <div className="h-5 bg-base-200 rounded-sm w-20 animate-pulse"></div>
                    </div>
                    <div className="divider divider-vertical lightDivider"></div>
                    <div className="flex flex-row justify-center items-center">
                        <h3 className="text-lg mr-2">Fulfillment:</h3>
                        <div className="rounded-full w-3 h-3 bg-base-200 mr-2 animate-pulse"></div>
                        <div className="h-5 bg-base-200 rounded-sm w-20 animate-pulse"></div>
                    </div>
                </div>
                <div className="divider lightDivider"></div>
                <div className="flex flex-col">
                    <h3 className="text-2xl mb-4">Payment Method</h3>
                    <div className="flex flex-row justify-start items-start">
                        <div className="brand text-3xl text-secondary mr-2">
                            <div className="h-7 bg-base-200 rounded-sm w-10 animate-pulse"></div>
                        </div>
                        <div className="h-7 bg-base-200 rounded-sm w-20 mr-2 animate-pulse"></div>
                        <div className="h-7 bg-base-200 rounded-sm w-20 animate-pulse"></div>
                    </div>
                </div>
                <div className="divider lightDivider"></div>
                <div className="flex flex-row justify-start items-start w-full">
                    <div className="flex flex-col">
                        <h4 className="text-2xl mb-4">Billing Address</h4>
                        <div className="flex flex-row justify-start align-start space-x-2">
                            <IoLocationSharp className="mt-1 text-accent" />
                            <div className="block w-full text-md">
                                <div className="h-3 bg-base-200 rounded-sm w-full mb-2 animate-pulse"></div>
                                <div className="h-3 bg-base-200 rounded-sm w-full mb-2 animate-pulse"></div>
                                <div className="h-3 bg-base-200 rounded-sm w-full mb-2 animate-pulse"></div>
                                <div className="h-3 bg-base-200 rounded-sm w-full mb-2 animate-pulse"></div>
                                <div className="h-3 bg-base-200 rounded-sm w-full mb-2 animate-pulse"></div>
                                <div className="h-3 bg-base-200 rounded-sm w-full mb-2 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                    <div className="divider divider-vertical lightDivider"></div>
                    <div className="flex flex-col">
                        <h4 className="text-2xl mb-4">Shipping Address</h4>
                        <div className="flex flex-row justify-start align-start space-x-2">
                            <IoLocationSharp className="mt-1 text-accent" />

                            <div className="block w-full text-md">
                                <div className="h-3 bg-base-200 rounded-sm w-full mb-2 animate-pulse"></div>
                                <div className="h-3 bg-base-200 rounded-sm w-full mb-2 animate-pulse"></div>
                                <div className="h-3 bg-base-200 rounded-sm w-full mb-2 animate-pulse"></div>
                                <div className="h-3 bg-base-200 rounded-sm w-full mb-2 animate-pulse"></div>
                                <div className="h-3 bg-base-200 rounded-sm w-full mb-2 animate-pulse"></div>
                                <div className="h-3 bg-base-200 rounded-sm w-full mb-2 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="divider lightDivider"></div>
                <div className="flex flex-col justify-start items-start w-full">
                    <h3 className="text-2xl mb-4">Items</h3>
                    <div className="flex flex-row w-full">
                        <div className="flex flex-row w-full justify-between items-center px-4">
                            <div className="relative w-20 h-20">
                                <div className="h-20 bg-base-200 rounded-sm w-full animate-pulse"></div>
                            </div>
                            <div className="flex-grow mx-4">
                                <div className="h-3 bg-base-200 rounded-sm w-31/2 mb-2 animate-pulse"></div>
                                <div className="h-3 bg-base-200 rounded-sm w-3/4 mb-2 animate-pulse"></div>
                                <div className="h-3 bg-base-200 rounded-sm w-20 mb-2 animate-pulse"></div>
                            </div>
                            <div className="h-5 bg-base-200 rounded-sm w-20 animate-pulse"></div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-end items-end">
                    <div className="text-md mb-2">
                        <b>Shipping:</b>{' '}
                        <div className="h-4 bg-base-200 rounded-sm w-20 inline-block animate-pulse"></div>
                    </div>
                    <div className="text-md mb-2">
                        <b>Discount:</b>{' '}
                        <div className="h-4 bg-base-200 rounded-sm w-20 inline-block animate-pulse"></div>
                    </div>
                    <div className="text-md mb-4">
                        <b>Subtotal:</b>{' '}
                        <div className="h-4 bg-base-200 rounded-sm w-20 inline-block animate-pulse"></div>
                    </div>
                    <div className="text-3xl">
                        <b>Total:</b> <div className="h-8 bg-base-200 rounded-sm w-20 inline-block animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skeleton;
