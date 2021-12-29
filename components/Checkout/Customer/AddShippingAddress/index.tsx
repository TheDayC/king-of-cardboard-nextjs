import React from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';

interface AddShippingAddressProps {
    register: UseFormRegister<FieldValues>;
    allowShippingAddress: boolean;
    onAllowShippingAddress(e: React.ChangeEvent<HTMLInputElement>): void;
}

const AddShippingAddress: React.FC<AddShippingAddressProps> = ({
    register,
    allowShippingAddress,
    onAllowShippingAddress,
}) => {
    return (
        <div className="p-4 card">
            <div className="form-control">
                <label className="cursor-pointer label">
                    <span className="label-text">Ship to a different address?</span>
                    <input
                        type="checkbox"
                        placeholder="Ship to a different address?"
                        {...register('allowShippingAddress', {})}
                        className="checkbox"
                        onChange={onAllowShippingAddress}
                        defaultChecked={allowShippingAddress}
                    />
                </label>
            </div>
        </div>
    );
};

export default AddShippingAddress;
