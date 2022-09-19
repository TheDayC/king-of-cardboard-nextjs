import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useDispatch } from 'react-redux';

import PageWrapper from '../../components/PageWrapper';
import Filters from '../../components/Shop/Filters';
import Grid from '../../components/Shop/Grid';
import { removeAllCategories, removeAllProductTypes } from '../../store/slices/filters';
import { setAccessToken, setExpires } from '../../store/slices/global';
import { CreateToken } from '../../types/commerce';
import { createToken } from '../../utils/auth';

export const getServerSideProps: GetServerSideProps = async () => {
    const accessToken = await createToken();

    return {
        props: {
            errorCode: !accessToken ? 500 : null,
            accessToken,
        },
    };
};

interface ShopProps {
    accessToken: CreateToken;
}

export const ShopPage: React.FC<ShopProps> = ({ accessToken }) => {
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
            description="A broad selection of sports and trading card singles and sealed products."
        >
            <div className="flex flex-col w-full relative md:flex-row">
                <Filters />
                <Grid />
            </div>
        </PageWrapper>
    );
};

export default ShopPage;
