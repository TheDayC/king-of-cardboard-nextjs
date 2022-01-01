import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';

import { AlertLevel } from '../../../enums/system';
import { alertClass } from '../../../utils/alert';
import { removeAlert } from '../../../store/slices/alerts';
import Icon from './Icon';

interface ErrorAlertProps {
    id: string;
    message: string;
    level: AlertLevel;
}

export const Body: React.FC<ErrorAlertProps> = ({ id, message, level }) => {
    const dispatch = useDispatch();
    const className = alertClass(level);

    // Handle the closing the alert.
    const handleClose = useCallback(() => {
        dispatch(removeAlert(id));
    }, [id, dispatch]);

    // Set a timeout once when the alert is loaded to remove it after 5 seconds.
    useEffect(() => {
        setTimeout(handleClose, 5000);
    }, [handleClose]);

    return (
        <div
            className={`flex flex-row justify-between items-center rounded-md mb-2 shadow-md p-2 text-neutral-content${className}`}
        >
            <div className="flex-1 mr-2">
                <Icon level={level} />
                <label>{message}</label>
            </div>
            <div className="flex-none">
                <button className="btn btn-sm btn-ghost">
                    <AiOutlineClose className="inline-block text-xl" onClick={handleClose} />
                </button>
            </div>
        </div>
    );
};

export default Body;
