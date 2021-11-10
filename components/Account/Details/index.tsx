import React from 'react';

import UpdatePassword from './UpdatePassword';
import UpdateUsername from './UpdateUsername';

export const Details: React.FC = () => {
    return (
        <div className="flex flex-row w-full justify-between">
            <div className="flex flex-col w-1/3 mb-6">
                <h3 className="text-4xl mb-4">Update your username</h3>
                <UpdateUsername />
            </div>

            <div className="flex flex-col w-1/3 mb-6">
                <h3 className="text-4xl mb-4">Update your password</h3>
                <UpdatePassword />
            </div>
        </div>
    );
};

export default Details;
