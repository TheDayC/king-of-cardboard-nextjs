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
import { SingleBreak, BreakSlot, ContentfulBreak } from '../../types/breaks';
import Slots from './Slots';

interface BreakProps {
    slug: string;
}

export const Break: React.FC<BreakProps> = ({ slug }) => {
    const dispatch = useDispatch();
    const { accessToken, items, order } = useSelector(selector);
    const [loading, setLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState<ImageItem | null>(null);
    const [currentBreak, setCurrentBreak] = useState<ContentfulBreak | null>(null);
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
    /*  const stock = currentBreak && currentBreak.amount && currentBreak.inventory ? currentBreak.inventory.quantity : 0;
    const currentLineItem = items && currentBreak ? items.find((c) => c.sku_code === currentBreak.sku_code) : null;
    const hasExceededStock = currentLineItem ? currentLineItem.quantity >= stock : false;
    const hasOptions = Boolean(currentBreak && currentBreak.options); */

    // Collect errors.
    const qtyErr: string | null = get(errors, 'qty.message', null);

    const fetchBreakData = useCallback(async (token: string, productSlug: string) => {
        const breakData = await fetchBreakBySlug(productSlug);

        // If we find our product then move on to fetching by SKU in commerce layer.
        if (breakData) {
            setCurrentBreak(breakData);
            // const slots: BreakSlot[] | null = get(breakData, 'breakSlotsCollection.items', null);

            // if (slots){
            /*  const sku_codes = slots
                    ? slots.filter((slot) => slot).map((slot) => slot.productLink)
                    : [];

                const skuItems = await getSkus(token, sku_codes); */

            // If we hit some skuItems then put them in the store.
            /* if (skuItems && skuItems.length > 0) {
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
                } */
            // }
            /* const skuItems = await getSkus(token, [breakData.productLink]); */
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
        if (currentBreak && currentBreak.imagesCollection) {
            setCurrentImage(currentBreak.imagesCollection.items[0]);
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

    // Handle the form submission.
    const onSubmit = useCallback(
        async (data: any) => {
            /* const { qty } = data;
            setLoading(true);

            if (isNaN(qty) || hasErrors || !accessToken || !currentBreak || !order) {
                setLoading(false);
                return;
            }

            if (!inRange(qty, 1, maxQuantity + 1)) {
                handleQtyError(`Quantity must be between 1 and ${maxQuantity}.`);
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
            } */
        },
        [hasErrors, accessToken, currentBreak, order, maxQuantity]
    );

    if (currentBreak) {
        const description = currentBreak.description ? split(currentBreak.description, '\n\n') : [];
        const slots: BreakSlot[] | null = get(currentBreak, 'breakSlotsCollection.items', null);

        return (
            <div className="p-8 relative">
                <Loading show={loading} />
                <div className="container mx-auto">
                    <div className="flex flex-row space-x-16">
                        <Images mainImage={currentImage} imageCollection={get(currentBreak, 'images.items', null)} />

                        <div id="productDetails" className="flex-grow">
                            <div className="card rounded-md shadow-lg bordered p-6">
                                <Details name={currentBreak.title} tags={currentBreak.tags} description={description} />
                                {slots && <Slots slots={slots} format={currentBreak.format} />}
                                <div className="quantity mb-4 flex flex-col justify-center">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="flex flex-row justify-start align-center space-x-2">
                                            {/* <button
                                                aria-label="add to cart"
                                                className={`btn btn-lg rounded-md${
                                                    hasExceededStock ? ' btn-disabled' : ' btn-primary'
                                                }`}
                                                disabled={hasExceededStock}
                                            >
                                                Add to cart
                                            </button> */}
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
