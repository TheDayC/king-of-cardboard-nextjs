import { toNumber } from 'lodash';
import React from 'react';
import { BsSortDown } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';

import { SortOption } from '../../../../enums/products';
import { setSortOption } from '../../../../store/slices/filters';
import { SelectOptions } from '../../../../types/products';
import selector from './selector';

interface SortProps {
    options: SelectOptions[];
}

export const Sort: React.FC<SortProps> = ({ options }) => {
    const dispatch = useDispatch();
    const { sortOption } = useSelector(selector);

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
                <select className="select select-bordered grow" defaultValue={sortOption} onChange={handleOnChange}>
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
