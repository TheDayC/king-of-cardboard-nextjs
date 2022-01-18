import React from 'react';
import { useDispatch } from 'react-redux';

import { combinedFilters, FilterTypes } from '../../../../enums/shop';
import { setIsLoadingProducts } from '../../../../store/slices/products';

interface FilterProps {
    value: combinedFilters;
    type: FilterTypes;
    label: string;
    checked: boolean;
    changeFilterState(filter: combinedFilters, filterType: FilterTypes, addFilter: boolean): void;
}

export const Filter: React.FC<FilterProps> = ({ value, type, label, checked, changeFilterState }) => {
    const dispatch = useDispatch();
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setIsLoadingProducts(true));
        changeFilterState(value, type, e.target.checked);
    };

    return (
        <div className="form-control">
            <label className="cursor-pointer label p-0 mb-4">
                <span className="label-text">{label}</span>
                <input type="checkbox" checked={checked} className="checkbox" value={type} onChange={handleOnChange} />
            </label>
        </div>
    );
};

export default Filter;
