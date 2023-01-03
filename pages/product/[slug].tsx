import React from 'react';
import { GetServerSideProps } from 'next';

import PageWrapper from '../../components/PageWrapper';
import { parseAsString, safelyParse } from '../../utils/parsers';
import Custom404Page from '../404';
import Product from '../../components/Product';
import { ImageItem } from '../../types/contentful';
import { getProduct } from '../../utils/account/products';
import { Category, Configuration, Interest } from '../../enums/products';
import { PriceHistory } from '../../types/products';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const productSlug = safelyParse(context, 'query.slug', parseAsString, undefined);

    const product = await getProduct(undefined, productSlug);
    console.log('🚀 ~ file: [slug].tsx:17 ~ constgetServerSideProps:GetServerSideProps= ~ product', product);

    if (!product) {
        return {
            props: {
                errorCode: 404,
                metaTitle: '',
                metaDescription: '',
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
                price: '',
                salePrice: '',
                isAvailable: false,
                stock: 0,
                tags: [],
                types: [],
                categories: [],
                options: [],
                priceHistory: [],
                releaseDate: null,
            },
        };
    }

    const {
        _id,
        title,
        slug,
        content,
        sku,
        mainImage,
        price,
        salePrice,
        quantity,
        interest,
        category,
        configuration,
        priceHistory,
        releaseDate,
    } = product;

    return {
        props: {
            errorCode: null,
            metaTitle: '',
            metaDescription: '',
            id: _id,
            name: title,
            slug,
            description: content || null,
            sku,
            mainImage: {
                title: `${title} main image`,
                description: `${title} main product image`,
                url: `${process.env.NEXT_PUBLIC_AWS_S3_URL}${mainImage}`,
            },
            gallery: [],
            price: price,
            salePrice: salePrice,
            isAvailable: quantity > 0,
            stock: quantity,
            tags: [],
            interest,
            category,
            configuration,
            priceHistory,
            shouldShowCompare: salePrice > 0 && salePrice !== price,
            releaseDate,
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
    mainImage: ImageItem;
    gallery: ImageItem[];
    price: number;
    salePrice: number;
    isAvailable: boolean;
    stock: number;
    tags: string[];
    interest: Interest;
    category: Category;
    configuration: Configuration;
    priceHistory: PriceHistory[];
    shouldShowCompare: boolean;
    releaseDate: string | null;
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
    mainImage,
    gallery,
    price,
    salePrice,
    isAvailable,
    stock,
    tags,
    interest,
    category,
    configuration,
    priceHistory,
    shouldShowCompare,
    releaseDate = null,
}) => {
    // Show error page if a code is provided.
    if (errorCode) {
        return <Custom404Page />;
    }

    return (
        <PageWrapper
            title={`${metaTitle} | Import | King of Cardboard`}
            description={metaDescription}
            image={mainImage.url}
        >
            <Product
                id={id}
                title={name}
                slug={slug}
                description={description}
                sku={sku}
                mainImage={mainImage}
                gallery={gallery}
                price={price}
                salePrice={salePrice}
                isAvailable={isAvailable}
                stock={stock}
                tags={tags}
                interest={interest}
                category={category}
                configuration={configuration}
                priceHistory={priceHistory}
                shouldShowCompare={shouldShowCompare}
                releaseDate={releaseDate}
            />
        </PageWrapper>
    );
};

export default ProductPage;
