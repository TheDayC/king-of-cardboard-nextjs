import React from 'react';

import { AlertLevel } from '../../../enums/system';
import { alertClass } from '../../../utils/alert';
import Icon from './Icon';

interface ErrorAlertProps {
    msg: string | null;
    level: AlertLevel;
}

export const Body: React.FC<ErrorAlertProps> = ({ msg, level }) => {
    if (!msg) {
        return null;
    }

    const className = alertClass(level);

    return (
        <div className={`alert rounded-md${className}`}>
            <div className="flex-1">
                <Icon level={level} />
                <label>{msg}</label>
            </div>
        </div>
    );
};

export default Body;
