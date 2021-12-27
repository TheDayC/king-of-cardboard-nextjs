import React from 'react';
import { DateTime } from 'luxon';

import { AlertLevel } from '../../../enums/system';
import { alertClass } from '../../../utils/alert';
import Icon from './Icon';

interface ErrorAlertProps {
    id: string;
    message: string;
    level: AlertLevel;
    timestamp: DateTime;
}

export const Body: React.FC<ErrorAlertProps> = ({ id, message, level, timestamp }) => {
    const className = alertClass(level);

    return (
        <div className={`alert rounded-md${className}`}>
            <div className="flex-1">
                <Icon level={level} />
                <label>{message}</label>
            </div>
        </div>
    );
};

export default Body;
