import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
import { setLoadingPages, setPages, setShouldLoadPages } from '../store/slices/pages';
import { fetchPageCollection } from '../utils/pages';
import { PAGES_QUERY } from '../utils/content';
import selector from './pageSelector';

const PageProvider: React.FC = ({ children }) => {
    const { shouldLoadPages } = useSelector(selector);
    const dispatch = useDispatch();

    const fetchPageData = useCallback(async () => {
        const pageData = await fetchPageCollection(PAGES_QUERY);

        if (pageData) {
            dispatch(setPages(pageData));
        }
        dispatch(setLoadingPages(false));
    }, [dispatch]);

    // Fetch page data on load and add to state.
    useIsomorphicLayoutEffect(() => {
        if (shouldLoadPages) {
            dispatch(setShouldLoadPages(false));
            fetchPageData();
        }
    }, [shouldLoadPages, fetchPageData]);

    return <React.Fragment>{children}</React.Fragment>;
};

export default PageProvider;
