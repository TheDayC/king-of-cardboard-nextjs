import React from 'react';
import { GetServerSideProps } from 'next';

import PageWrapper from '../../components/PageWrapper';
import { parseAsString, safelyParse } from '../../utils/parsers';
import Custom404Page from '../404';
import Product from '../../components/Product';
import { ImageItem } from '../../types/contentful';
import { getPrettyPrice, getProduct } from '../../utils/account/products';
import { Category, Configuration, Interest } from '../../enums/products';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const productSlug = safelyParse(context, 'query.slug', parseAsString, undefined);

    const product = await getProduct(undefined, productSlug);

    if (!product) {
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

    const { _id, title, slug, content, sku, mainImage, price, salePrice, quantity, interest, category, configuration } =
        product;

    return {
        props: {
            errorCode: null,
            metaTitle: '',
            metaDescription: '',
            id: _id,
            name: title,
            slug,
            description: content,
            sku,
            image: {
                title: `${title} main image`,
                description: `${title} main product image`,
                url: `${process.env.NEXT_PUBLIC_AWS_S3_URL}${mainImage}`,
            },
            galleryImages: [],
            amount: getPrettyPrice(price),
            compareAmount: getPrettyPrice(salePrice),
            isAvailable: quantity && quantity > 0,
            stock: quantity,
            tags: [],
            interest,
            category,
            configuration,
            shouldShowCompare: salePrice > 0 && salePrice !== price,
        },
    };
};

interface ProductPageProps {
    errorCode: number | null;
    metaTitle: string;
    metaDescription: string;
    id: string;
    name: string;
    slug: string;
    description: string | null;
    sku: string;
    image: ImageItem;
    galleryImages: ImageItem[];
    amount: string;
    compareAmount: string;
    isAvailable: boolean;
    stock: number;
    tags: string[];
    interest: Interest;
    category: Category;
    configuration: Configuration;
    shouldShowCompare: boolean;
}

export const ProductPage: React.FC<ProductPageProps> = ({
    errorCode,
    metaTitle,
    metaDescription,
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
    interest,
    category,
    configuration,
    shouldShowCompare,
}) => {
    const imageUrl = image.url.length > 0 ? `https:${image.url}` : undefined;

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
                interest={interest}
                category={category}
                configuration={configuration}
                shouldShowCompare={shouldShowCompare}
            />
        </PageWrapper>
    );
};

export default ProductPage;
