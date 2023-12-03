import React, { useState, useEffect } from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { setSearchTerm } from '../../../store/slices/filters';
import selector from './selector';

export const SearchBar: React.FC = () => {
    const dispatch = useDispatch();
    const { searchTerm } = useSelector(selector);
    const [currentTerm, setCurrentTerm] = useState(searchTerm);

    const debouncedSetCurrentTerm = debounce(async (value: string) => {
        setCurrentTerm(value);
    }, 300);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSetCurrentTerm(e.target.value);
    };

    useEffect(() => {
        dispatch(setSearchTerm(currentTerm));
    }, [dispatch, currentTerm]);

    return (
        <div className="form-control inline-block">
            <label className="input-group input-group-md join">
                <span className="bg-base-200 join-item flex flex-row items-center p-2 px-4">
                    <BiSearchAlt className="text-2xl" />
                </span>
                <input
                    type="text"
                    placeholder="Search for a product..."
                    className="input input-md input-bordered grow join-item"
                    onChange={handleOnChange}
                    defaultValue={searchTerm}
                />
            </label>
        </div>
    );
};

export default SearchBar;
