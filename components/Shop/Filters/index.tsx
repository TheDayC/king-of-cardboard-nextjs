import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { upperFirst, upperCase } from 'lodash';

import selector from './selector';
import { combinedFilters, FilterTypes, ProductType } from '../../../enums/shop';
import { addCategory, addProductType, removeCategory, removeProductType } from '../../../store/slices/filters';
import Filter from './Filter';
import Loading from '../../Loading';

interface FiltersProps {
    category: string | null;
}

export const Filters: React.FC<FiltersProps> = ({ category }) => {
    const { categories, productTypes, filters, hasProductTypes, hasCategories } = useSelector(selector);
    const dispatch = useDispatch();

    const handleFilterOnChange = (filter: combinedFilters, filterType: FilterTypes, addFilter: boolean) => {
        if (addFilter) {
            switch (filterType) {
                case FilterTypes.Category:
                    dispatch(addCategory(filter));
                    break;
                case FilterTypes.ProductType:
                    dispatch(addProductType(filter));
                    break;
            }
        } else {
            switch (filterType) {
                case FilterTypes.Category:
                    dispatch(removeCategory(filter));
                    break;
                case FilterTypes.ProductType:
                    dispatch(removeProductType(filter));
                    break;
            }
        }
    };

    return (
        <div className="flex md:flex-col md:mr-4 relative">
            {hasProductTypes && (
                <div className="card bordered mb-4 rounded-md">
                    <div className="card-body p-4">
                        <h3 className="card-title">Product Types</h3>
                        {productTypes.map((type) => (
                            <Filter
                                value={type}
                                type={FilterTypes.ProductType}
                                label={`${type === ProductType.TCG ? upperCase(type) : upperFirst(type)}`}
                                checked={filters.productTypes.includes(type)}
                                changeFilterState={handleFilterOnChange}
                                key={`Filter-${type}`}
                            />
                        ))}
                    </div>
                </div>
            )}
            {hasCategories && (
                <div className="card bordered mb-4 rounded-md">
                    <div className="card-body p-4">
                        <h3 className="card-title">Categories</h3>
                        {categories.map((cat) => (
                            <Filter
                                value={cat}
                                type={FilterTypes.Category}
                                label={`${upperFirst(cat)}`}
                                checked={filters.categories.includes(cat)}
                                changeFilterState={handleFilterOnChange}
                                key={`Filter-${cat}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Filters;
