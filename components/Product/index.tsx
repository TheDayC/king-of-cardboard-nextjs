import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { setLineItem } from '../../utils/commerce';
import selector from './selector';
import { fetchCartItems, fetchItemCount, setUpdatingCart } from '../../store/slices/cart';
import Images from './Images';
import Details from './Details';
import { addError, addSuccess } from '../../store/slices/alerts';
import { gaEvent } from '../../utils/ga';
import { parseAsNumber, parseAsString, safelyParse } from '../../utils/parsers';
import Skeleton from './Skeleton';
import Error404 from '../404';
import { getSingleProduct } from '../../utils/products';
import { SingleProduct } from '../../types/products';

const defaultProduct: SingleProduct = {
    id: '',
    name: '',
    slug: '',
    sku_code: '',
    description: null,
    types: [],
    categories: [],
    images: {
        items: [],
    },
    cardImage: {
        title: '',
        description: '',
        url: '',
    },
    tags: [],
    amount: '',
    compare_amount: '',
    inventory: {
        available: false,
        quantity: 0,
        levels: [],
    },
};

export const Product: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { accessToken, items, orderId, isUpdatingCart } = useSelector(selector);
    const [shouldFetch, setShouldFetch] = useState(true);
    const [shouldShow, setShouldShow] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(defaultProduct);
    const { handleSubmit, register } = useForm();
    const { inventory, sku_code, description, name, types, categories, cardImage } = currentProduct;
    const stock = inventory.quantity;
    const item = items.find((c) => c.sku_code === sku_code);
    const quantity = safelyParse(item, 'quantity', parseAsNumber, 0);
    const hasExceededStock = quantity >= stock;
    const btnDisabled = hasExceededStock ? ' btn-disabled' : ' btn-primary';
    const btnLoading = isUpdatingCart ? ' loading' : '';
    const isQuantityAtMax = quantity === stock;
    const slug = safelyParse(router, 'query.slug', parseAsString, '');

    const fetchSingleProduct = useCallback(async (token: string, slug: string) => {
        const prod = await getSingleProduct(token, slug);

        setCurrentProduct(prod);
        setShouldShow(true);
    }, []);

    // Handle the form submission.
    const onSubmit = useCallback(
        async (data: unknown) => {
            if (!accessToken || !orderId || isUpdatingCart || hasExceededStock) return;
            dispatch(setUpdatingCart(true));

            const attributes = {
                quantity: parseInt(safelyParse(data, 'quantity', parseAsString, '1')),
                sku_code: sku_code,
                name: name,
                image_url: cardImage.url,
                _external_price: false,
                _update_quantity: true,
                metadata: {
                    types: types,
                    categories: categories,
                },
            };

            const relationships = {
                order: {
                    data: {
                        id: orderId,
                        type: 'orders',
                    },
                },
            };

            const hasLineItemUpdated = await setLineItem(accessToken, attributes, relationships);

            if (hasLineItemUpdated) {
                dispatch(fetchItemCount({ accessToken, orderId }));
                dispatch(fetchCartItems({ accessToken, orderId }));
                gaEvent('addProductToCart', { sku_code });
                dispatch(addSuccess(`${name} added to cart.`));
            } else {
                dispatch(setUpdatingCart(false));
                dispatch(addError('Failed to add product, please check the quantity.'));
            }
        },
        [
            accessToken,
            orderId,
            dispatch,
            isUpdatingCart,
            hasExceededStock,
            sku_code,
            categories,
            name,
            types,
            cardImage.url,
        ]
    );

    useEffect(() => {
        if (shouldFetch && slug && accessToken) {
            setShouldFetch(false);
            fetchSingleProduct(accessToken, slug);
        }
    }, [shouldFetch, dispatch, fetchSingleProduct, accessToken, slug]);

    if (shouldShow) {
        if (currentProduct.name.length <= 0) {
            return <Error404 />;
        }

        return (
            <div className="flex flex-col relative lg:flex-row lg:space-x-8">
                <Head>
                    <title>{currentProduct.name} - Product - King of Cardboard</title>
                    <meta
                        property="og:title"
                        content={`${currentProduct.name} - Product - King of Cardboard`}
                        key="title"
                    />
                </Head>
                <Images mainImage={currentProduct.cardImage} imageCollection={currentProduct.images.items} />

                <div id="productDetails" className="flex flex-col w-full lg:w-3/4">
                    <div className="card rounded-md lg:shadow-lg md:p-4 lg:p-8">
                        <Details
                            name={currentProduct.name}
                            amount={currentProduct.amount}
                            compareAmount={currentProduct.compare_amount}
                            isAvailable={currentProduct.inventory.available}
                            quantity={stock}
                            tags={currentProduct.tags}
                            description={description}
                        />
                        {currentProduct.inventory.available && (
                            <div className="quantity mb-4 flex flex-col justify-center">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="flex flex-col lg:flex-row justify-start align-center lg:space-x-2">
                                        {!isQuantityAtMax && (
                                            <input
                                                type="number"
                                                defaultValue="1"
                                                {...register('quantity', {
                                                    required: { value: true, message: 'Required' },
                                                })}
                                                className="input input-lg input-bordered text-center w-32 px-0 w-full mb-4 lg:w-auto lg:mb-0"
                                            />
                                        )}
                                        <button
                                            aria-label="add to cart"
                                            className={`btn btn-lg w-full lg:w-auto rounded-md${btnDisabled}${btnLoading}`}
                                            disabled={hasExceededStock}
                                        >
                                            {isUpdatingCart ? '' : 'Add to cart'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    } else {
        return <Skeleton />;
    }
};

export default Product;
