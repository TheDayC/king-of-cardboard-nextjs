import React from 'react';
import { GetServerSideProps } from 'next';

import Custom404Page from '../404';
import Product from '../../components/Product';
import { ImageItem } from '../../types/contentful';
import { Category, Configuration, Interest, StockStatus } from '../../enums/products';
import ProductWrapper from '../../components/ProductWrapper';

export const getServerSideProps: GetServerSideProps = async () => {
    // Shutting up shop.
    return {
        redirect: {
            permanent: true,
            destination: '/',
        },
    };

    /* const productSlug = safelyParse(context, 'query.slug', parseAsString, undefined);
    const product = await getProduct(undefined, productSlug);

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
                releaseDate: null,
                stockStatus: StockStatus.OutOfStock,
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
        gallery,
        price,
        salePrice,
        quantity,
        interest,
        category,
        configuration,
        releaseDate,
        metaTitle,
        metaDescription,
        stockStatus,
    } = product;

    return {
        props: {
            errorCode: null,
            metaTitle: `${metaTitle ? metaTitle : title} - King of Cardboard`,
            metaDescription: metaDescription
                ? metaDescription
                : `The ${title} sports card product from King of Cardboard.`,
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
            gallery: gallery
                ? gallery.map((image, i) => ({
                      title: `${title} gallery image ${i}`,
                      description: `${title} gallery product image ${i}`,
                      url: `${process.env.NEXT_PUBLIC_AWS_S3_URL}${image}`,
                  }))
                : [],
            price: price,
            salePrice: salePrice,
            isAvailable: quantity > 0,
            stock: quantity,
            tags: [],
            interest,
            category,
            configuration,
            shouldShowCompare: salePrice > 0 && salePrice !== price,
            releaseDate,
            stockStatus,
        },
    }; */
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
    shouldShowCompare: boolean;
    releaseDate: string | null;
    stockStatus: StockStatus;
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
    shouldShowCompare,
    releaseDate = null,
    stockStatus,
}) => {
    // Show error page if a code is provided.
    if (errorCode) {
        return <Custom404Page />;
    }

    return (
        <ProductWrapper
            title={metaTitle}
            description={metaDescription}
            image={mainImage.url}
            price={price}
            stockStatus={stockStatus}
            sku={sku}
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
                shouldShowCompare={shouldShowCompare}
                releaseDate={releaseDate}
                stockStatus={stockStatus}
            />
        </ProductWrapper>
    );
};

export default ProductPage;
