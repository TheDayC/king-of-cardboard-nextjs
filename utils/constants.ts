import { BiFootball, BiBall, BiBasketball } from 'react-icons/bi';
import { SiUfc, SiWwe } from 'react-icons/si';
import { MdOutlineCatchingPokemon } from 'react-icons/md';
import { upperCase, upperFirst } from 'lodash';

import { ProductType } from '../enums/shop';

export const shopSubMenu = [
    {
        href: '/shop/basketball',
        icon: BiBasketball,
        label: upperFirst(ProductType.Basketball),
        css: '',
    },
    {
        href: '/shop/football',
        icon: BiBall,
        label: upperFirst(ProductType.Football),
        css: '',
    },
    {
        href: '/shop/soccer',
        icon: BiFootball,
        label: upperFirst(ProductType.Soccer),
        css: '',
    },
    {
        href: '/shop/ufc',
        icon: SiUfc,
        label: upperCase(ProductType.UFC),
        css: '',
    },
    {
        href: '/shop/wwe',
        icon: SiWwe,
        label: upperFirst(ProductType.Wrestling),
        css: '',
    },
    {
        href: '/shop/pokemon',
        icon: MdOutlineCatchingPokemon,
        label: upperFirst(ProductType.Pokemon),
        css: 'origin-center rotate-180',
    },
];
