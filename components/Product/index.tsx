import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { AiFillQuestionCircle } from 'react-icons/ai';

import { createLineItemOption, setLineItem } from '../../utils/commerce';
import selector from './selector';
import {
    createCLOrder,
    fetchCartItems,
    fetchItemCount,
    setOrderExpiry,
    setUpdatingCart,
} from '../../store/slices/cart';
import Images from './Images';
import Details from './Details';
import { addError, addSuccess } from '../../store/slices/alerts';
import { gaEvent } from '../../utils/ga';
import { parseAsNumber, parseAsString, safelyParse } from '../../utils/parsers';
import Skeleton from './Skeleton';
import Error404 from '../404';
import { getSingleProduct } from '../../utils/products';
import { SavedSkuOptions, SingleProduct } from '../../types/products';
import { checkIfOrderExists } from '../../utils/order';
import { useSession } from 'next-auth/react';

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
    skuOptions: [],
};

export const Product: React.FC = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { status } = useSession();
    const { accessToken, items, orderId, isUpdatingCart } = useSelector(selector);
    const [shouldFetch, setShouldFetch] = useState(true);
    const [shouldShow, setShouldShow] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(defaultProduct);
    const [savedSkuOptions, setSavedSkuOptions] = useState<SavedSkuOptions[]>([]);
    const { handleSubmit, register } = useForm();
    const { inventory, sku_code, description, name, types, categories, cardImage, skuOptions } = currentProduct;
    const stock = inventory.quantity;
    const item = items.find((c) => c.sku_code === sku_code);
    const quantity = safelyParse(item, 'quantity', parseAsNumber, 0);
    const hasExceededStock = quantity >= stock;
    const btnDisabled = hasExceededStock ? ' btn-disabled' : ' btn-primary';
    const btnLoading = isUpdatingCart ? ' loading' : '';
    const isQuantityAtMax = quantity === stock;
    const slug = safelyParse(router, 'query.slug', parseAsString, '');
    const isGuest = status !== 'authenticated';

    const fetchSingleProduct = useCallback(async (token: string, slug: string) => {
        const prod = await getSingleProduct(token, slug);

        setCurrentProduct(prod);
        setShouldShow(true);
    }, []);

    // Handle the form submission.
    const addItemsToCart = useCallback(
        async (data: unknown) => {
            if (!accessToken || !orderId || isUpdatingCart || hasExceededStock) return;

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

            const lineItemId = await setLineItem(accessToken, attributes, relationships);

            if (lineItemId) {
                // Create line item options
                if (savedSkuOptions.length) {
                    for (const savedSkuOption of savedSkuOptions) {
                        await createLineItemOption(accessToken, lineItemId, savedSkuOption);
                    }
                }

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
            savedSkuOptions,
        ]
    );

    // Handle the form submission.
    const onSubmit = useCallback(
        async (data: unknown) => {
            if (!accessToken || !orderId) return;
            dispatch(setUpdatingCart(true));
            const doesOrderExist = await checkIfOrderExists(accessToken, orderId);

            if (!doesOrderExist) {
                dispatch(createCLOrder({ accessToken, isGuest }));
                dispatch(addError('Order could not be found, please try adding product again.'));
                dispatch(setUpdatingCart(false));
                return;
            }

            addItemsToCart(data);
        },
        [accessToken, orderId, dispatch]
    );

    const handleSkuOptionChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        id: string,
        amount: string,
        name: string,
        quantity: number
    ) => {
        const checked = e.target.checked;

        if (checked) {
            setSavedSkuOptions([...savedSkuOptions, { id, amount, name, quantity }]);
        } else {
            setSavedSkuOptions(savedSkuOptions.filter((option) => option.id !== id));
        }
    };

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
                                    {skuOptions.length > 0 &&
                                        skuOptions.map((option) => (
                                            <React.Fragment key={`option-${option.id}`}>
                                                <h4 className="text-2xl mb-2 font-semibold">Extras</h4>
                                                <div
                                                    className="flex flex-col justify-start align-center mb-2 lg:space-x-2 lg:flex-row"
                                                    key={`option-${option.id}`}
                                                >
                                                    <label className="cursor-pointer label">
                                                        <span className="label-text text-lg mr-2">
                                                            {option.name} - {option.amount}
                                                        </span>
                                                        <input
                                                            type="checkbox"
                                                            className="toggle toggle-primary mr-2"
                                                            onChange={(e) =>
                                                                handleSkuOptionChange(
                                                                    e,
                                                                    option.id,
                                                                    option.amount,
                                                                    option.name,
                                                                    1
                                                                )
                                                            }
                                                        />
                                                        <div className="tooltip mr-2" data-tip={option.description}>
                                                            <AiFillQuestionCircle className="text-lg text-accent" />
                                                        </div>
                                                    </label>
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    <h4 className="text-2xl mt-2 mb-2 font-semibold">Amount</h4>
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
