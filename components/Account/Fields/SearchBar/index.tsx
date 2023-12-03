import React from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { debounce } from 'lodash';

interface SearchBarProps {
    onSearch(term: string): void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const debouncedSetCurrentTerm = debounce(async (value: string) => {
        onSearch(value);
    }, 300);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSetCurrentTerm(e.target.value);
    };

    return (
        <div className="form-control inline-block grow">
            <label className="input-group input-group-md join">
                <span className="bg-base-200 join-item flex flex-row items-center p-2 px-4">
                    <BiSearchAlt className="text-2xl" />
                </span>
                <input
                    type="text"
                    placeholder="Search for a product..."
                    className="input input-md input-bordered grow join-item"
                    onChange={handleOnChange}
                />
            </label>
        </div>
    );
};

export default SearchBar;
