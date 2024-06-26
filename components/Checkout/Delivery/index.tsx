import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { BsCreditCard2BackFill } from 'react-icons/bs';

import selector from './selector';
import {
    fetchShippingMethods,
    setChosenShippingMethodId,
    setCurrentStep,
    setIsCheckoutLoading,
} from '../../../store/slices/checkout';
import { setCheckoutLoading } from '../../../store/slices/global';
import Loading from '../../Loading';
import ShippingMethod from './ShippingMethod';
import { fetchCartTotals, setUpdatingCart } from '../../../store/slices/cart';

export const Delivery: React.FC = () => {
    const dispatch = useDispatch();
    const { currentStep, isCheckoutLoading, hasBothAddresses, shippingMethods } = useSelector(selector);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const isCurrentStep = currentStep === 1;
    const hasErrors = Object.keys(errors).length > 0;
    const [shouldFetchDeliveryMethods, setShouldFetchDeliveryMethods] = useState(true);

    const handleSelectShippingMethod: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        if (hasErrors || isCheckoutLoading) {
            return;
        }

        // Start checkout and cart loaders.
        dispatch(setIsCheckoutLoading(true));
        dispatch(setUpdatingCart(true));

        // Set shipping method and update cart totals
        dispatch(setChosenShippingMethodId(data.method));
        dispatch(fetchCartTotals());

        // Redirect to next stage.
        dispatch(setCurrentStep(2));
    };

    // Handle edit for opening / closing the collapse element
    const handleEdit = () => {
        if (!isCurrentStep && hasBothAddresses) {
            dispatch(setCurrentStep(1));
        }
    };

    useEffect(() => {
        // Ensure to only get delivery methods once or it will infinitely load.
        if (!shouldFetchDeliveryMethods) return;

        // Set loading
        dispatch(setCheckoutLoading(true));

        // Fetch the shipping methods and the fetch will remove loading spinner on return.
        dispatch(fetchShippingMethods());

        setShouldFetchDeliveryMethods(false);
    }, [shippingMethods, dispatch, shouldFetchDeliveryMethods]);

    return (
        <div
            className={`collapse${
                hasBothAddresses ? ' collapse-plus' : ' bg-gray-200 cursor-not-allowed'
            } card bordered mb-6 rounded-md collapse-${isCurrentStep ? 'open' : 'closed'}`}
        >
            <h3 className={`text-xl font-medium${hasBothAddresses ? ' collapse-title' : ' p-4'}`} onClick={handleEdit}>
                {hasBothAddresses ? 'Delivery - Edit' : 'Delivery'}
            </h3>
            <div className="collapse-content p-0 relative">
                <Loading show={isCheckoutLoading} />
                <form onSubmit={handleSubmit(handleSelectShippingMethod)}>
                    {shippingMethods.length > 0 && (
                        <div className="flex flex-col space-y-2 p-4">
                            {shippingMethods.map(({ _id, title, content, min, max, supplier, price }, index) => {
                                return (
                                    <ShippingMethod
                                        _id={_id}
                                        title={title}
                                        content={content}
                                        price={price}
                                        min={min}
                                        max={max}
                                        supplier={supplier}
                                        register={register}
                                        isDefault={index === 0}
                                        key={`shipping-method-${index}`}
                                    />
                                );
                            })}
                        </div>
                    )}
                    <div className="flex justify-end items-center px-4">
                        <button
                            type="submit"
                            className={`btn w-full lg:w-auto mb-4${
                                hasErrors ? ' btn-base-200 btn-disabled' : ' btn-secondary'
                            }${isCheckoutLoading ? ' loading' : ''}`}
                        >
                            {isCheckoutLoading ? '' : 'Payment'}
                            <BsCreditCard2BackFill className="w-6 h-6 ml-2 inline" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Delivery;
