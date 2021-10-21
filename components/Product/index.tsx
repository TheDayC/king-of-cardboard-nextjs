import React, { useCallback, useEffect, useState } from 'react';
import { GlassMagnifier } from 'react-image-magnifiers';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { MdRemoveCircleOutline, MdAddCircleOutline } from 'react-icons/md';
import { BiErrorCircle } from 'react-icons/bi';
import { useForm } from 'react-hook-form';

import { ContentfulProduct, ImageItem, SingleProduct } from '../../types/products';
import { getSkus, getSkuDetails, updateLineItem, setLineItem } from '../../utils/commerce';
import { fetchProductBySlug, mergeSkuProductData } from '../../utils/products';
import Loading from '../Loading';
import selector from './selector';
import styles from './product.module.css';
import { get, inRange, isNaN, isNumber, set, split } from 'lodash';
import { fetchOrder } from '../../store/slices/cart';

interface ProductProps {
    slug: string;
}

export const Product: React.FC<ProductProps> = ({ slug }) => {
    const dispatch = useDispatch();
    const { accessToken, items, order } = useSelector(selector);
    const [loading, setLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState<ImageItem | null>(null);
    const [currentProduct, setCurrentProduct] = useState<SingleProduct | null>(null);
    const [chosenQuantity, setChosenQuantity] = useState(1);
    const [maxQuantity, setMaxQuantity] = useState(1);
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
    } = useForm();
    const hasErrors = Object.keys(errors).length > 0;
    const stock =
        currentProduct && currentProduct.amount && currentProduct.inventory ? currentProduct.inventory.quantity : 0;
    const currentLineItem = items && currentProduct ? items.find((c) => c.sku_code === currentProduct.sku_code) : null;
    const hasExceededStock = currentLineItem ? currentLineItem.quantity >= stock : false;

    // Collect errors.
    const qtyErr = get(errors, 'qty.message', null);

    const fetchProductData = useCallback(async (token: string, productSlug: string) => {
        const productData = await fetchProductBySlug(productSlug);

        // If we find our product then move on to fetching by SKU in commerce layer.
        if (productData) {
            const skuItems = await getSkus(token, [productData.productLink]);

            // If we hit some skuItems then put them in the store.
            if (skuItems) {
                const skuItem = await getSkuDetails(token, skuItems[0].id);

                if (skuItem) {
                    const mergedProduct = mergeSkuProductData(productData, skuItems[0], skuItem);

                    if (mergedProduct) {
                        const quantity =
                            mergedProduct.inventory && mergedProduct.inventory.quantity
                                ? mergedProduct.inventory.quantity
                                : 0;

                        setMaxQuantity(quantity);
                        setCurrentProduct(mergedProduct);
                    }
                }
            }
        }

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

    const handleFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        const replacedValue = value.replace(/[^0-9]/g, '');

        setValue('qty', replacedValue, { shouldValidate: true });
    }, []);

    const handleQtyError = useCallback((message: string) => {
        setError('qty', {
            type: 'manual',
            message: message,
        });
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!currentLineItem) {
            return;
        }

        setChosenQuantity(currentLineItem.quantity);
    }, [currentLineItem && currentLineItem.quantity]);

    useEffect(() => {
        if (hasExceededStock) {
            handleQtyError(`Maximum quantity of ${maxQuantity} is currently in your cart.`);
        }
    }, [hasExceededStock]);

    // Handle the form submission.
    const onSubmit = useCallback(
        async (data: any) => {
            const { qty } = data;
            setLoading(true);

            if (isNaN(qty) || hasErrors || !accessToken || !currentProduct || !order) {
                setLoading(false);
                return;
            }

            if (!inRange(qty, 1, maxQuantity + 1)) {
                handleQtyError(`Quantity must be between 1 and ${maxQuantity}.`);
                return;
            }

            if (hasExceededStock) {
                handleQtyError(`Maximum quantity of ${maxQuantity} is currently in your cart.`);
                return;
            }

            const attributes = {
                quantity: qty,
                sku_code: currentProduct.sku_code || '',
                name: currentProduct.name,
                image_url: currentImage ? currentImage.url : '',
                _external_price: false,
                _update_quantity: true,
            };

            const relationships = {
                order: {
                    data: {
                        id: order.id,
                        type: 'orders',
                    },
                },
            };

            const hasLineItemUpdated = await setLineItem(accessToken, attributes, relationships);

            if (hasLineItemUpdated) {
                setLoading(false);
                dispatch(fetchOrder(true));
            }
        },
        [hasErrors, accessToken, currentProduct, order, maxQuantity, hasExceededStock]
    );

    if (currentProduct) {
        const description = currentProduct.description ? split(currentProduct.description, '\n\n') : [];
        const shouldShowCompare = currentProduct.amount !== currentProduct.compare_amount;
        const isAvailable = currentProduct.inventory && currentProduct.inventory.available;
        const quantity =
            currentProduct.inventory && currentProduct.inventory.quantity ? currentProduct.inventory.quantity : 0;
        return (
            <div className="p-8 relative">
                <Loading show={loading} />
                <div className="container mx-auto">
                    <div className="flex flex-row space-x-16">
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
                                    {currentProduct.images.items.map((image, index) => (
                                        <div className={styles.imageContainer} key={`line-item-${index}`}>
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
                                    {description.map((d, i) => (
                                        <p className="mb-4" key={`description-${i}`}>
                                            {d}
                                        </p>
                                    ))}
                                </div>
                                <div className="quantity mb-4 flex flex-col justify-center">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="flex flex-row justify-start align-center space-x-2">
                                            <input
                                                type="text"
                                                placeholder="0"
                                                {...register('qty', {
                                                    required: { value: true, message: 'Must add a quantity.' },
                                                    valueAsNumber: true,
                                                })}
                                                defaultValue={1}
                                                onChange={handleFieldChange}
                                                className={`input input-lg rounded-md w-20 input-bordered${
                                                    qtyErr ? ' input-error' : ''
                                                }`}
                                                disabled={hasExceededStock}
                                            />
                                            <button
                                                aria-label="add to cart"
                                                className={`btn btn-lg rounded-md${
                                                    hasExceededStock ? ' btn-disabled' : ' btn-primary'
                                                }`}
                                                disabled={hasExceededStock}
                                            >
                                                Add to cart
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                {qtyErr && (
                                    <div className="alert alert-error rounded-md">
                                        <div className="flex-1">
                                            <BiErrorCircle className="w-6 h-6 mx-2 stroke-current" />
                                            <label>{qtyErr}</label>
                                        </div>
                                    </div>
                                )}
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
