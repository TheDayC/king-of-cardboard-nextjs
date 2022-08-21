import React from 'react';

export const IssueBanner: React.FC = () => {
    return (
        <div className="flex flex-row justify-center w-full p-2 bg-red-600 text-neutral-content shadow-md text-sm md:text-md">
            <p>Royal Mail strikes: 26th & 31st August, 8th - 9th September.</p>
        </div>
    );
};

export default IssueBanner;
