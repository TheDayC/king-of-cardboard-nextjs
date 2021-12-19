import React from 'react';
import { useSelector } from 'react-redux';

import { ErrorLevel } from '../../enums/system';
import ErrorAlert from '../ErrorAlert';
import selector from './selector';

export const Alert: React.FC = () => {
    const { errors } = useSelector(selector);

    /* if (!errors || errors.length <= 0) {
        return null;
    } */

    return (
        <div className="fixed bottom-5 left-5">
            {errors &&
                errors.map((error, i) => {
                    switch (error.level) {
                        case ErrorLevel.Error:
                            return <ErrorAlert error={error.message} key={`error-${i}`} />;
                        default:
                            return null;
                    }
                })}
        </div>
    );
};

export default Alert;
