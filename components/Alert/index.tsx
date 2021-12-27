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
        <div className="fixed bottom-5 left-5">
            {alerts.map((alert, i) => (
                <Body
                    id={alert.id}
                    msg={alert.message}
                    level={alert.level}
                    timestamp={alert.timestamp}
                    key={`error-${i}`}
                />
            ))}
        </div>
    );
};

export default Alert;
