import React from 'react';

interface SelectionWrapperProps {
    id: string;
    title: string;
    name: string;
    isChecked: boolean;
    defaultChecked: boolean;
    titleLogo?: React.ReactNode;
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
    onSelect,
}) => {
    const shouldShowChildren = isChecked && Boolean(children);
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
        <div className="flex flex-col mb-4">
            <label className="label cursor-pointer p-0" onClick={handleSelect}>
                <span className="label-text text-lg">
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
