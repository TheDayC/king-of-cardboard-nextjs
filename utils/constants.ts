import { BiFootball, BiBall, BiBasketball, BiBaseball } from 'react-icons/bi';
import { SiUfc, SiWwe } from 'react-icons/si';
import { MdOutlineCatchingPokemon } from 'react-icons/md';
import { upperCase, upperFirst } from 'lodash';

import { ProductType } from '../enums/shop';
import { Interest, StockStatus } from '../enums/products';

export const shopSubMenu = [
    {
        href: `/shop/${ProductType.Baseball}`,
        icon: BiBaseball,
        label: upperFirst(ProductType.Baseball),
        css: '',
    },
    {
        href: `/shop/${ProductType.Basketball}`,
        icon: BiBasketball,
        label: upperFirst(ProductType.Basketball),
        css: '',
    },
    {
        href: `/shop/${ProductType.Football}`,
        icon: BiBall,
        label: upperFirst(ProductType.Football),
        css: '',
    },
    {
        href: `/shop/${ProductType.Soccer}`,
        icon: BiFootball,
        label: upperFirst(ProductType.Soccer),
        css: '',
    },
    {
        href: `/shop/${ProductType.UFC}`,
        icon: SiUfc,
        label: upperCase(ProductType.UFC),
        css: '',
    },
    {
        href: `/shop/${ProductType.Wrestling}`,
        icon: SiWwe,
        label: upperFirst(ProductType.Wrestling),
        css: '',
    },
    {
        href: `/shop/${ProductType.Pokemon}`,
        icon: MdOutlineCatchingPokemon,
        label: upperFirst(ProductType.Pokemon),
        css: 'origin-center rotate-180',
    },
];

export const PRODUCT_INTERESTS = [
    Interest.Baseball,
    Interest.Basketball,
    Interest.Football,
    Interest.Soccer,
    Interest.UFC,
    Interest.Wrestling,
    Interest.Pokemon,
    Interest.Other,
];

export const DEFAULT_STOCK_STATUSES: StockStatus[] = [StockStatus.InStock, StockStatus.Import, StockStatus.PreOrder];
