import React from 'react';

export const IssueBanner: React.FC = () => {
    return (
        <div className="flex flex-row justify-center w-full p-2 bg-red-600 text-neutral-content shadow-md text-sm md:text-md">
            <p>
                King of Cardboard will closed from 2nd - 13th Feb. Any orders placed after 30th Jan are not guaranteed
                to be fulfilled prior to closure.
            </p>
        </div>
    );
};

export default IssueBanner;
