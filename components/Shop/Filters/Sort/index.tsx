import { toNumber } from 'lodash';
import React from 'react';
import { BsSortDown } from 'react-icons/bs';
import { useDispatch } from 'react-redux';

import { SortOption } from '../../../../enums/products';
import { setSortOption } from '../../../../store/slices/filters';
import { SelectOptions } from '../../../../types/products';

interface SortProps {
    value: string;
    options: SelectOptions[];
}

export const Sort: React.FC<SortProps> = ({ value, options }) => {
    const dispatch = useDispatch();

    const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = toNumber(e.target.value) as SortOption;

        dispatch(setSortOption(value));
    };

    return (
        <div className="form-control inline-block">
            <label className="input-group">
                <span className="bg-base-200">
                    <BsSortDown className="w-5 h-5" />
                </span>
                <select className="select select-bordered grow" defaultValue={value} onChange={handleOnChange}>
                    <option disabled value="default">
                        Sort by...
                    </option>
                    {options.length &&
                        options.map(({ key, value }) => (
                            <option value={value} key={`sort-option-${key}`}>
                                {key}
                            </option>
                        ))}
                </select>
            </label>
        </div>
    );
};

export default Sort;
