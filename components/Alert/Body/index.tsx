import React from 'react';

import { ErrorLevel } from '../../../enums/system';
import { alertClass } from '../../../utils/alert';
import Icon from './Icon';

interface ErrorAlertProps {
    msg: string | null;
    level: ErrorLevel;
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
