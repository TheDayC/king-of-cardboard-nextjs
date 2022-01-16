import React from 'react';

const products = [1, 2, 3, 4, 5, 6, 7, 8];

export const Skeleton: React.FC = () => {
    return (
        <div className="grid gap-4 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl2:grid-cols-6">
            {products.map((product) => (
                <div
                    className="card shadow-md rounded-md bordered pt-4 transition duration-300 ease-in-out hover:shadow-2xl"
                    data-testid="product-card"
                    key={`product-skeleton-${product}`}
                >
                    <div className="relative w-full h-40 cursor-pointer flex flex-row justify-center">
                        <div className="h-32 bg-base-200 rounded-sm w-1/2 animate-pulse"></div>
                    </div>
                    <div className="justify-between items-center card-body px-6 py-4">
                        <div className="flex flex-col justify-start items-center w-full">
                            <div className="h-10 bg-base-200 rounded-sm w-3/4 mb-2 animate-pulse"></div>
                            <div className="flex flex-row flex-wrap justify-center items-center w-full">
                                <div className="h-5 bg-base-200 rounded-xl w-1/4 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="card-actions w-full">
                            <div className="flex flex-row justify-end items-center w-full">
                                <div className="h-10 bg-base-200 rounded-sm w-20 animate-pulse"></div>
                            </div>
                            <div className="h-12 bg-base-200 rounded-sm w-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Skeleton;
