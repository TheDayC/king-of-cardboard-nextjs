import React, { useCallback, useEffect, useState } from 'react';
import { GlassMagnifier } from 'react-image-magnifiers';
import { useSelector } from 'react-redux';
import Image from 'next/image';

import { ContentfulProduct, ImageItem, SingleProduct } from '../../types/products';
import { getSkus, getSku } from '../../utils/commerce';
import { fetchProductBySlug, mergeSkuProductData } from '../../utils/products';
import Loading from '../Loading';
import selector from './selector';
import styles from './product.module.css';
import { split } from 'lodash';

interface ProductProps {
    slug: string;
}

export const Product: React.FC<ProductProps> = ({ slug }) => {
    const { accessToken } = useSelector(selector);
    const [product, setProduct] = useState<ContentfulProduct | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState<ImageItem | null>(null);
    const [currentProduct, setCurrentProduct] = useState<SingleProduct | null>(null);

    const fetchProductData = useCallback(async (token: string, productSlug: string) => {
        const productData = await fetchProductBySlug(productSlug);

        // If we find our product then move on to fetching by SKU in commerce layer.
        if (productData) {
            const skuItems = await getSkus(token, [productData.productLink]);

            // If we hit some skuItems then put them in the store.
            if (skuItems) {
                const skuItem = await getSku(token, skuItems[0].id);

                if (skuItem) {
                    const mergedProduct = mergeSkuProductData(productData, skuItems[0], skuItem);

                    if (mergedProduct) {
                        setCurrentProduct(mergedProduct);
                    }
                }
            }
        }

        setProduct(productData);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (accessToken) {
            fetchProductData(accessToken, slug);
        }
    }, [accessToken, slug]);

    // Set first image.
    useEffect(() => {
        if (currentProduct && currentProduct.images) {
            setCurrentImage(currentProduct.images.items[0]);
        }
    }, [currentProduct]);

    if (currentProduct) {
        const description = currentProduct.description ? split(currentProduct.description, '\n\n') : [];
        const shouldShowCompare = currentProduct.amount !== currentProduct.compare_amount;
        const isAvailable = currentProduct.inventory && currentProduct.inventory.available;
        const quantity =
            currentProduct.inventory && currentProduct.inventory.quantity ? currentProduct.inventory.quantity : 0;
        return (
            <div className="p-8">
                <div className="container mx-auto">
                    <div className="flex flex-row space-x-16">
                        <Loading show={loading} />
                        <div id="productImagesWrapper" className="flex flex-col">
                            {currentImage && (
                                <div id="productImages" className="flex-1 w-60">
                                    <GlassMagnifier
                                        imageSrc={currentImage ? currentImage.url : ''}
                                        imageAlt={currentImage ? currentImage.title : ''}
                                        allowOverflow
                                        magnifierSize="50%"
                                        magnifierBorderSize={5}
                                        magnifierBorderColor="rgba(255, 255, 255, .5)"
                                        square={false}
                                    />
                                </div>
                            )}

                            {currentProduct.images && currentProduct.images.items && (
                                <div className="flex flex-1 flex-row flex-wrap space-x-2 mt-4">
                                    {currentProduct.images.items.map((image) => (
                                        <div className={styles.imageContainer}>
                                            <Image
                                                src={image.url}
                                                alt="shipment image"
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div id="productDetails" className="flex-grow">
                            <div className="card rounded-md shadow-lg p-6">
                                <h1 className="card-title text-xl lg:text-4xl">{currentProduct.name}</h1>
                                <div className="flex flex-row">
                                    {shouldShowCompare && (
                                        <span className="text-xs line-through text-base-200 mr-2 mt-1">
                                            {currentProduct.compare_amount}
                                        </span>
                                    )}
                                    <p className="text-xl font-semibold">{currentProduct.amount}</p>
                                </div>
                                <div className="flex flex-col mb-2">
                                    <p className="text-base-200 text-sm text-mb-2">
                                        {isAvailable ? `In Stock - Quantity ${quantity}` : 'Out of Stock'}
                                    </p>
                                </div>
                                <div className="flex flex-row flex-wrap justify-start items-center mb-4 space-x-2">
                                    {currentProduct.tags &&
                                        currentProduct.tags.map((tag) => (
                                            <div className="badge badge-secondary badge-outline" key={`tag-${tag}`}>
                                                {tag}
                                            </div>
                                        ))}
                                </div>
                                <div className="description">
                                    {description.map((d) => (
                                        <p className="mb-4">{d}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        return null;
    }
};

export default Product;
