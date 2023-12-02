import { FC } from 'react';
import { BsArrowDownUp, BsFilter } from 'react-icons/bs';

const Filters: FC = ({}) => {
    return (
        <div className="flex flex-row justify-end w-full space-x-2">
            <button className="btn btn-ghost">
                <BsArrowDownUp className="text-xl" />
                Sort
            </button>
            <button className="btn btn-ghost">
                <BsFilter className="text-xl" />
                Filter
            </button>
        </div>
    );
};

export default Filters;
