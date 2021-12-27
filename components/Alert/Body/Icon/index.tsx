import React from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { AiOutlineWarning, AiOutlineBell } from 'react-icons/ai';

import { ErrorLevel } from '../../../../enums/system';

interface IconProps {
    level: ErrorLevel;
}

const classes = 'inline-block w-6 h-6 mx-2 stroke-current';

export const Icon: React.FC<IconProps> = ({ level }) => {
    switch (level) {
        case ErrorLevel.Error:
            return <BiErrorCircle className={classes} />;
        case ErrorLevel.Warning:
            return <AiOutlineWarning className={classes} />;
        case ErrorLevel.Success:
            return <BsFillCheckCircleFill className={classes} />;
        default:
            return <AiOutlineBell className={classes} />;
    }
};

export default Icon;
