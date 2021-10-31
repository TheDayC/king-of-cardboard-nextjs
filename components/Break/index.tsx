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
import ErrorAlert from '../ErrorAlert';
import { fetchBreakBySlug, mergeSkuBreakData } from '../../utils/breaks';
import { SingleBreak } from '../../types/breaks';

interface BreakProps {
    slug: string;
}

export const Break: React.FC<BreakProps> = ({ slug }) => {
    const dispatch = useDispatch();
    const { accessToken, items, order } = useSelector(selector);
    const [loading, setLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState<ImageItem | null>(null);
    const [currentBreak, setCurrentBreak] = useState<SingleBreak | null>(null);
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
    const stock = currentBreak && currentBreak.amount && currentBreak.inventory ? currentBreak.inventory.quantity : 0;
    const currentLineItem = items && currentBreak ? items.find((c) => c.sku_code === currentBreak.sku_code) : null;
    const hasExceededStock = currentLineItem ? currentLineItem.quantity >= stock : false;
    const hasOptions = Boolean(currentBreak && currentBreak.options);

    // Collect errors.
    const qtyErr: string | null = get(errors, 'qty.message', null);

    const fetchBreakData = useCallback(async (token: string, productSlug: string) => {
        const breakData = await fetchBreakBySlug(productSlug);

        // If we find our product then move on to fetching by SKU in commerce layer.
        if (breakData) {
            const skuItems = await getSkus(token, [breakData.productLink]);

            // If we hit some skuItems then put them in the store.
            if (skuItems && skuItems.length > 0) {
                const skuItem = await getSkuDetails(token, skuItems[0].id);

                if (skuItem) {
                    const mergedBreak = mergeSkuBreakData(breakData, skuItems[0], skuItem);

                    if (mergedBreak) {
                        const quantity =
                            mergedBreak.inventory && mergedBreak.inventory.quantity
                                ? mergedBreak.inventory.quantity
                                : 0;

                        setMaxQuantity(quantity);
                        setCurrentBreak(mergedBreak);
                    }
                }
            }
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        if (accessToken) {
            fetchBreakData(accessToken, slug);
        }
    }, [accessToken, slug]);

    // Set first image.
    useEffect(() => {
        if (currentBreak && currentBreak.images) {
            setCurrentImage(currentBreak.images.items[0]);
        }
    }, [currentBreak]);

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

            if (isNaN(qty) || hasErrors || !accessToken || !currentBreak || !order) {
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
                sku_code: currentBreak.sku_code || '',
                name: currentBreak.title,
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
        [hasErrors, accessToken, currentBreak, order, maxQuantity, hasExceededStock]
    );

    if (currentBreak) {
        const description = currentBreak.description ? split(currentBreak.description, '\n\n') : [];
        const shouldShowCompare = currentBreak.amount !== currentBreak.compare_amount;
        const isAvailable = Boolean(currentBreak.inventory && currentBreak.inventory.available);
        const quantity =
            currentBreak.inventory && currentBreak.inventory.quantity ? currentBreak.inventory.quantity : 0;
        return (
            <div className="p-8 relative">
                <Loading show={loading} />
                <div className="container mx-auto">
                    <div className="flex flex-row space-x-16">
                        <Images mainImage={currentImage} imageCollection={get(currentBreak, 'images.items', null)} />

                        <div id="productDetails" className="flex-grow">
                            <div className="card rounded-md shadow-lg bordered p-6">
                                <Details
                                    name={currentBreak.title}
                                    amount={currentBreak.amount}
                                    compareAmount={currentBreak.compare_amount}
                                    isAvailable={isAvailable}
                                    shouldShowCompare={shouldShowCompare}
                                    quantity={quantity}
                                    tags={currentBreak.tags}
                                    description={description}
                                />
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
                                <ErrorAlert error={qtyErr} />
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

export default Break;
