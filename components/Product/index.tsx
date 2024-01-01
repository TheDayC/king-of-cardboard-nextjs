import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FieldValues, useForm } from 'react-hook-form';
import { toNumber } from 'lodash';

import selector from './selector';
import Images from './Images';
import Details from './Details';
import { Configuration, Interest, Category, StockStatus } from '../../enums/products';
import { ImageItem } from '../../types/contentful';
import { addItem, setUpdatingCart } from '../../store/slices/cart';
import { addSuccess } from '../../store/slices/alerts';
import { getPrettyPrice } from '../../utils/account/products';
import CrossSales from '../CrossSales';

interface ProductProps {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    sku: string;
    mainImage: ImageItem;
    gallery: ImageItem[];
    price: number;
    salePrice: number;
    isAvailable: boolean;
    stock: number;
    tags: string[];
    interest: Interest;
    category: Category;
    configuration: Configuration;
    shouldShowCompare: boolean;
    releaseDate: string | null;
    stockStatus: StockStatus;
}

export const Product: React.FC<ProductProps> = ({
    id,
    title,
    slug,
    description,
    sku,
    mainImage,
    gallery,
    price,
    salePrice,
    isAvailable,
    stock,
    tags,
    interest,
    category,
    configuration,
    shouldShowCompare,
    releaseDate,
    stockStatus,
}) => {
    const dispatch = useDispatch();
    const { items, isUpdatingCart } = useSelector(selector);
    const { handleSubmit, register } = useForm();
    const item = items.find((c) => c.sku === sku);
    const qtyInCart = item ? item.quantity : 0;
    const hasExceededStock = qtyInCart >= stock;
    const btnDisabled = hasExceededStock ? ' btn-disabled' : ' btn-primary';
    const btnLoading = isUpdatingCart ? ' loading' : '';

    // Handle the form submission.
    const addItemsToCart = async (chosenQty: number) => {
        if (isUpdatingCart || hasExceededStock || chosenQty > stock) return;

        const attributes = {
            _id: id,
            sku,
            title,
            slug,
            mainImage,
            category,
            interest,
            configuration,
            quantity: chosenQty,
            cartQty: chosenQty,
            stock,
            price,
            salePrice,
        };

        // Add item to the cart.
        dispatch(addItem(attributes));

        // Capture event.
        //gaEvent('addProductToCart', { sku_code: sku });

        // Inform user.
        dispatch(addSuccess(`${title} added to cart.`));
    };

    // Handle the form submission.
    const onSubmit = async (data: FieldValues) => {
        // Show loading spinner.
        dispatch(setUpdatingCart(true));

        // Add the chosen items to the cart.
        addItemsToCart(toNumber(data.quantity));

        // Remove loading spinner.
        dispatch(setUpdatingCart(false));
    };

    return (
        <div className="flex flex-col relative gap-y-4">
            <div className="flex flex-col relative lg:flex-row lg:space-x-8">
                <Images mainImage={mainImage} imageCollection={gallery} />

                <div id="productDetails" className="flex flex-col w-full lg:w-3/4">
                    <div className="card rounded-md lg:shadow-lg md:p-4 lg:p-8 space-y-4">
                        <Details
                            name={title}
                            price={getPrettyPrice(price)}
                            salePrice={getPrettyPrice(salePrice)}
                            isAvailable={isAvailable}
                            quantity={stock}
                            tags={tags}
                            description={description}
                            shouldShowCompare={shouldShowCompare}
                            releaseDate={releaseDate}
                            stockStatus={stockStatus}
                        />

                        {isAvailable && (
                            <div className="quantity mb-4 flex flex-col justify-center">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <h4 className="text-2xl mt-2 mb-2 font-semibold">Amount</h4>
                                    <div className="flex flex-col lg:flex-row justify-start align-center lg:space-x-2">
                                        {!hasExceededStock && (
                                            <input
                                                type="number"
                                                defaultValue="1"
                                                {...register('quantity', {
                                                    required: { value: true, message: 'Required' },
                                                })}
                                                className="input input-lg input-bordered text-center w-32 px-0 w-full mb-4 lg:w-auto lg:mb-0"
                                                min={1}
                                                max={stock - qtyInCart}
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
            <CrossSales id={id} category={category} interest={interest} configuration={configuration} />
        </div>
    );
};

export default Product;
