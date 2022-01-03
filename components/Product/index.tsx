import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { split } from 'lodash';

import { setLineItem } from '../../utils/commerce';
import Loading from '../Loading';
import selector from './selector';
import { fetchItemCount } from '../../store/slices/cart';
import Images from './Images';
import Details from './Details';
import { fetchSingleProduct } from '../../store/slices/products';
import { addError } from '../../store/slices/alerts';

interface ProductProps {
    slug: string;
}

export const Product: React.FC<ProductProps> = ({ slug }) => {
    const dispatch = useDispatch();
    const { accessToken, items, orderId, currentProduct } = useSelector(selector);
    const [loading, setLoading] = useState(false);
    const [shouldFetch, setShouldFetch] = useState(true);
    const {
        handleSubmit,
        formState: { errors },
    } = useForm();
    const hasErrors = Object.keys(errors).length > 0;
    const stock = currentProduct.inventory.quantity;
    const currentLineItem = items && currentProduct ? items.find((c) => c.sku_code === currentProduct.sku_code) : null;
    const hasExceededStock = currentLineItem ? currentLineItem.quantity >= stock : false;
    const description = split(currentProduct.description, '\n\n');
    const shouldShowCompare = currentProduct.amount !== currentProduct.compare_amount;

    // Handle the form submission.
    const onSubmit = useCallback(async () => {
        if (hasErrors || !accessToken || !currentProduct || !orderId) return;
        setLoading(true);

        if (hasExceededStock) {
            dispatch(addError(`Maximum quantity of ${stock} is currently in your cart.`));
            return;
        }

        const attributes = {
            quantity: 1,
            sku_code: currentProduct.sku_code,
            name: currentProduct.name,
            image_url: currentProduct.images.items[0].url,
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
                    id: orderId,
                    type: 'orders',
                },
            },
        };

        const hasLineItemUpdated = await setLineItem(accessToken, attributes, relationships);

        if (hasLineItemUpdated) {
            dispatch(fetchItemCount({ accessToken, orderId }));
        } else {
            dispatch(addError('Failed to add product to cart.'));
        }

        setLoading(false);
    }, [hasErrors, accessToken, currentProduct, orderId, stock, hasExceededStock, dispatch]);

    useEffect(() => {
        if (accessToken && slug && shouldFetch) {
            setShouldFetch(false);
            dispatch(fetchSingleProduct({ accessToken, slug }));
        }
    }, [accessToken, slug, shouldFetch, dispatch]);

    return (
        <div className="p-2 lg:p-8 relative">
            <Loading show={loading} />
            <div className="container mx-auto">
                <div className="flex flex-col lg:flex-row lg:space-x-16">
                    <Images mainImage={currentProduct.images.items[0]} imageCollection={currentProduct.images.items} />

                    <div id="productDetails" className="flex-grow">
                        <div className="card rounded-md shadow-lg p-2 lg:p-6">
                            <Details
                                name={currentProduct.name}
                                amount={currentProduct.amount}
                                compareAmount={currentProduct.compare_amount}
                                isAvailable={currentProduct.inventory.available}
                                shouldShowCompare={shouldShowCompare}
                                quantity={stock}
                                tags={currentProduct.tags}
                                description={description}
                            />
                            <div className="quantity mb-4 flex flex-col justify-center">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="flex flex-col lg:flex-row justify-start align-center lg:space-x-2">
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
};

export default Product;
