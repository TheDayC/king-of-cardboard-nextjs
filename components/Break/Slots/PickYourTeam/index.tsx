import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BreakSlot, BreakSlotWithSku } from '../../../../types/breaks';
import { SkuItem } from '../../../../types/commerce';
import { getSkus } from '../../../../utils/commerce';
import Team from './Team';
import selector from './selector';
import { mergeBreakSlotData } from '../../../../utils/breaks';
import Loading from '../../../Loading';
import { addAlert } from '../../../../store/slices/alerts';
import { AlertLevel } from '../../../../enums/system';
import { isArrayOfErrors, isError } from '../../../../utils/typeguards';

interface PickYourTeamProps {
    slots: BreakSlot[];
}

export const PickYourTeam: React.FC<PickYourTeamProps> = ({ slots }) => {
    const { accessToken } = useSelector(selector);
    const [skuItemData, setSkuItemData] = useState<BreakSlotWithSku[] | null>(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const sku_codes = useMemo(() => {
        if (slots) {
            return slots.filter((slot) => slot).map((slot) => slot.productLink);
        } else {
            return [];
        }
    }, [slots]);

    const fetchSkuItems = useCallback(async (token: string, skus: string[]) => {
        const skuItems = await getSkus(token, skus);

        if (isArrayOfErrors(skuItems)) {
            skuItems.forEach((value) => {
                dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
            });
        } else {
            if (skuItems) {
                const slotWithSkuData = mergeBreakSlotData(slots, skuItems);

                if (slotWithSkuData) {
                    setSkuItemData(slotWithSkuData);
                }
            }
        }
    }, []);

    useEffect(() => {
        if (accessToken && sku_codes) {
            fetchSkuItems(accessToken, sku_codes);
        }
    }, [accessToken, sku_codes]);

    if (skuItemData) {
        return (
            <div className="w-full relative">
                <Loading show={loading} />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {skuItemData.map((skuItem, index) => {
                        return <Team skuItem={skuItem} setLoading={setLoading} key={`team-${index}`} />;
                    })}
                </div>
            </div>
        );
    }

    return null;
};

export default PickYourTeam;
