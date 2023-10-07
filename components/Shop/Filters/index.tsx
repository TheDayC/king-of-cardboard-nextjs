import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiFootball, BiRefresh } from 'react-icons/bi';
import { SiDcentertainment } from 'react-icons/si';
import { MdOutlineCatchingPokemon } from 'react-icons/md';
import { BsBoxSeam, BsCalendarEvent, BsEye, BsEyeSlash, BsFilter } from 'react-icons/bs';
import { IoIdCardOutline } from 'react-icons/io5';
import { RiRedPacketLine } from 'react-icons/ri';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { FaPlaneArrival } from 'react-icons/fa';
import { useRouter } from 'next/router';

import selector from './selector';
import {
    addCategory,
    addConfiguration,
    addInterest,
    addStockStatus,
    removeCategory,
    removeConfiguration,
    removeInterest,
    removeStockStatus,
    resetFilters,
} from '../../../store/slices/filters';
import Filter from './Filter';
import { Category, Configuration, FilterType, FilterValue, StockStatus, SortOption } from '../../../enums/products';
import { fetchProductRows, fetchProducts, setIsLoadingProducts } from '../../../store/slices/products';
import Sort from './Sort';
import SearchBar from '../SearchBar';
import { INTERESTS } from '../../../utils/constants';

const css = 'w-6 h-6 inline-block mr-2';

export const CATEGORY_FILTERS = [
    { value: Category.Sports, icon: BiFootball, label: 'Sports', css },
    { value: Category.TCG, icon: MdOutlineCatchingPokemon, label: 'TCG', css },
    { value: Category.Other, icon: SiDcentertainment, label: 'Other', css },
];

const CONFIGURATION_FILTERS = [
    { value: Configuration.Sealed, icon: BsBoxSeam, label: 'Sealed', css },
    { value: Configuration.Packs, icon: RiRedPacketLine, label: 'Packs', css },
    { value: Configuration.Singles, icon: IoIdCardOutline, label: 'Singles', css },
    { value: Configuration.Other, icon: GiPerspectiveDiceSixFacesRandom, label: 'Other', css },
];

export const STATUS_FILTERS = [
    { value: StockStatus.InStock, icon: BsEye, label: 'In Stock', css },
    { value: StockStatus.OutOfStock, icon: BsEyeSlash, label: 'Out of Stock', css },
    { value: StockStatus.PreOrder, icon: BsCalendarEvent, label: 'Pre-Order', css },
    { value: StockStatus.Import, icon: FaPlaneArrival, label: 'Import', css },
];

export const SORT_OPTIONS = [
    { key: 'Date Added (Asc)', value: SortOption.DateAddedAsc },
    { key: 'Date Added (Desc)', value: SortOption.DateAddedDesc },
    { key: 'Price (Low to High)', value: SortOption.PriceAsc },
    { key: 'Price (High to Low)', value: SortOption.PriceDesc },
    { key: 'Title (Asc)', value: SortOption.TitleAsc },
    { key: 'Title (Desc)', value: SortOption.TitleDesc },
];

export const Filters: React.FC = () => {
    const { filters } = useSelector(selector);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleFilterOnChange = (value: FilterValue, filterType: FilterType, addFilter: boolean) => {
        if (addFilter) {
            switch (filterType) {
                case FilterType.Category:
                    dispatch(addCategory(value));
                    break;
                case FilterType.Configuration:
                    dispatch(addConfiguration(value));
                    break;
                case FilterType.Interest:
                    dispatch(addInterest(value));
                    break;
                case FilterType.StockStatus:
                    dispatch(addStockStatus(value));
                    break;
                default:
                    break;
            }
        } else {
            switch (filterType) {
                case FilterType.Category:
                    dispatch(removeCategory(value));
                    break;
                case FilterType.Configuration:
                    dispatch(removeConfiguration(value));
                    break;
                case FilterType.Interest:
                    dispatch(removeInterest(value));
                    break;
                case FilterType.StockStatus:
                    dispatch(removeStockStatus(value));
                    break;
                default:
                    break;
            }
        }

        dispatch(fetchProducts({ limit: 8, skip: 0 }));
    };

    const handleFilters = () => {
        router.push({
            pathname: '/shop',
            query: {
                s: filters.searchTerm,
                sort: filters.sortOption,
                cat: filters.categories,
                interest: filters.interests,
                config: filters.configurations,
                status: filters.stockStatus,
            },
        });
    };

    const handleClearFilters = () => {
        dispatch(setIsLoadingProducts(true));

        // Reset the shop.
        dispatch(resetFilters());

        // Update the shop products.
        dispatch(fetchProductRows({ limit: 4, skip: 0 }));
    };

    return (
        <div className="flex flex-col w-full relative space-y-4 md:w-2/6 xl:w-72">
            <div className="flex flex-col w-full">
                <SearchBar />
            </div>
            <div className="flex flex-col w-full">
                <Sort options={SORT_OPTIONS} />
            </div>
            <div className="card bordered rounded-md">
                <div className="card-body p-4">
                    <h3 className="card-title text-sm lg:text-lg mb-4">Category</h3>
                    {CATEGORY_FILTERS.map(({ value, icon, label, css }) => (
                        <Filter
                            value={value}
                            type={FilterType.Category}
                            label={label}
                            checked={filters.categories.includes(value)}
                            changeFilterState={handleFilterOnChange}
                            Icon={icon}
                            css={css}
                            key={`category-filter-${label}`}
                        />
                    ))}
                </div>
            </div>
            <div className="card bordered rounded-md">
                <div className="card-body p-4">
                    <h3 className="card-title text-sm lg:text-lg mb-4">Status</h3>
                    {STATUS_FILTERS.map(({ value, icon, label, css }) => (
                        <Filter
                            value={value}
                            type={FilterType.StockStatus}
                            label={label}
                            checked={filters.stockStatus.includes(value)}
                            changeFilterState={handleFilterOnChange}
                            Icon={icon}
                            css={css}
                            key={`status-filter-${label}`}
                        />
                    ))}
                </div>
            </div>
            <div className="card bordered rounded-md">
                <div className="card-body p-4">
                    <h3 className="card-title text-sm lg:text-lg mb-4">Configuration</h3>
                    {CONFIGURATION_FILTERS.map(({ value, icon, label, css }) => (
                        <Filter
                            value={value}
                            type={FilterType.Configuration}
                            label={label}
                            checked={filters.configurations.includes(value)}
                            changeFilterState={handleFilterOnChange}
                            Icon={icon}
                            css={css}
                            key={`configuration-filter-${label}`}
                        />
                    ))}
                </div>
            </div>
            <div className="card bordered rounded-md">
                <div className="card-body p-4">
                    <h3 className="card-title text-sm lg:text-lg mb-4">Interest</h3>
                    {INTERESTS.map(({ value, icon, label, css }) => (
                        <Filter
                            value={value}
                            type={FilterType.Interest}
                            label={label}
                            checked={filters.interests.includes(value)}
                            changeFilterState={handleFilterOnChange}
                            Icon={icon}
                            css={css}
                            key={`configuration-filter-${label}`}
                        />
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-y-2 lg:flex-row lg:gap-x-2">
                <button className="btn btn-md btn-primary grow" onClick={handleFilters}>
                    Filter
                    <BsFilter className="inline-block w-6 h-6 ml-2" />
                </button>
                <button className="btn btn-md btn-secondary grow" onClick={handleClearFilters}>
                    Reset
                    <BiRefresh className="inline-block w-6 h-6 ml-2" />
                </button>
            </div>
        </div>
    );
};

export default Filters;
