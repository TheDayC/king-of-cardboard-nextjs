import React from 'react';

import { BreakSlot } from '../../../types/breaks';
import { PickYourTeam } from './PickYourTeam';

interface SlotsProps {
    slots: BreakSlot[];
    // format: string;
}

export const Slots: React.FC<SlotsProps> = ({ slots }) => {
    /* switch (format) {
        case 'Pick Your Team':
        case 'Pick Your Team w/ Random':
            return <PickYourTeam slots={slots} />;
        default:
            return null;
    } */
    return <PickYourTeam slots={slots} />;
};

export default Slots;
