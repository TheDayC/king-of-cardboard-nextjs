import { FC } from 'react';
import { BiSearchAlt } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';

import selector from './selector';
import { setIsSearchOpen } from '../../../store/slices/global';

export const SearchIcon: FC = () => {
    const { isSearchOpen } = useSelector(selector);
    const dispatch = useDispatch();

    const handleSearchDrawer = () => {
        dispatch(setIsSearchOpen(!isSearchOpen));
    };

    return (
        <div
            className="flex justify-start items-center indicator cursor-pointer rounded-md hover:bg-neutral-focus relative mr-4 lg:mr-2"
            onClick={handleSearchDrawer}
        >
            <div className="p-2 text-2xl">
                <BiSearchAlt className="w-5 h-5" />
            </div>
        </div>
    );
};

export default SearchIcon;
