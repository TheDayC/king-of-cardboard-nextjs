import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { removeAllCategories, removeAllProductTypes, setUrlProductType } from '../../store/slices/filters';
import Grid from './Grid';
import Filters from './Filters';

interface ShopBodyProps {
    category: string | null;
}

export const Shop: React.FC<ShopBodyProps> = ({ category }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (category) {
            dispatch(setUrlProductType(category));
        } else {
            dispatch(removeAllProductTypes());
        }

        dispatch(removeAllCategories());
    }, [dispatch, category]);

    return (
        <div className="flex flex-col w-full relative md:flex-row">
            <Filters />
            <Grid />
        </div>
    );
};

export default Shop;
