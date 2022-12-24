import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FieldValues, useForm } from 'react-hook-form';
import { toNumber } from 'lodash';

import selector from './selector';
import Images from './Images';
import Details from './Details';
import { Configuration, Interest, Category } from '../../enums/products';
import { ImageItem } from '../../types/contentful';
import { addItem, setUpdatingCart } from '../../store/slices/cart';
import { gaEvent } from '../../utils/ga';
import { addSuccess } from '../../store/slices/alerts';
import { getPrettyPrice } from '../../utils/account/products';

interface ImportProps {
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
}

export const Product: React.FC<ImportProps> = ({
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
        gaEvent('addProductToCart', { sku_code: sku });

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
        <div className="flex flex-col relative lg:flex-row lg:space-x-8">
            <Images mainImage={mainImage} imageCollection={gallery} />

            <div id="productDetails" className="flex flex-col w-full lg:w-3/4">
                <div className="card rounded-md lg:shadow-lg md:p-4 lg:p-8">
                    <Details
                        name={title}
                        price={getPrettyPrice(price)}
                        salePrice={getPrettyPrice(salePrice)}
                        isAvailable={isAvailable}
                        quantity={stock}
                        tags={tags}
                        description={description}
                        shouldShowCompare={shouldShowCompare}
                    />

                    {isAvailable && (
                        <div className="quantity mb-4 flex flex-col justify-center">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* options.length > 0 &&
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
                                    )) */}
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
    );
};

export default Product;
