import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setSameAsBilling } from '../../../../store/slices/checkout';
import selector from './selector';

const ShipToBilling: React.FC = () => {
    const { isShippingSameAsBilling } = useSelector(selector);
    const dispatch = useDispatch();

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSameAsBilling(e.target.checked));
    };

    return (
        <div className="p-4 card">
            <div className="form-control">
                <label className="cursor-pointer label">
                    <span className="label-text text-lg">Ship to your billing address?</span>
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

export default ShipToBilling;
