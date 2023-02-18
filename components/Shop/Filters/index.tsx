import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiFootball, BiBall, BiBasketball, BiBaseball, BiRefresh } from 'react-icons/bi';
import { SiDcentertainment, SiUfc, SiWwe } from 'react-icons/si';
import { MdOutlineCatchingPokemon } from 'react-icons/md';
import { BsBoxSeam, BsCalendarEvent, BsEye, BsEyeSlash } from 'react-icons/bs';
import { IoIdCardOutline } from 'react-icons/io5';
import { RiRedPacketLine } from 'react-icons/ri';
import { GiPerspectiveDiceSixFacesRandom, GiRaceCar } from 'react-icons/gi';
import { FaPlaneArrival } from 'react-icons/fa';

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
import {
    Interest,
    Category,
    Configuration,
    FilterType,
    FilterValue,
    StockStatus,
    SortOption,
} from '../../../enums/products';
import { fetchProductRows, fetchProducts, setIsLoadingProducts } from '../../../store/slices/products';
import Sort from './Sort';
import SearchBar from '../SearchBar';

const iconClassName = 'w-6 h-6 inline-block mr-2';

export const CATEGORY_FILTERS = [
    { value: Category.Sports, icon: <BiFootball className={iconClassName} />, label: 'Sports' },
    { value: Category.TCG, icon: <MdOutlineCatchingPokemon className={iconClassName} />, label: 'TCG' },
    { value: Category.Other, icon: <SiDcentertainment className={iconClassName} />, label: 'Other' },
];

const CONFIGURATION_FILTERS = [
    { value: Configuration.Sealed, icon: <BsBoxSeam className={iconClassName} />, label: 'Sealed' },
    { value: Configuration.Packs, icon: <RiRedPacketLine className={iconClassName} />, label: 'Packs' },
    { value: Configuration.Singles, icon: <IoIdCardOutline className={iconClassName} />, label: 'Singles' },
    { value: Configuration.Other, icon: <GiPerspectiveDiceSixFacesRandom className={iconClassName} />, label: 'Other' },
];

export const INTEREST_FILTERS = [
    { value: Interest.Baseball, icon: <BiBaseball className={iconClassName} />, label: 'Baseball' },
    { value: Interest.Basketball, icon: <BiBasketball className={iconClassName} />, label: 'Basketball' },
    { value: Interest.Football, icon: <BiBall className={iconClassName} />, label: 'Football' },
    { value: Interest.Soccer, icon: <BiFootball className={iconClassName} />, label: 'Soccer' },
    { value: Interest.UFC, icon: <SiUfc className={iconClassName} />, label: 'UFC' },
    { value: Interest.Wrestling, icon: <SiWwe className={iconClassName} />, label: 'Wrestling' },
    { value: Interest.Pokemon, icon: <MdOutlineCatchingPokemon className={iconClassName} />, label: 'Pokemon' },
    { value: Interest.F1, icon: <GiRaceCar className={iconClassName} />, label: 'Formula 1' },
];

export const STATUS_FILTERS = [
    { value: StockStatus.InStock, icon: <BsEye className={iconClassName} />, label: 'In Stock' },
    { value: StockStatus.OutOfStock, icon: <BsEyeSlash className={iconClassName} />, label: 'Out of Stock' },
    { value: StockStatus.PreOrder, icon: <BsCalendarEvent className={iconClassName} />, label: 'Pre-Order' },
    { value: StockStatus.Import, icon: <FaPlaneArrival className={iconClassName} />, label: 'Import' },
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
                    {CATEGORY_FILTERS.map(({ value, icon, label }) => (
                        <Filter
                            value={value}
                            type={FilterType.Category}
                            label={label}
                            checked={filters.categories.includes(value)}
                            changeFilterState={handleFilterOnChange}
                            icon={icon}
                            key={`category-filter-${label}`}
                        />
                    ))}
                </div>
            </div>
            <div className="card bordered rounded-md">
                <div className="card-body p-4">
                    <h3 className="card-title text-sm lg:text-lg mb-4">Status</h3>
                    {STATUS_FILTERS.map(({ value, icon, label }) => (
                        <Filter
                            value={value}
                            type={FilterType.StockStatus}
                            label={label}
                            checked={filters.stockStatus.includes(value)}
                            changeFilterState={handleFilterOnChange}
                            icon={icon}
                            key={`status-filter-${label}`}
                        />
                    ))}
                </div>
            </div>
            <div className="card bordered rounded-md">
                <div className="card-body p-4">
                    <h3 className="card-title text-sm lg:text-lg mb-4">Configuration</h3>
                    {CONFIGURATION_FILTERS.map(({ value, icon, label }) => (
                        <Filter
                            value={value}
                            type={FilterType.Configuration}
                            label={label}
                            checked={filters.configurations.includes(value)}
                            changeFilterState={handleFilterOnChange}
                            icon={icon}
                            key={`configuration-filter-${label}`}
                        />
                    ))}
                </div>
            </div>
            <div className="card bordered rounded-md">
                <div className="card-body p-4">
                    <h3 className="card-title text-sm lg:text-lg mb-4">Interest</h3>
                    {INTEREST_FILTERS.map(({ value, icon, label }) => (
                        <Filter
                            value={value}
                            type={FilterType.Interest}
                            label={label}
                            checked={filters.interests.includes(value)}
                            changeFilterState={handleFilterOnChange}
                            icon={icon}
                            key={`configuration-filter-${label}`}
                        />
                    ))}
                </div>
            </div>
            <button className="btn btn-md btn-secondary" onClick={handleClearFilters}>
                Reset Filters
                <BiRefresh className="inline-block w-6 h-6 ml-2" />
            </button>
        </div>
    );
};

export default Filters;
