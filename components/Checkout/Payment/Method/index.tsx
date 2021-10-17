import { FormControlLabel, Radio } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, FieldValues, UseFormRegister, Control } from 'react-hook-form';
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
    control: Control<FieldValues, object>; // eslint-disable-line @typescript-eslint/ban-types
}

export const Method: React.FC<MethodProps> = ({ id, name, sourceType, defaultChecked, register, control }) => {
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
            <FormControlLabel
                value={id}
                defaultChecked={defaultChecked}
                control={
                    <Controller
                        name="firstName"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <Radio {...field} defaultChecked={defaultChecked} />}
                        rules={{
                            required: { value: true, message: 'Required' },
                        }}
                    />
                }
                label={name}
            />
            {showSource && <Source sourceType={sourceType} />}
        </div>
    );
};

export default Method;
