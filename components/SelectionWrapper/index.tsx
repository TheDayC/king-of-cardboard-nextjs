import React from 'react';

interface SelectionWrapperProps {
    id: string;
    title: string;
    name: string;
    isChecked: boolean;
    defaultChecked: boolean;
    onSelect(id: string): void;
}

export const SelectionWrapper: React.FC<SelectionWrapperProps> = ({
    children,
    id,
    title,
    name,
    isChecked,
    defaultChecked,
    onSelect,
}) => {
    const handleSelect = () => {
        onSelect(id);
    };

    const radioPropsBase = {
        type: 'radio',
        className: 'radio',
        value: id,
        name,
    };

    return (
        <div className="flex flex-col px-4">
            <label className="label cursor-pointer" onClick={handleSelect}>
                <span className="label-text text-lg">{title}</span>
                {defaultChecked ? (
                    <input {...radioPropsBase} defaultChecked={defaultChecked} />
                ) : (
                    <input {...radioPropsBase} />
                )}
            </label>
            {isChecked && <div className="mb-4">{children}</div>}
        </div>
    );
};

export default SelectionWrapper;
