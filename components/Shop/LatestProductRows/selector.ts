import { createSelector } from '@reduxjs/toolkit';

import { Interest } from '../../../enums/products';
import { selectProductData } from '../../../store/state/selectors';

const selector = createSelector([selectProductData], (products) => ({
    baseballProducts: products.products.filter((p) => p.interest === Interest.Baseball),
    basketballProducts: products.products.filter((p) => p.interest === Interest.Basketball),
    footballProducts: products.products.filter((p) => p.interest === Interest.Football),
    otherProducts: products.products.filter((p) => p.interest === Interest.Other),
    pokemonProducts: products.products.filter((p) => p.interest === Interest.Pokemon),
    soccerProducts: products.products.filter((p) => p.interest === Interest.Soccer),
    ufcProducts: products.products.filter((p) => p.interest === Interest.UFC),
    wrestlingProducts: products.products.filter((p) => p.interest === Interest.Wrestling),
    f1Products: products.products.filter((p) => p.interest === Interest.F1),
}));

export default selector;
