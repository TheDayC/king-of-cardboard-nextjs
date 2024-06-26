import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { IconType } from 'react-icons/lib';

import { SelectOptions } from '../../../../types/products';

interface SelectFieldProps {
    instruction: string;
    placeholder: string;
    fieldName: string;
    error: string | null;
    options: SelectOptions[];
    register: UseFormRegister<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    Icon: IconType;
    defaultValue?: string | number;
}

export const SelectField: React.FC<SelectFieldProps> = ({
    instruction,
    placeholder,
    fieldName,
    error,
    options,
    register,
    Icon,
    defaultValue = 'default',
}) => {
    return (
        <div className="form-control inline-block w-full lg:w-auto">
            <div className="input-group">
                <span className="bg-base-200">
                    <Icon className="w-5 h-5" />
                </span>
                <select
                    className="select select-bordered w-full shrink"
                    {...register(fieldName, { required: { value: true, message: instruction } })}
                    defaultValue={defaultValue}
                >
                    <option disabled value="default">
                        {placeholder}
                    </option>
                    {options.length &&
                        options.map(({ key, value }) => (
                            <option value={value} key={`type-${key}`}>
                                {key}
                            </option>
                        ))}
                </select>
            </div>
            {error && (
                <label className="label">
                    <span className="label-text-alt">{error}</span>
                </label>
            )}
        </div>
    );
};

export default SelectField;
