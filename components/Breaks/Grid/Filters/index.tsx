import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setOrder } from '../../../../store/slices/breaks';
import selector from './selector';

export const Filters: React.FC = () => {
    const dispatch = useDispatch();
    const { order } = useSelector(selector);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;

        dispatch(setOrder(value));
    };

    return (
        <div className="flex flex-row justify-end w-full mb-4 md:mb-6 lg:mb-8">
            <div className="flex flex-col justify-start items-start w-full md:flex-row md:justify-end md:items-center md:w-1/3">
                <label htmlFor="sort-breaks" className="mr-4 mb-2 md:mb-0">
                    Sort by
                </label>
                <select
                    className="select select-bordered w-full md:w-auto"
                    id="sort-breaks"
                    onChange={handleChange}
                    value={order}
                >
                    <option value="breakDate_ASC">Break Date ASC</option>
                    <option value="breakDate_DESC">Break Date DESC</option>
                    <option value="breakNumber_ASC">Break Number ASC</option>
                    <option value="breakNumber_DESC">Break Number DESC</option>
                    <option value="title_ASC">Title ASC</option>
                    <option value="title_DESC">Title DESC</option>
                </select>
            </div>
        </div>
    );
};

export default Filters;
