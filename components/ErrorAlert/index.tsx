import React from 'react';
import { BiErrorCircle } from 'react-icons/bi';

interface ErrorAlertProps {
    error: string | null;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
    if (!error) {
        return null;
    }

    return (
        <div className="alert alert-error rounded-md">
            <div className="flex-1">
                <BiErrorCircle className="w-6 h-6 mx-2 stroke-current" />
                <label>{error}</label>
            </div>
        </div>
    );
};

export default ErrorAlert;
