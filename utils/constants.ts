import { BiFootball, BiBall, BiBasketball, BiBaseball } from 'react-icons/bi';
import { SiUfc, SiWwe } from 'react-icons/si';
import { MdOutlineCatchingPokemon } from 'react-icons/md';

import { StockStatus } from '../enums/products';
import { GiRaceCar } from 'react-icons/gi';

export const shopSubMenu = [
    {
        href: '/shop/baseball',
        icon: BiBaseball,
        label: 'Baseball',
        css: '',
    },
    {
        href: '/shop/basketball',
        icon: BiBasketball,
        label: 'Basketball',
        css: '',
    },
    {
        href: '/shop/football',
        icon: BiBall,
        label: 'Football',
        css: '',
    },
    {
        href: '/shop/soccer',
        icon: BiFootball,
        label: 'Soccer',
        css: '',
    },
    {
        href: '/shop/ufc',
        icon: SiUfc,
        label: 'UFC',
        css: '',
    },
    {
        href: '/shop/wrestling',
        icon: SiWwe,
        label: 'wrestling',
        css: '',
    },
    {
        href: '/shop/pokemon',
        icon: MdOutlineCatchingPokemon,
        label: 'Pokemon',
        css: 'origin-center rotate-180',
    },
    {
        href: '/shop/formula1',
        icon: GiRaceCar,
        label: 'Formula 1',
        css: '',
    },
];

export const DEFAULT_STOCK_STATUSES: StockStatus[] = [StockStatus.InStock, StockStatus.Import, StockStatus.PreOrder];
