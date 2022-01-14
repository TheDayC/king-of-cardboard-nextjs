import { random } from 'lodash';

import { Cards } from '../../types';

export const basketballCards: Cards = {
    'ja-morant-playoff-ticket-rc-auto': {
        code: 'CON',
        sku: '',
        name: 'ja-morant-playoff-ticket-rc-auto',
        title: 'Ja Morant RC (Playoff Ticket Auto)',
        amount: `${random(1000, 4000)}`,
        quantity: random(10, 25),
        image_url: '',
        image_id: '',
        set: '19/20 Contenders Basketball',
        types: ['sports'],
        categories: ['singles'],
        tags: ['Single'],
    },
    'lamelo-ball-rated-rookie': {
        code: 'DON',
        sku: '',
        name: 'lamelo-ball-rated-rookie',
        title: 'Lamelo Ball (Rated Rookie)',
        amount: `${random(1000, 4000)}`,
        quantity: random(10, 25),
        image_url: '',
        image_id: '',
        set: '20/21 Donruss Basketball',
        types: ['sports'],
        categories: ['singles'],
        tags: ['Single'],
    },
};
