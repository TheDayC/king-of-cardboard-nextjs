import React from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { setSearchTerm } from '../../../store/slices/filters';
import selector from './selector';

export const SearchBar: React.FC = () => {
    const dispatch = useDispatch();
    const { searchTerm } = useSelector(selector);

    const debouncedSearch = debounce(async (value: string) => {
        dispatch(setSearchTerm(value));
    }, 300);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value);
    };

    return (
        <div className="form-control inline-block">
            <label className="input-group input-group-md">
                <span className="bg-base-200">
                    <BiSearchAlt className="w-5 h-5" />
                </span>
                <input
                    type="text"
                    placeholder="Search for a product..."
                    className="input input-md input-bordered grow"
                    onChange={handleOnChange}
                    defaultValue={searchTerm}
                />
            </label>
        </div>
    );
};

export default SearchBar;
