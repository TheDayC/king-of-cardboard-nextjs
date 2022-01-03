import React from 'react';

import { BreakSlot } from '../../../types/breaks';
import { PickYourTeam } from './PickYourTeam';

export const Slots: React.FC = () => {
    /* switch (format) {
        case 'Pick Your Team':
        case 'Pick Your Team w/ Random':
            return <PickYourTeam slots={slots} />;
        default:
            return null;
    } */
    return <PickYourTeam />;
};

export default Slots;
