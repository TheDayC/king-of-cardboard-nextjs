import React from 'react';

import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';

interface PaginationProps {
    currentPage: number;
    pageCount: number;
    handlePageNumber: (pageNumber: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, pageCount, handlePageNumber }) => {
    const getBtns = () => {
        const btns = [];

        for (let i = 0; i < pageCount; i++) {
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
        <div className="flex flex-row justify-between items-center mt-4 w-full md:mt-8 lg:mt-16">
            <button
                className="btn btn-md btn-outline text-sm border border-gray-400 rounded-none w-1/2 hover:bg-gray-400 hover:border-gray-400 md:w-auto gap-2"
                disabled={currentPage === 0}
                onClick={handlePrevPage}
            >
                <BsArrowLeftCircle className="w-5 h-5" />
                Previous
            </button>
            <div className={`hidden md:grid md:grid-cols-${pageCount < 10 ? pageCount : 10} md:gap-1`}>{getBtns()}</div>
            <button
                className="btn btn-md btn-outline text-sm border border-gray-400 rounded-none w-1/2 hover:bg-gray-400 hover:border-gray-400 md:w-auto gap-2"
                disabled={currentPage === pageCount - 1}
                onClick={handleNextPage}
            >
                Next
                <BsArrowRightCircle className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;
