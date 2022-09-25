import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import { Document } from '@contentful/rich-text-types';

import { createLineItemOption, createOrder, setLineItem } from '../../utils/commerce';
import selector from './selector';
import { setOrder, fetchCartItems, fetchItemCount, setUpdatingCart } from '../../store/slices/cart';
import Images from './Images';
import Details from './Details';
import { addError, addSuccess } from '../../store/slices/alerts';
import { gaEvent } from '../../utils/ga';
import { parseAsNumber, parseAsString, safelyParse } from '../../utils/parsers';
import { SavedSkuOptions } from '../../types/products';
import { checkIfOrderExists } from '../../utils/order';
import { SkuOption } from '../../types/commerce';
import { ImageItem } from '../../types/contentful';
import { PriceHistory } from '../../types/imports';

interface ImportProps {
    id: string;
    name: string;
    slug: string;
    description: Document[] | null;
    sku: string;
    image: ImageItem;
    galleryImages: ImageItem[];
    amount: string;
    compareAmount: string;
    isAvailable: boolean;
    stock: number;
    hasUnlimitedStock: boolean;
    tags: string[];
    types: string[];
    categories: string[];
    options: SkuOption[];
    priceHistory: PriceHistory[];
}

export const Import: React.FC<ImportProps> = ({
    name,
    description,
    sku,
    image,
    galleryImages,
    amount,
    compareAmount,
    isAvailable,
    stock,
    hasUnlimitedStock,
    tags,
    types,
    categories,
    options,
    priceHistory,
}) => {
    const dispatch = useDispatch();
    const { status } = useSession();
    const { accessToken, items, orderId, isUpdatingCart } = useSelector(selector);
    const [savedSkuOptions, setSavedSkuOptions] = useState<SavedSkuOptions[]>([]);
    const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
    const { handleSubmit, register } = useForm();
    const item = items.find((c) => c.sku_code === sku);
    const quantity = safelyParse(item, 'quantity', parseAsNumber, 0);
    const hasExceededStock = hasUnlimitedStock ? false : quantity >= stock;
    const btnDisabled = hasExceededStock ? ' btn-disabled' : ' btn-primary';
    const btnLoading = isUpdatingCart ? ' loading' : '';
    const isQuantityAtMax = hasUnlimitedStock ? false : quantity === stock;
    const isGuest = status !== 'authenticated';

    // Handle the form submission.
    const addItemsToCart = useCallback(
        async (data: unknown) => {
            if (!accessToken || !orderId || isUpdatingCart || hasExceededStock) return;

            const attributes = {
                quantity: parseInt(safelyParse(data, 'quantity', parseAsString, '1')),
                sku_code: sku,
                name: name,
                image_url: image.url,
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
                gaEvent('addProductToCart', { sku_code: sku });
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
            sku,
            categories,
            name,
            types,
            image.url,
            savedSkuOptions,
        ]
    );

    // Handle the form submission.
    const onSubmit = useCallback(
        async (data: unknown) => {
            if (!accessToken || !orderId) return;
            dispatch(setUpdatingCart(true));
            const doesOrderExist = await checkIfOrderExists(accessToken, orderId);

            if (!doesOrderExist || items.length === 0) {
                const order = await createOrder(accessToken, isGuest);

                dispatch(setOrder(order));
            }

            addItemsToCart(data);
            dispatch(setUpdatingCart(false));
        },
        [accessToken, orderId, dispatch, addItemsToCart, isGuest]
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

    const handleAgreement = () => {
        setHasAgreedToTerms(!hasAgreedToTerms);
    };

    return (
        <div className="flex flex-col relative lg:flex-row lg:space-x-8">
            <Images mainImage={image} imageCollection={galleryImages} />

            <div id="productDetails" className="flex flex-col w-full lg:w-3/4">
                <div className="card rounded-md lg:shadow-lg md:p-4 lg:p-8">
                    <Details
                        name={name}
                        amount={amount}
                        compareAmount={compareAmount}
                        isAvailable={isAvailable}
                        quantity={stock}
                        tags={tags}
                        description={description}
                        priceHistory={priceHistory}
                        hasUnlimitedStock={hasUnlimitedStock}
                    />

                    {isAvailable && (
                        <div className="quantity mb-4 flex flex-col justify-center">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {options.length > 0 &&
                                    options.map((option) => (
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
                                <h4 className="text-3xl my-4">Add import to cart</h4>
                                <p className="my-4 text-lg">
                                    To place an order for an import you must first agree to the additional terms of
                                    service. Please read the below terms carefully and check the box to enable the add
                                    to cart button if you agree.
                                </p>
                                <div className="flex flex-row justify-start align-center my-4">
                                    <div className="form-control">
                                        <label className="label cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={hasAgreedToTerms}
                                                className="checkbox"
                                                onChange={handleAgreement}
                                            />
                                            <span className="label-text ml-4 italic">
                                                By checking this box you commit to, understand and agree that the market
                                                value of a product can and likely will fluctuate, that you agree to
                                                abide by the usual terms and conditions of the King of Cardboard service
                                                and, in addition you understand that refunds are not applicable to
                                                imports or pre-orders, and that King of Cardboard have the right to
                                                cancel an order should the value fluctuate significantly during the
                                                order process.
                                            </span>
                                        </label>
                                    </div>
                                </div>
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
                                        disabled={hasExceededStock || !hasAgreedToTerms}
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
};

export default Import;
