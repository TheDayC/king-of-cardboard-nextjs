import React from 'react';
import { useSelector } from 'react-redux';

import { PickSlot } from './PickSlot';
import PickSlotWithRandom from './PickSlotWithRandom';
import selector from './selector';

export const Slots: React.FC = () => {
    const { format } = useSelector(selector);

    switch (format) {
        case 'Pick Your Team':
        case 'Pick Your Colour':
        case 'Pick Your Type':
            return <PickSlot isRandom={false} />;
        case 'Pick Your Team w/ Random':
            return <PickSlotWithRandom />;
        case 'Random Teams':
        case 'Random Packs':
        case 'Random Colours':
        case 'Random Types':
            return <PickSlot isRandom />;
        default:
            return null;
    }
};

export default Slots;
