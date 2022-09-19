import React from 'react';
import { GetServerSideProps } from 'next';
import { startCase, upperCase } from 'lodash';

import PageWrapper from '../../components/PageWrapper';
import { parseAsString, safelyParse } from '../../utils/parsers';
import Shop from '../../components/Shop';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const shopType = safelyParse(context, 'query.type', parseAsString, null);

    return {
        props: {
            errorCode: !shopType ? 404 : null,
            shopType,
        },
    };
};

interface ShopTypeProps {
    shopType: string | null;
}

export const ShopType: React.FC<ShopTypeProps> = ({ shopType }) => {
    const shouldUpperCase = shopType === 'wwe' || shopType === 'ufc';
    const caseChangedShopType = shouldUpperCase ? upperCase(shopType || '') : startCase(shopType || '');

    return (
        <PageWrapper
            title={`${caseChangedShopType} | Shop | King of Cardboard`}
            description={`${caseChangedShopType} cards, sealed product and memorabilia.`}
        >
            <Shop category={shopType} />
        </PageWrapper>
    );
};

export default ShopType;
