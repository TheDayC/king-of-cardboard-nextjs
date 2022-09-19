import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import PageWrapper from '../../components/PageWrapper';
import Filters from '../../components/Shop/Filters';
import Grid from '../../components/Shop/Grid';
import { removeAllCategories, removeAllProductTypes } from '../../store/slices/filters';

export const ShopPage: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(removeAllProductTypes());
        dispatch(removeAllCategories());
    }, []);

    return (
        <PageWrapper
            title="Shop - King of Cardboard"
            description="A broad selection of sports and trading card singles and sealed products."
        >
            <div className="flex flex-col w-full relative md:flex-row">
                <Filters />
                <Grid />
            </div>
        </PageWrapper>
    );
};

export default ShopPage;
