import React from 'react';
import { useSelector } from 'react-redux';

import Body from './Body';
import selector from './selector';

export const Alert: React.FC = () => {
    const { errors } = useSelector(selector);

    if (!errors || errors.length <= 0) {
        return null;
    }

    return (
        <div className="fixed bottom-5 left-5">
            {errors && errors.map((error, i) => <Body msg={error.message} level={error.level} key={`error-${i}`} />)}
        </div>
    );
};

export default Alert;
