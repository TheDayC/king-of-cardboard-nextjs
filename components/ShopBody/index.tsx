import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { removeAllCategories, removeAllProductTypes, setUrlProductType } from '../../store/slices/filters';
import ProductGrid from '../../components/ProductGrid';
import Filters from './Filters';

interface ShopBodyProps {
    category: string | null;
}

export const ShopBody: React.FC<ShopBodyProps> = ({ category }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (category) {
            dispatch(setUrlProductType(category));
        } else {
            dispatch(removeAllProductTypes());
        }

        dispatch(removeAllCategories());
    }, [category]);

    return (
        <div className="flex p-4 flex-col md:flex-row">
            <Filters category={category} />
            <ProductGrid useFilters />
        </div>
    );
};

export default ShopBody;
