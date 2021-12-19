import React from 'react';

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
                        className="btn btn-outline btn-sm btn-active rounded-none"
                        onClick={() => handlePageNumber(i)}
                        key={`page-${i}`}
                    >
                        {visualCount}
                    </button>
                );
            } else {
                btns.push(
                    <button
                        className="btn btn-outline btn-sm rounded-none"
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
                className="btn btn-outline btn-sm rounded-l-md w-1/2 lg:w-auto"
                disabled={currentPage <= 0}
                onClick={handlePrevPage}
            >
                Previous
            </button>
            <div className="hidden lg:inline-block">{getBtns()}</div>
            <button
                className="btn btn-outline btn-sm rounded-r-md w-1/2 lg:w-auto"
                disabled={currentPage === pageCount - 1}
                onClick={handleNextPage}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
