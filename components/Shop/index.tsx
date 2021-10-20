import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { removeAllCategories, removeAllProductTypes, setUrlProductType } from '../../store/slices/filters';
import ProductGrid from '../../components/ProductGrid';
import Filters from './Filters';
import Loading from '../Loading';
import selector from './selector';

interface ShopBodyProps {
    category: string | null;
}

export const Shop: React.FC<ShopBodyProps> = ({ category }) => {
    const dispatch = useDispatch();
    const { isLoadingProducts } = useSelector(selector);

    useEffect(() => {
        if (category) {
            dispatch(setUrlProductType(category));
        } else {
            dispatch(removeAllProductTypes());
        }

        dispatch(removeAllCategories());
    }, [dispatch, category]);

    return (
        <div className="flex p-4 flex-col md:flex-row relative">
            <Loading show={isLoadingProducts} />
            <Filters category={category} />
            <ProductGrid useFilters />
        </div>
    );
};

export default Shop;
