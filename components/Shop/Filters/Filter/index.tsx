import React from 'react';
import { IconType } from 'react-icons';
import { useDispatch } from 'react-redux';

import { combinedFilters, FilterTypes } from '../../../../enums/shop';
import { setIsLoadingProducts } from '../../../../store/slices/products';

interface FilterProps {
    value: combinedFilters;
    type: FilterTypes;
    label: string;
    checked: boolean;
    icon: JSX.Element;
    changeFilterState(filter: combinedFilters, filterType: FilterTypes, addFilter: boolean): void;
}

export const Filter: React.FC<FilterProps> = ({ value, type, label, checked, icon, changeFilterState }) => {
    const dispatch = useDispatch();
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setIsLoadingProducts(true));
        changeFilterState(value, type, e.target.checked);
    };

    return (
        <div className="form-control">
            <label className="cursor-pointer label p-0 mb-4">
                <span className="label-text">
                    {icon}
                    {label}
                </span>
                <input
                    type="checkbox"
                    checked={checked}
                    className="checkbox border-neutral"
                    value={type}
                    onChange={handleOnChange}
                />
            </label>
        </div>
    );
};

export default Filter;
