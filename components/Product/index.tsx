import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BiErrorCircle } from 'react-icons/bi';
import { useForm } from 'react-hook-form';

import { ImageItem, SingleProduct } from '../../types/products';
import { getSkus, getSkuDetails, setLineItem } from '../../utils/commerce';
import { fetchProductBySlug, mergeSkuProductData } from '../../utils/products';
import Loading from '../Loading';
import selector from './selector';
import { get, inRange, isNaN, split } from 'lodash';
import { fetchOrder } from '../../store/slices/cart';
import Images from './Images';
import Details from './Details';
import { AlertLevel } from '../../enums/system';
import { addAlert } from '../../store/slices/alerts';
import { isArrayOfErrors, isError } from '../../utils/typeguards';

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
    const hasOptions = Boolean(currentProduct && currentProduct.options);

    // Collect errors.
    const qtyErr: string | null = get(errors, 'qty.message', null);

    const fetchProductData = useCallback(async (token: string, productSlug: string) => {
        const productData = await fetchProductBySlug(productSlug);
        console.log('🚀 ~ file: index.tsx ~ line 50 ~ fetchProductData ~ productData', productData);

        // If we find our product then move on to fetching by SKU in commerce layer.
        if (productData) {
            const skuItems = await getSkus(token, [productData.productLink]);

            if (isArrayOfErrors(skuItems)) {
                skuItems.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
            } else {
                // If we hit some skuItems then put them in the store.
                if (skuItems && skuItems.length > 0) {
                    const skuItem = await getSkuDetails(token, skuItems[0].id);

                    if (isArrayOfErrors(skuItem)) {
                        skuItem.forEach((value) => {
                            dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                        });
                    } else {
                        if (isArrayOfErrors(skuItem)) {
                            skuItem.forEach((value) => {
                                dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                            });
                        } else {
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
                metadata: {
                    types: currentProduct.types,
                    categories: currentProduct.categories,
                },
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

            if (isArrayOfErrors(hasLineItemUpdated)) {
                hasLineItemUpdated.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
            } else {
                if (hasLineItemUpdated) {
                    setLoading(false);
                    dispatch(fetchOrder(true));
                }
            }
        },
        [hasErrors, accessToken, currentProduct, order, maxQuantity, hasExceededStock]
    );

    useEffect(() => {
        if (qtyErr) {
            dispatch(addAlert({ message: qtyErr, level: AlertLevel.Error }));
        }
    }, [qtyErr]);

    if (currentProduct) {
        const description = currentProduct.description ? split(currentProduct.description, '\n\n') : [];
        const shouldShowCompare = currentProduct.amount !== currentProduct.compare_amount;
        const isAvailable = Boolean(currentProduct.inventory && currentProduct.inventory.available);
        const quantity =
            currentProduct.inventory && currentProduct.inventory.quantity ? currentProduct.inventory.quantity : 0;
        return (
            <div className="p-2 lg:p-8 relative">
                <Loading show={loading} />
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row lg:space-x-16">
                        <Images mainImage={currentImage} imageCollection={get(currentProduct, 'images.items', null)} />

                        <div id="productDetails" className="flex-grow">
                            <div className="card rounded-md shadow-lg p-2 lg:p-6">
                                <Details
                                    name={currentProduct.name}
                                    amount={currentProduct.amount}
                                    compareAmount={currentProduct.compare_amount}
                                    isAvailable={isAvailable}
                                    shouldShowCompare={shouldShowCompare}
                                    quantity={quantity}
                                    tags={currentProduct.tags}
                                    description={description}
                                />
                                <div className="quantity mb-4 flex flex-col justify-center">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="flex flex-col lg:flex-row justify-start align-center lg:space-x-2">
                                            <input
                                                type="text"
                                                placeholder="0"
                                                {...register('qty', {
                                                    required: { value: true, message: 'Must add a quantity.' },
                                                    valueAsNumber: true,
                                                })}
                                                defaultValue={1}
                                                onChange={handleFieldChange}
                                                className={`input input-lg rounded-md w-full mb-2 lg:mb-0 lg:w-20 input-bordered${
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
