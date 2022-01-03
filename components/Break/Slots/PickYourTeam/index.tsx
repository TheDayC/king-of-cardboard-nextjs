import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { BreakSlot, BreakSlotWithSku } from '../../../../types/breaks';
import { getSkus } from '../../../../utils/commerce';
import Team from './Team';
import selector from './selector';
import { mergeBreakSlotData } from '../../../../utils/breaks';
import Loading from '../../../Loading';

export const PickYourTeam: React.FC = ({ slots }) => {
    const { accessToken, currentBreak } = useSelector(selector);
    const [skuItemData, setSkuItemData] = useState<BreakSlotWithSku[] | null>(null);
    const [loading, setLoading] = useState(false);
    const { breakSlots } = currentBreak;

    /*     const sku_codes = useMemo(() => {
        if (slots) {
            return slots.filter((slot) => slot).map((slot) => slot.productLink);
        } else {
            return [];
        }
    }, [slots]);

    const fetchSkuItems = useCallback(
        async (token: string, skus: string[]) => {
            const skuItems = await getSkus(token, skus);

            if (skuItems) {
                const slotWithSkuData = mergeBreakSlotData(slots, skuItems);

                if (slotWithSkuData) {
                    setSkuItemData(slotWithSkuData);
                }
            }
        },
        [slots]
    );

    useEffect(() => {
        if (accessToken && sku_codes) {
            fetchSkuItems(accessToken, sku_codes);
        }
    }, [accessToken, sku_codes, fetchSkuItems]); */

    return (
        <div className="w-full relative">
            <Loading show={loading} />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {breakSlots.length >= 0 &&
                    breakSlots.map((slot) => (
                        <Team
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

export default PickYourTeam;
