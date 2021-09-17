import React from 'react';

interface StepsProps {
    currentStep: number;
}

const steps = ['Customer Details', 'Delivery', 'Payment'];

export const Steps: React.FC<StepsProps> = ({ currentStep }) => {
    return (
        <ul className="w-full steps mb-8">
            {steps.map((step, i) => {
                let stepClasses;

                if (i <= currentStep) {
                    stepClasses = 'step step-primary';
                } else {
                    stepClasses = 'step step-neutral';
                }

                return (
                    <li data-content={(i += 1)} className={stepClasses}>
                        {step}
                    </li>
                );
            })}
        </ul>
    );
};

export default Steps;
