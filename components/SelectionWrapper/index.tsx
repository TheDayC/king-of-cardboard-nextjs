import React, { ReactNode } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';

interface SelectionWrapperProps {
    id: number;
    title: string;
    name: string;
    isChecked: boolean;
    defaultChecked: boolean;
    titleLogo?: ReactNode;
    register?: UseFormRegister<FieldValues>;
    children: ReactNode;
    onSelect(id: number): void;
}

export const SelectionWrapper: React.FC<SelectionWrapperProps> = ({
    children,
    id,
    title,
    name,
    isChecked,
    defaultChecked,
    titleLogo,
    register,
    onSelect,
}) => {
    const handleSelect = () => {
        onSelect(id);
    };

    const registerValue = register
        ? register(name, {
              required: false,
          })
        : {
              name,
          };

    const radioPropsBase = {
        ...registerValue,
        className: 'radio radio-md border border-gray-400',
        type: 'radio',
        value: id,
    };

    return (
        <div className="flex flex-col mb-6">
            <label className="label cursor-pointer p-0" onClick={handleSelect}>
                <span className="label-text text-md lg:text-lg">
                    {titleLogo && titleLogo}
                    {title}
                </span>
                {defaultChecked ? (
                    <input {...radioPropsBase} defaultChecked={defaultChecked} />
                ) : (
                    <input {...radioPropsBase} />
                )}
            </label>
            {isChecked && <div className="mt-4">{children}</div>}
        </div>
    );
};

export default SelectionWrapper;
