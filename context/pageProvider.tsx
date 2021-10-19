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
    const dispatch = useDispatch();

    const fetchPageData = useCallback(async () => {
        const pageData = await fetchPageCollection(PAGES_QUERY);

        if (pageData) {
            dispatch(setPages(pageData));
            dispatch(setLoadingPages(false));
        }
    }, []);

    // Fetch page data on load and add to state.
    useIsomorphicLayoutEffect(() => {
        fetchPageData();
    }, []);

    return <React.Fragment>{children}</React.Fragment>;
};

export default PageProvider;
