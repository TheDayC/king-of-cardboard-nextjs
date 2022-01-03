import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Slot from './Slot';
import selector from './selector';
import Loading from '../../../Loading';

export const PickSlotWithRandom: React.FC = () => {
    const { accessToken, currentBreak } = useSelector(selector);
    const [loading, setLoading] = useState(false);
    const { breakSlots } = currentBreak;

    return (
        <div className="w-full relative">
            <Loading show={loading} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {breakSlots.length >= 0 &&
                    breakSlots.map((slot) => (
                        <Slot
                            image={slot.image}
                            sku_code={slot.sku_code}
                            name={slot.name}
                            amount={slot.amount}
                            compare_amount={slot.compare_amount}
                            setLoading={setLoading}
                            key={`team-${slot.name}`}
                        />
                    ))}
            </div>
        </div>
    );
};

export default PickSlotWithRandom;
