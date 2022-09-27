import { createSelector } from '@reduxjs/toolkit';

import { selectProductData, selectGlobalData, selectImportsData } from '../../../store/state/selectors';

const selector = createSelector(
    [selectProductData, selectGlobalData, selectImportsData],
    (products, global, importData) => ({
        products: products.products,
        productsTotal: products.productsTotal,
        accessToken: global.accessToken,
        isLoadingProducts: products.isLoadingProducts,
        imports: importData.imports,
        importsTotal: importData.importsTotal,
        isLoadingImports: importData.isLoadingImports,
    })
);

export default selector;
