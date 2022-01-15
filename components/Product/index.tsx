import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { split } from 'lodash';

import { setLineItem } from '../../utils/commerce';
import selector from './selector';
import { fetchCartItems, fetchItemCount } from '../../store/slices/cart';
import Images from './Images';
import Details from './Details';
import { fetchSingleProduct } from '../../store/slices/products';
import { addError, addSuccess } from '../../store/slices/alerts';
import { gaEvent } from '../../utils/ga';
import { parseAsNumber, parseAsString, safelyParse } from '../../utils/parsers';

interface ProductProps {
    slug: string;
}

export const Product: React.FC<ProductProps> = ({ slug }) => {
    const dispatch = useDispatch();
    const { accessToken, items, orderId, currentProduct } = useSelector(selector);
    const [loading, setLoading] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(true);
    const { handleSubmit, register } = useForm();
    const { inventory, sku_code, description: productDesc, name, types, categories, cardImage } = currentProduct;
    const stock = inventory.quantity;
    const item = items.find((c) => c.sku_code === sku_code);
    const quantity = safelyParse(item, 'quantity', parseAsNumber, 0);
    const hasExceededStock = quantity >= stock;
    const description = split(productDesc, '\n\n');
    const btnDisabled = hasExceededStock ? ' btn-disabled' : ' btn-primary';
    const btnLoading = loading ? ' loading btn-square' : '';
    const isQuantityAtMax = quantity === stock;
    const isInBasket = Boolean(item);

    // Handle the form submission.
    const onSubmit = useCallback(
        async (data: unknown) => {
            if (!accessToken || !orderId || loading || hasExceededStock) return;
            setLoading(true);

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
                setLoading(false);
                dispatch(addError('Failed to add product, please check the quantity.'));
            }
        },
        [accessToken, orderId, dispatch, loading, hasExceededStock, sku_code, categories, name, types, cardImage.url]
    );

    useEffect(() => {
        if (accessToken && slug && shouldFetch) {
            setShouldFetch(false);
            dispatch(fetchSingleProduct({ accessToken, slug }));
        }
    }, [accessToken, slug, shouldFetch, dispatch]);

    useEffect(() => {
        if (isInBasket) {
            setLoading(false);
        }
    }, [isInBasket, setLoading]);

    if (currentProduct.id.length <= 0) return null;

    return (
        <div className="flex flex-col relative lg:flex-row lg:space-x-8">
            <Images mainImage={currentProduct.cardImage} imageCollection={currentProduct.images.items} />

            <div id="productDetails" className="flex-grow">
                <div className="card rounded-md shadow-lg p-2 md:p-4 lg:p-8">
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
                                            className="input input-lg input-bordered text-center"
                                        />
                                    )}
                                    <button
                                        aria-label="add to cart"
                                        className={`btn btn-lg rounded-md${btnDisabled}${btnLoading}`}
                                        disabled={hasExceededStock}
                                    >
                                        {loading ? '' : 'Add to cart'}
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

export default Product;
