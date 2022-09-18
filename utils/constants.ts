import { BiFootball, BiBall, BiBasketball } from 'react-icons/bi';
import { SiUfc, SiWwe } from 'react-icons/si';
import { MdOutlineCatchingPokemon } from 'react-icons/md';

export const shopSubMenu = [
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
        href: '/shop/wwe',
        icon: SiWwe,
        label: 'WWE',
        css: '',
    },
    {
        href: '/shop/pokemon',
        icon: MdOutlineCatchingPokemon,
        label: 'Pokemon',
        css: 'origin-center rotate-180',
    },
];
