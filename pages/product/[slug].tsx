import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import * as contentful from 'contentful';
import { useDispatch } from 'react-redux';

import Product from '../../components/Product';
import PageWrapper from '../../components/PageWrapper';
import { parseAsString, safelyParse } from '../../utils/parsers';
import Custom404Page from '../404';
import { createToken } from '../../utils/auth';
import { CreateToken } from '../../types/commerce';
import { setAccessToken, setExpires } from '../../store/slices/global';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const slug = safelyParse(context, 'query.slug', parseAsString, null);

    const client = contentful.createClient({
        space: process.env.CONTENTFUL_SPACE_ID || '',
        accessToken: process.env.CONTENTFUL_TOKEN || '',
        environment: process.env.CONTENTFUL_ENV || '',
    });
    const products = await client.getEntries({
        content_type: 'product',
        limit: 1,
        'fields.slug': slug,
    });
    const imageUrl = safelyParse(products.items[0], 'fields.cardImage.fields.file.url', parseAsString, null);
    const accessToken = await createToken();

    return {
        props: {
            errorCode: !slug ? 404 : null,
            metaTitle: safelyParse(products.items[0], 'fields.metaTitle', parseAsString, ''),
            metaDescription: safelyParse(products.items[0], 'fields.metaDescription', parseAsString, ''),
            imageUrl: imageUrl ? `https:${imageUrl}` : undefined,
            accessToken,
        },
    };
};

interface ProductPageProps {
    errorCode: number | null;
    metaTitle: string;
    metaDescription: string;
    imageUrl?: string;
    accessToken: CreateToken;
}

export const ProductPage: React.FC<ProductPageProps> = ({
    errorCode,
    metaTitle,
    metaDescription,
    imageUrl,
    accessToken,
}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setAccessToken(accessToken.token));
        dispatch(setExpires(accessToken.expires));
    }, [dispatch, accessToken]);

    // Show error page if a code is provided.
    if (errorCode) {
        return <Custom404Page />;
    }

    return (
        <PageWrapper
            title={`${metaTitle} | Product | King of Cardboard`}
            description={metaDescription}
            image={imageUrl}
        >
            <Product />
        </PageWrapper>
    );
};

export default ProductPage;
