import React from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { AiOutlineWarning, AiOutlineBell } from 'react-icons/ai';

import { AlertLevel } from '../../../../enums/system';

interface IconProps {
    level: AlertLevel;
}

const classes = 'inline-block w-6 h-6 mx-2 stroke-current';

export const Icon: React.FC<IconProps> = ({ level }) => {
    switch (level) {
        case AlertLevel.Error:
            return <BiErrorCircle className={classes} />;
        case AlertLevel.Warning:
            return <AiOutlineWarning className={classes} />;
        case AlertLevel.Success:
            return <BsFillCheckCircleFill className={classes} />;
        default:
            return <AiOutlineBell className={classes} />;
    }
};

export default Icon;
