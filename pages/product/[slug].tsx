import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import * as contentful from 'contentful';
import { useDispatch } from 'react-redux';
import { Document } from '@contentful/rich-text-types';
import CommerceLayer from '@commercelayer/sdk';

import PageWrapper from '../../components/PageWrapper';
import {
    parseAsArrayOfDocuments,
    parseAsArrayOfStrings,
    parseAsBoolean,
    parseAsNumber,
    parseAsString,
    safelyParse,
} from '../../utils/parsers';
import Custom404Page from '../404';
import { createToken } from '../../utils/auth';
import { CreateToken, SkuOption } from '../../types/commerce';
import { setAccessToken, setExpires } from '../../store/slices/global';
import Product from '../../components/Product';
import { ImageItem } from '../../types/contentful';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const slug = safelyParse(context, 'query.slug', parseAsString, null);

    const client = contentful.createClient({
        space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
        accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_TOKEN || '',
        environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENV || '',
    });
    const accessToken = await createToken();
    const cl = CommerceLayer({
        organization: process.env.NEXT_PUBLIC_ECOM_SLUG || '',
        accessToken: accessToken.token || '',
    });
    const products = await client.getEntries({
        content_type: 'product',
        limit: 1,
        'fields.slug': slug,
    });

    if (products.items.length === 0) {
        return {
            props: {
                errorCode: 404,
                metaTitle: '',
                metaDescription: '',
                accessToken: {
                    token: null,
                    expires: '',
                },
                id: '',
                name: '',
                slug: '',
                description: null,
                sku: '',
                image: {
                    title: '',
                    description: '',
                    url: '',
                },
                galleryImages: [],
                amount: '',
                compareAmount: '',
                isAvailable: false,
                stock: 0,
                tags: [],
                types: [],
                categories: [],
                options: [],
            },
        };
    }

    const productFields = products.items[0].fields;
    const sku = safelyParse(productFields, 'productLink', parseAsString, '');
    const skus = await cl.skus.list({
        filters: {
            code_in: sku,
        },
        fields: {
            skus: ['id'],
        },
    });
    const id = safelyParse(skus[0], 'id', parseAsString, '');
    const skuInventory = await cl.skus.retrieve(id, {
        fields: {
            skus: ['inventory'],
        },
    });
    const prices = await cl.skus.prices(id, {
        fields: ['formatted_amount', 'formatted_compare_at_amount'],
    });
    const skuOptions = await cl.skus.sku_options(id, {
        fields: ['id', 'name', 'description', 'formatted_price_amount'],
    });

    return {
        props: {
            errorCode: null,
            metaTitle: safelyParse(productFields, 'metaTitle', parseAsString, ''),
            metaDescription: safelyParse(productFields, 'metaDescription', parseAsString, ''),
            accessToken,
            id,
            name: safelyParse(productFields, 'name', parseAsString, ''),
            slug: safelyParse(productFields, 'slug', parseAsString, ''),
            description: safelyParse(productFields, 'description.content', parseAsArrayOfDocuments, null),
            sku,
            image: {
                title: safelyParse(productFields, 'cardImage.fields.title', parseAsString, ''),
                description: safelyParse(productFields, 'cardImage.fields.description', parseAsString, ''),
                url: safelyParse(productFields, 'cardImage.fields.file.url', parseAsString, ''),
            },
            galleryImages: [],
            amount: safelyParse(prices[0], 'formatted_amount', parseAsString, ''),
            compareAmount: safelyParse(prices[0], 'formatted_compare_at_amount', parseAsString, ''),
            isAvailable: safelyParse(skuInventory, 'inventory.available', parseAsBoolean, false),
            stock: safelyParse(skuInventory, 'inventory.quantity', parseAsNumber, 0),
            tags: safelyParse(productFields, 'tags', parseAsArrayOfStrings, []),
            types: safelyParse(productFields, 'types', parseAsArrayOfStrings, []),
            categories: safelyParse(productFields, 'categories', parseAsArrayOfStrings, []),
            options: skuOptions.map((option) => ({
                id: option.id,
                name: option.name || '',
                description: option.description || '',
                amount: option.formatted_price_amount || '£0.00',
            })),
        },
    };
};

interface ProductPageProps {
    errorCode: number | null;
    metaTitle: string;
    metaDescription: string;
    accessToken: CreateToken;
    id: string;
    name: string;
    slug: string;
    description: Document[] | null;
    sku: string;
    image: ImageItem;
    galleryImages: ImageItem[];
    amount: string;
    compareAmount: string;
    isAvailable: boolean;
    stock: number;
    tags: string[];
    types: string[];
    categories: string[];
    options: SkuOption[];
}

export const ProductPage: React.FC<ProductPageProps> = ({
    errorCode,
    metaTitle,
    metaDescription,
    accessToken,
    id,
    name,
    slug,
    description,
    sku,
    image,
    galleryImages,
    amount,
    compareAmount,
    isAvailable,
    stock,
    tags,
    types,
    categories,
    options,
}) => {
    const dispatch = useDispatch();
    const imageUrl = image.url.length > 0 ? `https:${image.url}` : undefined;

    useEffect(() => {
        dispatch(setAccessToken(accessToken.token));
        dispatch(setExpires(accessToken.expires));
    }, [dispatch, accessToken]);

    // Show error page if a code is provided.
    if (errorCode) {
        return <Custom404Page />;
    }

    return (
        <PageWrapper title={`${metaTitle} | Import | King of Cardboard`} description={metaDescription} image={imageUrl}>
            <Product
                id={id}
                name={name}
                slug={slug}
                description={description}
                sku={sku}
                image={image}
                galleryImages={galleryImages}
                amount={amount}
                compareAmount={compareAmount}
                isAvailable={isAvailable}
                stock={stock}
                tags={tags}
                types={types}
                categories={categories}
                options={options}
            />
        </PageWrapper>
    );
};

export default ProductPage;
