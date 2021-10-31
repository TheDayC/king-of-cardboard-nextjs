import React from 'react';

import { BreakSlot } from '../../../types/breaks';
import { PickYourTeam } from './PickYourTeam';

interface SlotsProps {
    slots: BreakSlot[];
    format: string;
}

export const Slots: React.FC<SlotsProps> = ({ slots, format }) => {
    switch (format) {
        case 'Pick Your Team':
            return <PickYourTeam slots={slots} />;
        default:
            return null;
    }
};

export default Slots;
