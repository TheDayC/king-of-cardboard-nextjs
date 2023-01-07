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
                />
            </label>
        </div>
    );
};

export default SearchBar;
