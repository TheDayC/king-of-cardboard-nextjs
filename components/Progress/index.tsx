import React from 'react';

interface ProgressProps {
    complete: number;
    colour: string;
    current: number;
    max: number;
}

export const Progress: React.FC<ProgressProps> = ({ complete, colour, current, max }) => {
    const percentage = `${complete}%`;
    const textColour = complete >= 75 ? 'white' : 'base-content';

    return (
        <div
            className="w-full h-6 artboard bg-gray-100 rounded-sm relative overflow-hidden mt-4"
            aria-label="progress-bar"
        >
            <span className="absolute inset-0">
                <div className={`flex h-full justify-center items-center text-xs text-${textColour}`}>
                    {current}/{max} ({percentage})
                </div>
            </span>
            <span
                className={`h-full block rounded-sm bg-${colour}`}
                style={{
                    width: percentage,
                }}
            ></span>
        </div>
    );
};

export default Progress;
