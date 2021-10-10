import React, { useCallback, useEffect, useState } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';

import { fetchOrder } from '../../../../store/slices/cart';
import { updatePaymentMethod } from '../../../../utils/checkout';
import Source from '../Source';
import selector from './selector';

interface MethodProps {
    id: string;
    name: string;
    sourceType: string;
    defaultChecked: boolean;
    register: UseFormRegister<FieldValues>;
}

export const Method: React.FC<MethodProps> = ({ id, name, sourceType, defaultChecked, register }) => {
    const dispatch = useDispatch();
    const { accessToken, orderId } = useSelector(selector);
    const [showSource, setShowSource] = useState(defaultChecked);
    const [hasUpdatedFromDefault, setHasUpdatedFromDefault] = useState(false);

    const handleChange = () => {
        // TODO: patch order with paymentMethod.
        setShowSource(true);
    };

    const patchPaymentMethodAndFetchOrder = useCallback(
        async (accessToken: string, orderId: string, paymentMethodId: string) => {
            const hasPatchedMethod = await updatePaymentMethod(accessToken, orderId, paymentMethodId);

            if (hasPatchedMethod) {
                dispatch(fetchOrder(true));
            }
        },
        [dispatch]
    );

    useEffect(() => {
        if (defaultChecked && !hasUpdatedFromDefault && accessToken && orderId) {
            patchPaymentMethodAndFetchOrder(accessToken, orderId, id);
            setHasUpdatedFromDefault(true);
        }
    }, [defaultChecked, accessToken, orderId, id, patchPaymentMethodAndFetchOrder, hasUpdatedFromDefault]);

    return (
        <div className="form-control" key={`payment-method-${id}`}>
            <label className="label cursor-pointer">
                <span className="label-text">{name}</span>
            </label>
            <input
                type="radio"
                className="radio"
                value={id}
                defaultChecked={defaultChecked}
                {...register('paymentMethod', {
                    required: { value: true, message: 'Required' },
                })}
                onChange={handleChange}
            />
            {showSource && <Source sourceType={sourceType} />}
        </div>
    );
};

export default Method;
