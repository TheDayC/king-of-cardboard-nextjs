import React from 'react';
import { useSelector } from 'react-redux';

import Body from './Body';
import selector from './selector';

export const Alert: React.FC = () => {
    const { alerts } = useSelector(selector);

    if (alerts.length <= 0) {
        return null;
    }

    return (
        <div className="fixed w-full bottom-0 left-0 p-2 pb-0 md:bottom-2 md:left-4 md:w-auto md:p-0">
            {alerts.map((alert, i) => (
                <Body
                    id={alert.id}
                    message={alert.message}
                    level={alert.level}
                    timestamp={alert.timestamp}
                    key={`error-${i}`}
                />
            ))}
        </div>
    );
};

export default Alert;
