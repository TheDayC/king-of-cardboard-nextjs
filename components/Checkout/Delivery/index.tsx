import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import selector from './selector';

export const Delivery: React.FC = () => {
    const dispatch = useDispatch();
    const { customerDetails } = useSelector(selector);

    return (
        <div className="flex">
            <h1>Delivery options</h1>
        </div>
    );
};

export default Delivery;
