import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import selector from './selector';
import { setCurrentStep } from '../../../store/slices/checkout';

export const Payment: React.FC = () => {
    const dispatch = useDispatch();
    const { currentStep } = useSelector(selector);
    const isCurrentStep = currentStep === 2;

    const handleEdit = () => {
        dispatch(setCurrentStep(1));
    };

    return (
        <div className="flex">
            <div className={`collapse collapse-${isCurrentStep ? 'open' : 'closed'}`}>
                <h3 className="collapse-title text-xl font-medium" onClick={handleEdit}>
                    {!isCurrentStep ? 'Payment - Edit' : 'Payment'}
                </h3>
                <div className="collapse-content"></div>
            </div>
        </div>
    );
};

export default Payment;
