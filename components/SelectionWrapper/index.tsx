import React from 'react';

interface SelectionWrapperProps {
    id: string;
    title: string;
    name: string;
    isChecked: boolean;
    onSelect(id: string): void;
}

export const SelectionWrapper: React.FC<SelectionWrapperProps> = ({
    children,
    id,
    title,
    name,
    isChecked,
    onSelect,
}) => {
    const wrapperClass = isChecked ? 'block' : 'hidden';

    const handleSelect = () => {
        onSelect(id);
    };

    return (
        <div className="flex flex-col p-4">
            <label className="label cursor-pointer mb-2">
                <span className="label-text text-lg">{title}</span>
                <input
                    type="radio"
                    className="radio"
                    value={id}
                    checked={isChecked}
                    onChange={handleSelect}
                    name={name}
                />
            </label>
            <div className={`${wrapperClass}`}>{children}</div>
        </div>
    );
};

export default SelectionWrapper;
