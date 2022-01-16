import { divide } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useStore } from 'react-redux';

interface PaginationProps {
    currentPage: number;
    pageCount: number;
    handlePageNumber: (pageNumber: number) => void;
}

const MAX_PAGES = 5;

export const Pagination: React.FC<PaginationProps> = ({ currentPage, pageCount, handlePageNumber }) => {
    const shouldTruncate = pageCount > MAX_PAGES;

    const getBtns = () => {
        const btns = [];

        for (let i = currentPage; i < currentPage + MAX_PAGES; i++) {
            const visualCount = i + 1;

            if (currentPage === i) {
                btns.push(
                    <button
                        className="btn btn-md bg-primary rounded-none border-r-0 border-l-0 border-primary hover:bg-primary hover:border-primary"
                        onClick={() => handlePageNumber(i)}
                        key={`page-${i}`}
                    >
                        {visualCount}
                    </button>
                );
            } else {
                btns.push(
                    <button
                        className="btn btn-outline btn-md rounded-none border border-gray-400 hover:bg-gray-400 hover:border-gray-400"
                        onClick={() => handlePageNumber(i)}
                        key={`page-${i}`}
                    >
                        {visualCount}
                    </button>
                );
            }
        }

        return btns;
    };

    const handlePrevPage = () => {
        if (currentPage > 0) {
            handlePageNumber(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < pageCount - 1) {
            handlePageNumber(currentPage + 1);
        }
    };

    return (
        <div className="btn-group mt-4 md:mt-8 lg:mt-16">
            <button
                className="btn btn-outline btn-md border border-r-0 border-gray-400 rounded-l-sm w-1/2 hover:bg-gray-400 hover:border-gray-400 lg:w-auto"
                disabled={currentPage <= 0}
                onClick={handlePrevPage}
            >
                Previous
            </button>
            {shouldTruncate && currentPage > 0 && (
                <div className="btn btn-outline btn-md rounded-none border border-gray-400 hover:bg-white hover:border-gray-400 hover:text-neutral">
                    ...
                </div>
            )}
            <div className="hidden lg:inline-block">{getBtns()}</div>
            {shouldTruncate && (
                <div className="btn btn-outline btn-md rounded-none border border-gray-400 hover:bg-white hover:border-gray-400 hover:text-neutral">
                    ...
                </div>
            )}
            <button
                className="btn btn-md btn-outline text-sm border border-l-0 border-gray-400 rounded-r-sm w-1/2 hover:bg-gray-400 hover:border-gray-400 lg:w-auto"
                disabled={currentPage === pageCount - 1}
                onClick={handleNextPage}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
