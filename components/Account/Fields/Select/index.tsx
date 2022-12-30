import React from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { IconType } from 'react-icons/lib';

interface Options {
    key: string;
    value: string | number;
}

interface SelectFieldProps {
    instruction: string;
    placeholder: string;
    fieldName: string;
    error: string | null;
    options: Options[];
    register: UseFormRegister<FieldValues>;
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
        <div className="form-control inline-block">
            <div className="input-group">
                <span className="bg-base-200">
                    <Icon className="w-5 h-5" />
                </span>
                <select
                    className="select select-bordered"
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
