import React, { useEffect } from 'react';
import { GetServerSideProps } from 'next';
import * as contentful from 'contentful';
import { useDispatch } from 'react-redux';
import { Document } from '@contentful/rich-text-types';
import CommerceLayer from '@commercelayer/sdk';

import PageWrapper from '../../components/PageWrapper';
import {
    parseAsArrayOfDocuments,
    parseAsArrayOfRepeater,
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
import Import from '../../components/Import';
import { ImageItem, Repeater } from '../../types/contentful';
import { PriceHistory } from '../../types/imports';

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
    const imports = await client.getEntries({
        content_type: 'import',
        limit: 1,
        'fields.slug': slug,
    });

    if (imports.items.length === 0) {
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

    const importFields = imports.items[0].fields;
    const sku = safelyParse(importFields, 'productLink', parseAsString, '');
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
    const priceRepeater = safelyParse(importFields, 'priceHistory', parseAsArrayOfRepeater, [] as Repeater[]);

    return {
        props: {
            errorCode: null,
            metaTitle: safelyParse(importFields, 'metaTitle', parseAsString, ''),
            metaDescription: safelyParse(importFields, 'metaDescription', parseAsString, ''),
            accessToken,
            id,
            name: safelyParse(importFields, 'name', parseAsString, ''),
            slug: safelyParse(importFields, 'slug', parseAsString, ''),
            description: safelyParse(importFields, 'description.content', parseAsArrayOfDocuments, null),
            sku,
            image: {
                title: safelyParse(importFields, 'cardImage.fields.title', parseAsString, ''),
                description: safelyParse(importFields, 'cardImage.fields.description', parseAsString, ''),
                url: safelyParse(importFields, 'cardImage.fields.file.url', parseAsString, ''),
            },
            galleryImages: [],
            amount: safelyParse(prices[0], 'formatted_amount', parseAsString, ''),
            compareAmount: safelyParse(prices[0], 'formatted_compare_at_amount', parseAsString, ''),
            isAvailable: safelyParse(skuInventory, 'inventory.available', parseAsBoolean, false),
            stock: safelyParse(skuInventory, 'inventory.quantity', parseAsNumber, 0),
            tags: safelyParse(importFields, 'tags', parseAsArrayOfStrings, []),
            types: safelyParse(importFields, 'types', parseAsArrayOfStrings, []),
            categories: safelyParse(importFields, 'categories', parseAsArrayOfStrings, []),
            options: skuOptions.map((option) => ({
                id: option.id,
                name: option.name || '',
                description: option.description || '',
                amount: option.formatted_price_amount || '£0.00',
            })),
            priceHistory: priceRepeater.map((r) => ({
                timestamp: safelyParse(r, 'key', parseAsString, ''),
                amount: safelyParse(r, 'value', parseAsString, ''),
            })),
        },
    };
};

interface ImportPageProps {
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
    priceHistory: PriceHistory[];
}

export const ImportPage: React.FC<ImportPageProps> = ({
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
    priceHistory,
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
            <Import
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
                priceHistory={priceHistory}
            />
        </PageWrapper>
    );
};

export default ImportPage;
