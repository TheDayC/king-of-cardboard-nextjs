import React from 'react';
import { useSelector } from 'react-redux';

import Slot from './Slot';
import selector from './selector';

export const RandomSlot: React.FC = () => {
    const { breakSlots } = useSelector(selector);

    return (
        <div className="w-full relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {breakSlots.length >= 0 &&
                    breakSlots.map((slot) => (
                        <Slot
                            sku_code={slot.sku_code}
                            name={slot.name}
                            amount={slot.amount}
                            compare_amount={slot.compare_amount}
                            key={`team-${slot.name}`}
                        />
                    ))}
            </div>
        </div>
    );
};

export default RandomSlot;
