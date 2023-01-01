import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface PreviewsProps {
    previews: string[];
}

export const Previews: React.FC<PreviewsProps> = ({ previews }) => {
    const [currentPreview, setCurrentPreview] = useState<string | null>(null);

    const changeImage = (preview: string) => {
        if (preview !== currentPreview) {
            setCurrentPreview(preview);
        }
    };

    // When the previews change fill the current preview with the first item in the array.
    useEffect(() => {
        setCurrentPreview(previews[0]);
    }, [previews]);

    if (previews.length === 0) return null;

    return (
        <div id="productImagesWrapper" className="flex flex-col justify-start items-center mb-4">
            {currentPreview && (
                <div className="block justify-center items-start relative rounded-md overflow-hidden">
                    <Image src={currentPreview} width={156} height={156} alt="current preview image" />
                </div>
            )}

            {previews.length > 1 && (
                <div className="grid grid-cols-4 relative w-full">
                    {previews.map((preview, index) => (
                        <div
                            className="w-full cursor-pointer p-2"
                            key={`line-item-${index}`}
                            onClick={() => changeImage(preview)}
                        >
                            <div className="block rounded-md overflow-hidden w-8 h-8 relative shadow-sm transition duration-300 ease-in-out hover:shadow-lg">
                                <Image src={preview} alt="shipment image" fill />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Previews;
