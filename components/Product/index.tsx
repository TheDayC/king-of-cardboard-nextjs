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

interface ProductProps {
    slug: string;
}

export const Product: React.FC<ProductProps> = ({ slug }) => {
    const dispatch = useDispatch();
    const { accessToken, items, orderId, currentProduct } = useSelector(selector);
    const [loading, setLoading] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(true);
    const { handleSubmit } = useForm();
    const { inventory, sku_code, description: productDesc, name, images, types, categories } = currentProduct;
    const stock = inventory.quantity;
    const currentLineItem = items.length > 0 ? items.find((c) => c.sku_code === sku_code) : null;
    const hasExceededStock = currentLineItem ? currentLineItem.quantity >= stock : false;
    const description = split(productDesc, '\n\n');
    const btnDisabled = hasExceededStock ? ' btn-disabled' : ' btn-primary';
    const btnLoading = loading ? ' loading btn-square' : '';

    // Handle the form submission.
    const onSubmit = useCallback(async () => {
        if (!accessToken || !orderId || loading || hasExceededStock) return;
        setLoading(true);

        const attributes = {
            quantity: 1,
            sku_code: sku_code,
            name: name,
            image_url: images.items[0].url,
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
            dispatch(addError('Failed to add product to cart.'));
        }

        setLoading(false);
    }, [accessToken, orderId, dispatch, loading, hasExceededStock, sku_code, categories, images.items, name, types]);

    useEffect(() => {
        if (accessToken && slug && shouldFetch) {
            setShouldFetch(false);
            dispatch(fetchSingleProduct({ accessToken, slug }));
        }
    }, [accessToken, slug, shouldFetch, dispatch]);

    useEffect(() => {
        if (hasExceededStock) {
            dispatch(addError(`Maximum quantity of ${stock} is currently in your cart.`));
        }
    }, [hasExceededStock, stock, dispatch]);

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
