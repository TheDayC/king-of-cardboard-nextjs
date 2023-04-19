import React from 'react';
import { IconType } from 'react-icons/lib';
import { useDispatch } from 'react-redux';

import { FilterValue, FilterType } from '../../../../enums/products';
import { setIsLoadingProducts } from '../../../../store/slices/products';

const iconClassName = 'w-6 h-6 inline-block mr-2';

interface FilterProps {
    value: FilterValue;
    type: FilterType;
    label: string;
    checked: boolean;
    Icon: IconType;
    css: string;
    changeFilterState(filter: FilterValue, filterType: FilterType, addFilter: boolean): void;
}

export const Filter: React.FC<FilterProps> = ({ value, type, label, checked, Icon, css, changeFilterState }) => {
    const dispatch = useDispatch();
    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setIsLoadingProducts(true));
        changeFilterState(value, type, e.target.checked);
    };

    return (
        <div className="form-control">
            <label className="cursor-pointer label p-0 mb-4">
                <span className="label-text">
                    <Icon className={`${iconClassName} ${css}`} />
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
