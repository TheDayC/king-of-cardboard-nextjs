import React from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { IconType } from 'react-icons/lib';

interface InputFieldProps {
    instruction: string;
    placeholder: string;
    fieldName: string;
    error: string | null;
    register: UseFormRegister<FieldValues>;
    Icon: IconType;
}

export const InputField: React.FC<InputFieldProps> = ({
    instruction,
    placeholder,
    fieldName,
    error,
    register,
    Icon,
}) => {
    return (
        <div className="form-control inline-block">
            <label className="input-group input-group-md">
                <span className="bg-base-200">
                    <Icon className="w-5 h-5" />
                </span>
                <input
                    type="text"
                    placeholder={placeholder}
                    {...register(fieldName, {
                        required: { value: true, message: instruction },
                    })}
                    className={`input input-md input-bordered w-full${error ? ' input-error' : ''}`}
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

export default InputField;
