import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Slot from './Slot';
import selector from './selector';
import Loading from '../../../Loading';

interface PickSlotProps {
    isRandom: boolean;
}

export const PickSlot: React.FC<PickSlotProps> = ({ isRandom }) => {
    const { currentBreak } = useSelector(selector);
    const [loading, setLoading] = useState(false);
    const { breakSlots } = currentBreak;

    return (
        <div className="w-full relative">
            <Loading show={loading} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 relative z-10">
                {breakSlots.length >= 0 &&
                    breakSlots.map((slot) => (
                        <Slot
                            image={slot.image}
                            sku_code={slot.sku_code}
                            name={slot.name}
                            amount={slot.amount}
                            compare_amount={slot.compare_amount}
                            isAvailable={slot.isAvailable}
                            setLoading={setLoading}
                            isRandom={isRandom}
                            key={`team-${slot.name}`}
                        />
                    ))}
            </div>
        </div>
    );
};

export default PickSlot;
