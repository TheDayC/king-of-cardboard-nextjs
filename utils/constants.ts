import { BiFootball, BiBall, BiBasketball } from 'react-icons/bi';
import { SiWwe } from 'react-icons/si';
import { MdOutlineCatchingPokemon } from 'react-icons/md';
import { GiLightSabers } from 'react-icons/gi';

import { Interest, StockStatus } from '../enums/products';
import { GiRaceCar } from 'react-icons/gi';

export const INTERESTS = [
    {
        value: Interest.Basketball,
        label: 'Basketball',
        href: '/shop/basketball',
        icon: BiBasketball,
        css: '',
        description: 'Officially licensed NBA sports cards, sealed product and packs.',
        color: '#c2410c',
    },
    {
        value: Interest.Football,
        label: 'Football',
        href: '/shop/football',
        icon: BiBall,
        css: '',
        description: 'Officially licensed NFL sports cards, sealed product and packs.',
        color: '#78350f',
    },
    {
        value: Interest.Soccer,
        label: 'Soccer',
        href: '/shop/soccer',
        icon: BiFootball,
        css: '',
        description: 'Officially licensed Premier League, UEFA and FIFA sports cards, sealed product and packs.',
        color: '#292524',
    },
    /* {  value: Interest.UFC, filterIcon: <SiUfc className={filterIconClassName} />, label: 'UFC' }, */
    {
        value: Interest.TCG,
        label: 'TCG',
        href: '/shop/TCG',
        icon: MdOutlineCatchingPokemon,
        css: '',
        description: 'Officially licensed Pokemon, Yugioh, Magic and other trading card products.',
        color: '#dc2626',
    },
    {
        value: Interest.Wrestling,
        label: 'Wrestling',
        href: '/shop/wrestling',
        icon: SiWwe,
        css: '',
        description: 'Officially licensed WWE and AEW sports cards, sealed product and packs.',
        color: '#991b1b',
    },
    /* { value: Interest.Baseball, icon: <BiBaseball className={filterIconClassName} />, label: 'Baseball' }, */
    {
        value: Interest.F1,
        label: 'Formula 1',
        href: '/shop/formula1',
        icon: GiRaceCar,
        css: 'origin-center rotate-180',
        description: 'Officially licensed F1 trading cards, sealed product and packs.',
        color: '#065f46',
    },
    {
        value: Interest.Other,
        label: 'Other',
        href: '/shop/other',
        icon: GiLightSabers,
        css: 'origin-center rotate-180',
        description:
            'Other stock such as baseball, UFC, Star Wars and Marvel amongst other officially licensed brands.',
        color: '#0ea5e9',
    },
];

export const DEFAULT_STOCK_STATUSES: StockStatus[] = [StockStatus.InStock, StockStatus.Import, StockStatus.PreOrder];
