import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import selector from './pageSelector';
import { rehydration } from '../store';
import { setLoadingPages, setPages } from '../store/slices/pages';
import { fetchPageCollection } from '../utils/pages';
import { PAGES_QUERY } from '../utils/content';

const PageProvider: React.FC = ({ children }) => {
    const waitForHydro = async () => {
        await rehydration();
    };

    useIsomorphicLayoutEffect(() => {
        waitForHydro();
    }, []);
    const { pages } = useSelector(selector);
    const dispatch = useDispatch();

    const fetchPageData = useCallback(async () => {
        const pageData = await fetchPageCollection(PAGES_QUERY);
        console.log('🚀 ~ file: pageProvider.tsx ~ line 25 ~ fetchPageData ~ pageData', pageData);

        if (pageData) {
            dispatch(setPages(pageData));
            dispatch(setLoadingPages(false));
        }
    }, []);

    // Fetch page data on load and add to state.
    useIsomorphicLayoutEffect(() => {
        if (pages.length <= 0) {
            fetchPageData();
        }
    }, [pages]);

    return <React.Fragment>{children}</React.Fragment>;
};

export default PageProvider;
