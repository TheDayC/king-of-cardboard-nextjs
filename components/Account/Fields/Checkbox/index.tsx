import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { IconType } from 'react-icons/lib';

interface CheckboxFieldProps {
    label: string;
    fieldName: string;
    error: string | null;
    register: UseFormRegister<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    Icon: IconType;
    isChecked?: boolean;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
    label,
    fieldName,
    error,
    register,
    Icon,
    isChecked = false,
}) => {
    return (
        <div className="form-control inline-block w-full lg:w-auto">
            <label htmlFor={fieldName} className="flex flex-row gap-x-2">
                <span>{label}</span>
                <input
                    type="checkbox"
                    className="checkbox"
                    {...register(fieldName, { required: false })}
                    defaultChecked={isChecked}
                    id={fieldName}
                />
            </label>
            {error && (
                <label className="label">
                    <span className="label-text-alt">{error}</span>
                </label>
            )}
        </div>
    );
};

export default CheckboxField;
