import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { upperFirst, upperCase } from 'lodash';
import { BiFootball, BiBall, BiBasketball } from 'react-icons/bi';
import { SiUfc, SiWwe } from 'react-icons/si';
import { MdOutlineCatchingPokemon } from 'react-icons/md';
import { BsBoxSeam } from 'react-icons/bs';
import { IoIdCardOutline } from 'react-icons/io5';
import { RiRedPacketLine } from 'react-icons/ri';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';

import selector from './selector';
import { Categories, combinedFilters, FilterTypes, ProductType } from '../../../enums/shop';
import {
    addCategory,
    addProductType,
    removeAllCategories,
    removeAllProductTypes,
    removeCategory,
    removeProductType,
} from '../../../store/slices/filters';
import Filter from './Filter';

const iconClassName = 'w-6 h-6 inline-block mr-2';
const categories = [
    { category: Categories.Sealed, icon: <BsBoxSeam className={iconClassName} /> },
    { category: Categories.Singles, icon: <IoIdCardOutline className={iconClassName} /> },
    { category: Categories.Packs, icon: <RiRedPacketLine className={iconClassName} /> },
    { category: Categories.Other, icon: <GiPerspectiveDiceSixFacesRandom className={iconClassName} /> },
];
const upperCaseTypes = [ProductType.TCG, ProductType.UFC, ProductType.Wrestling];

export const TYPE_FILTERS = [
    { type: ProductType.Basketball, icon: <BiBasketball className={iconClassName} /> },
    { type: ProductType.Football, icon: <BiBall className={iconClassName} /> },
    { type: ProductType.Soccer, icon: <BiFootball className={iconClassName} /> },
    { type: ProductType.UFC, icon: <SiUfc className={iconClassName} /> },
    { type: ProductType.Wrestling, icon: <SiWwe className={iconClassName} /> },
    { type: ProductType.Pokemon, icon: <MdOutlineCatchingPokemon className={iconClassName} /> },
];

export const Filters: React.FC = () => {
    const { filters } = useSelector(selector);
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
                default:
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
                default:
                    break;
            }
        }
    };

    const handleClearFilters = () => {
        dispatch(removeAllProductTypes());
        dispatch(removeAllCategories());
    };

    return (
        <div className="flex flex-col w-full md:w-1/6 md:mr-4 relative">
            <div className="card bordered mb-4 rounded-md">
                <div className="card-body p-4">
                    <h3 className="card-title text-sm lg:text-lg mb-4">Categories</h3>
                    {TYPE_FILTERS.map(({ type, icon }) => (
                        <Filter
                            value={type}
                            type={FilterTypes.ProductType}
                            label={`${upperCaseTypes.includes(type) ? upperCase(type) : upperFirst(type)}`}
                            checked={filters.productTypes.includes(type)}
                            changeFilterState={handleFilterOnChange}
                            icon={icon}
                            key={`Filter-${type}`}
                        />
                    ))}
                </div>
            </div>
            {categories.length > 0 && (
                <div className="card bordered mb-4 rounded-md">
                    <div className="card-body p-4">
                        <h3 className="card-title text-sm lg:text-lg mb-4">Product Types</h3>
                        {categories.map(({ category, icon }) => (
                            <Filter
                                value={category}
                                type={FilterTypes.Category}
                                label={`${upperFirst(category)}`}
                                checked={filters.categories.includes(category)}
                                changeFilterState={handleFilterOnChange}
                                icon={icon}
                                key={`Filter-${category}`}
                            />
                        ))}
                    </div>
                </div>
            )}
            <button className="btn btn-md mb-4 btn-secondary" onClick={handleClearFilters}>
                Clear Filters
            </button>
        </div>
    );
};

export default Filters;
