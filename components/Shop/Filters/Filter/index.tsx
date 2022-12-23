import React from 'react';
import { useDispatch } from 'react-redux';

import { FilterValue, FilterType } from '../../../../enums/products';
import { setIsLoadingProducts } from '../../../../store/slices/products';

interface FilterProps {
    value: FilterValue;
    type: FilterType;
    label: string;
    checked: boolean;
    icon: JSX.Element;
    changeFilterState(filter: FilterValue, filterType: FilterType, addFilter: boolean): void;
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
