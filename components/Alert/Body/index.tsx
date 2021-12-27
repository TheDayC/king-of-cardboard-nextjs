import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { DateTime } from 'luxon';
import { GrClose } from 'react-icons/gr';

import { AlertLevel } from '../../../enums/system';
import { alertClass } from '../../../utils/alert';
import { removeAlert } from '../../../store/slices/alerts';
import Icon from './Icon';

interface ErrorAlertProps {
    id: string;
    message: string;
    level: AlertLevel;
    timestamp: DateTime;
}

export const Body: React.FC<ErrorAlertProps> = ({ id, message, level, timestamp }) => {
    const dispatch = useDispatch();
    const className = alertClass(level);

    // Handle the closing the alert.
    const handleClose = () => {
        dispatch(removeAlert(id));
    };

    // Set a timeout once when the alert is loaded to remove it after 5 seconds.
    useEffect(() => {
        setTimeout(handleClose, 5000);
    }, []);

    return (
        <div className={`alert rounded-md mb-2${className}`}>
            <div className="flex-1">
                <Icon level={level} />
                <label>{message}</label>
            </div>
            <div className="flex-none">
                <button className="btn btn-sm btn-primary">
                    <GrClose className="inline-block w-4 mr-2 stroke-current" onClick={handleClose} />
                </button>
            </div>
        </div>
    );
};

export default Body;
