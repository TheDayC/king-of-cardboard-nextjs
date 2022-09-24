import { BiFootball, BiBall, BiBasketball, BiBaseball } from 'react-icons/bi';
import { SiUfc, SiWwe } from 'react-icons/si';
import { MdOutlineCatchingPokemon } from 'react-icons/md';
import { upperCase, upperFirst } from 'lodash';

import { ProductType } from '../enums/shop';

export const shopSubMenu = [
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

export const importsSubMenu = [
    {
        href: `/imports/${ProductType.Baseball}`,
        icon: BiBaseball,
        label: upperFirst(ProductType.Baseball),
        css: '',
    },
    {
        href: `/imports/${ProductType.Basketball}`,
        icon: BiBasketball,
        label: upperFirst(ProductType.Basketball),
        css: '',
    },
    {
        href: `/imports/${ProductType.Football}`,
        icon: BiBall,
        label: upperFirst(ProductType.Football),
        css: '',
    },
    {
        href: `/imports/${ProductType.Soccer}`,
        icon: BiFootball,
        label: upperFirst(ProductType.Soccer),
        css: '',
    },
    {
        href: `/imports/${ProductType.UFC}`,
        icon: SiUfc,
        label: upperCase(ProductType.UFC),
        css: '',
    },
    {
        href: `/imports/${ProductType.Wrestling}`,
        icon: SiWwe,
        label: upperFirst(ProductType.Wrestling),
        css: '',
    },
    {
        href: `/imports/${ProductType.Pokemon}`,
        icon: MdOutlineCatchingPokemon,
        label: upperFirst(ProductType.Pokemon),
        css: 'origin-center rotate-180',
    },
];
