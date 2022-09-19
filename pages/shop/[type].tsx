import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { startCase, upperCase } from 'lodash';
import { useDispatch } from 'react-redux';

import PageWrapper from '../../components/PageWrapper';
import { parseAsString, safelyParse } from '../../utils/parsers';
import Filters from '../../components/Shop/Filters';
import Grid from '../../components/Shop/Grid';
import { removeAllProductTypes, setUrlProductType } from '../../store/slices/filters';
import { createToken } from '../../utils/auth';
import { CreateToken } from '../../types/commerce';
import { setAccessToken, setExpires } from '../../store/slices/global';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const shopType = safelyParse(context, 'query.type', parseAsString, null);
    const accessToken = await createToken();

    return {
        props: {
            errorCode: !shopType ? 404 : null,
            shopType,
            accessToken,
        },
    };
};

interface ShopTypeProps {
    shopType: string | null;
    accessToken: CreateToken;
}

export const ShopType: React.FC<ShopTypeProps> = ({ shopType, accessToken }) => {
    const dispatch = useDispatch();
    const shouldUpperCase = shopType === 'wwe' || shopType === 'ufc';
    const caseChangedShopType = shouldUpperCase ? upperCase(shopType || '') : startCase(shopType || '');

    useEffect(() => {
        if (shopType) {
            dispatch(setUrlProductType(shopType));
        } else {
            dispatch(removeAllProductTypes());
        }
    }, [dispatch, shopType]);

    useEffect(() => {
        dispatch(setAccessToken(accessToken.token));
        dispatch(setExpires(accessToken.expires));
    }, [dispatch, accessToken]);

    return (
        <PageWrapper
            title={`${caseChangedShopType} | Shop | King of Cardboard`}
            description={`${caseChangedShopType} cards, sealed product and memorabilia.`}
        >
            <div className="flex flex-col w-full relative md:flex-row">
                <Filters />
                <Grid />
            </div>
        </PageWrapper>
    );
};

export default ShopType;
