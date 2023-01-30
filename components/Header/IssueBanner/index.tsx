import React, { useState, useEffect } from 'react';

import { getOptions } from '../../../utils/account/options';

export const IssueBanner: React.FC = () => {
    const [errorMessage, setErrorMessage] = useState('');

    const fetchOptions = async () => {
        const { errorMessage } = await getOptions();

        setErrorMessage(errorMessage);
    };

    useEffect(() => {
        fetchOptions();
    }, []);

    if (errorMessage.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-row justify-center w-full p-2 bg-red-600 text-neutral-content shadow-md text-sm md:text-md">
            <p>{errorMessage}</p>
        </div>
    );
};

export default IssueBanner;
