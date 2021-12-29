import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AlertLevel } from '../../../../enums/system';
import { addAlert } from '../../../../store/slices/alerts';
import { setSameAsBilling } from '../../../../store/slices/checkout';
import { setCheckoutLoading } from '../../../../store/slices/global';
import { updateSameAsBilling } from '../../../../utils/checkout';
import { isArrayOfErrors } from '../../../../utils/typeguards';
import selector from './selector';

const AddShippingAddress: React.FC = () => {
    const { orderId, accessToken, isShippingSameAsBilling } = useSelector(selector);
    const dispatch = useDispatch();

    const handleUpdateSameAsBilling = async (token: string, id: string, checked: boolean) => {
        dispatch(setCheckoutLoading(true));
        const res = await updateSameAsBilling(token, id, checked);

        if (isArrayOfErrors(res)) {
            res.forEach((value) => {
                dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
            });
        } else {
            dispatch(setSameAsBilling(checked));
        }

        dispatch(setCheckoutLoading(false));
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (accessToken && orderId) {
            handleUpdateSameAsBilling(accessToken, orderId, e.target.checked);
        }
    };

    return (
        <div className="p-4 card">
            <div className="form-control">
                <label className="cursor-pointer label">
                    <span className="label-text">Ship to your billing address?</span>
                    <input
                        type="checkbox"
                        className="checkbox"
                        onChange={handleOnChange}
                        defaultChecked={isShippingSameAsBilling}
                    />
                </label>
            </div>
        </div>
    );
};

export default AddShippingAddress;
