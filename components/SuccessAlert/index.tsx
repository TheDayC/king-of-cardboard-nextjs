import React from 'react';
import { BsFillCheckCircleFill } from 'react-icons/bs';

interface SuccessAlertProps {
    msg: string | null;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({ msg }) => {
    if (!msg) {
        return null;
    }

    return (
        <div className="alert alert-success rounded-md">
            <div className="flex-1">
                <BsFillCheckCircleFill className="inline-block w-6 h-6 mx-2 stroke-current" />
                <label>{msg}</label>
            </div>
        </div>
    );
};

export default SuccessAlert;
