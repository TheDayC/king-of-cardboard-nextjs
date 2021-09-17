import React, { useState } from 'react';

import { combinedFilters, FilterTypes } from '../../../../enums/shop';

interface FilterProps {
    value: combinedFilters;
    type: FilterTypes;
    label: string;
    checked: boolean;
    changeFilterState(filter: combinedFilters, filterType: FilterTypes, addFilter: boolean): void;
}

export const Filter: React.FC<FilterProps> = ({ value, type, label, checked, changeFilterState }) => {
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        changeFilterState(value, type, e.target.checked);
    };

    return (
        <div className="form-control">
            <label className="cursor-pointer label">
                <span className="label-text">{label}</span>
                <input type="checkbox" checked={checked} className="checkbox" value={type} onChange={handleOnChange} />
            </label>
        </div>
    );
};

export default Filter;
