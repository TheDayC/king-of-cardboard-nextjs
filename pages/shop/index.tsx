import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useDispatch } from 'react-redux';
import { Document } from '@contentful/rich-text-types';

import PageWrapper from '../../components/PageWrapper';
import Filters from '../../components/Shop/Filters';
import Grid from '../../components/Shop/Grid';
import { removeAllCategories, removeAllProductTypes } from '../../store/slices/filters';
import { setAccessToken, setExpires } from '../../store/slices/global';
import { CreateToken } from '../../types/commerce';
import { createToken } from '../../utils/auth';
import { pageBySlug } from '../../utils/pages';
import Content from '../../components/Content';

export const getServerSideProps: GetServerSideProps = async () => {
    const accessToken = await createToken();
    const content = await pageBySlug('shop', '');

    return {
        props: {
            errorCode: !accessToken ? 500 : null,
            accessToken,
            content,
        },
    };
};

interface ShopProps {
    accessToken: CreateToken;
    content: Document[] | null;
}

export const ShopPage: React.FC<ShopProps> = ({ accessToken, content }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(removeAllProductTypes());
        dispatch(removeAllCategories());
    }, [dispatch]);

    useEffect(() => {
        dispatch(setAccessToken(accessToken.token));
        dispatch(setExpires(accessToken.expires));
    }, [dispatch, accessToken]);

    return (
        <PageWrapper
            title="Shop - King of Cardboard"
            description="A broad selection of sports cards sealed, single and pack products."
        >
            <div className="flex flex-col w-full relative">
                {content && <Content content={content} />}
                <div className="flex flex-col w-full relative md:flex-row">
                    <Filters />
                    <Grid />
                </div>
            </div>
        </PageWrapper>
    );
};

export default ShopPage;
