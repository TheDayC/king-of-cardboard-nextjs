import React from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';

interface SelectionWrapperProps {
    id: string;
    title: string;
    name: string;
    isChecked: boolean;
    defaultChecked: boolean;
    titleLogo?: React.ReactNode;
    register?: UseFormRegister<FieldValues>;
    onSelect(id: string): void;
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
    const shouldShowChildren = isChecked && Boolean(children);
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
        className: 'radio radio-md',
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
            {shouldShowChildren && <div className="mt-4">{children}</div>}
        </div>
    );
};

export default SelectionWrapper;
