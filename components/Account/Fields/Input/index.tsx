import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { IconType } from 'react-icons/lib';
import DatePicker from 'react-datepicker';

import { parseAsString, safelyParse } from '../../../../utils/parsers';
import { DateTime } from 'luxon';

interface InputFieldProps {
    instruction: string;
    placeholder: string;
    fieldName: string;
    fieldType?: string;
    error: string | null;
    register: UseFormRegister<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    Icon: IconType;
    isRequired: boolean;
    shouldKebab?: boolean;
    shouldUpperCase?: boolean;
    isDate?: boolean;
    startDate?: string | null;
    setStartDate?: (date: Date | null) => void;
    onChange?: (value: string) => void;
}

export const InputField: React.FC<InputFieldProps> = ({
    instruction,
    placeholder,
    fieldName,
    fieldType = 'text',
    error,
    register,
    Icon,
    isRequired,
    isDate = false,
    startDate,
    setStartDate,
    onChange,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(safelyParse(e, 'target.value', parseAsString, ''));
        }
    };

    return (
        <div className="form-control inline-block w-full lg:w-auto">
            <label className="input-group input-group-md">
                <span className="bg-base-200">
                    <Icon className="w-5 h-5" />
                </span>
                {isDate && setStartDate ? (
                    <DatePicker
                        selected={startDate ? DateTime.fromISO(startDate).toJSDate() : null}
                        onChange={(date) => setStartDate(date)}
                        wrapperClassName="inline-block border-2 border-gray-500 w-full shrink lg:w-auto h-full"
                        className="input input-md input-bordered w-full rounded-l-none"
                        isClearable
                        placeholderText={placeholder}
                        clearButtonClassName="btn btn-square rounded-l-none after:bg-transparent after:content-['×'] after:text-xl after:leading-after-content"
                        dateFormat="dd/MM/yyyy"
                        showYearDropdown
                    />
                ) : (
                    <input
                        type={fieldType}
                        placeholder={placeholder}
                        {...register(fieldName, {
                            required: { value: isRequired, message: instruction },
                        })}
                        className={`input input-md input-bordered w-full${error ? ' input-error' : ''}`}
                        onChange={handleChange}
                    />
                )}
            </label>
            {error && (
                <label className="label">
                    <span className={`label-text-alt${error ? ' text-error' : ''}`}>{error}</span>
                </label>
            )}
        </div>
    );
};

export default InputField;
