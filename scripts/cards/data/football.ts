import { random } from 'lodash';

import { Cards } from '../../types';

export const footballCards: Cards = {
    'josh-allen-rc-kaboom': {
        code: 'KBM',
        sku: '',
        name: 'josh-allen-rc-kaboom',
        title: 'Josh Allen RC (Kaboom)',
        amount: `${random(1000, 4000)}`,
        quantity: random(10, 25),
        image_url: '',
        image_id: '',
        set: '18/19 Kaboom',
        types: ['sports'],
        categories: ['singles'],
        tags: ['Single'],
    },
    'mac-jones-downtown': {
        code: 'DON',
        sku: '',
        name: 'mac-jones-downtown',
        title: 'Mac Jones RC (Downtown)',
        amount: `${random(1000, 4000)}`,
        quantity: random(10, 25),
        image_url: '',
        image_id: '',
        set: '20/21 Donruss Football',
        types: ['sports'],
        categories: ['singles'],
        tags: ['Single'],
    },
};
