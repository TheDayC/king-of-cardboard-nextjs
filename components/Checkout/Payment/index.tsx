import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeCardElement, Stripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { BsPaypal } from 'react-icons/bs';
import { FaStripeS } from 'react-icons/fa';

import { setCurrentStep } from '../../../store/slices/checkout';
import { createPaymentSource } from '../../../utils/commerce';
import { confirmOrder, refreshPayment, sendOrderConfirmation } from '../../../utils/payment';
import { CartItem, CustomerAddress, CustomerDetails } from '../../../store/types/state';
import { setCheckoutLoading } from '../../../store/slices/global';
import { setConfirmationData } from '../../../store/slices/confirmation';
import { Order } from '../../../types/cart';
import Achievements from '../../../services/achievments';
import { setShouldFetchRewards } from '../../../store/slices/account';
import { addAlert } from '../../../store/slices/alerts';
import { isArrayOfErrors } from '../../../utils/typeguards';
import { AlertLevel } from '../../../enums/system';
import selector from './selector';
import SelectionWrapper from '../../SelectionWrapper';
import Source from './Source';
import { buildPaymentAttributes, paymentBtnText, updatePaymentMethod } from '../../../utils/checkout';

export const Payment: React.FC = () => {
    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const {
        currentStep,
        paymentMethods,
        accessToken,
        orderId,
        customerDetails,
        checkoutLoading,
        order,
        items,
        confirmationDetails,
        billingAddress,
        shippingAddress,
    } = useSelector(selector);
    const { handleSubmit } = useForm();
    const { data: session } = useSession();
    const isCurrentStep = currentStep === 2;
    const [paymentMethod, setPaymentMethod] = useState('stripe_payments');
    const btnText = paymentBtnText(paymentMethod);
    const paypalClass = 'inline-block mr-3 text-md -mt-0.5 text-blue-800';
    const stripeClass = 'inline-block mr-3 text-md -mt-0.5 text-indigo-400';

    const handleEdit = () => {
        if (!isCurrentStep) {
            dispatch(setCurrentStep(2));
        }
    };

    const handleStripePayment = useCallback(
        async (
            accessToken: string,
            orderId: string,
            stripe: Stripe,
            card: StripeCardElement,
            paymentSourceType: string,
            order: Order,
            items: CartItem[],
            customerDetails: CustomerDetails,
            currentSession: Session | null,
            billingAddress: CustomerAddress,
            shippingAddress: CustomerAddress
        ) => {
            if (!stripe || checkoutLoading) {
                return;
            }

            dispatch(setCheckoutLoading(true));

            const attributes = buildPaymentAttributes(paymentSourceType, orderId);

            // Fetch the client secret from Commerce Layer to use with Stripe.
            const paymentSource = await createPaymentSource(accessToken, orderId, paymentSourceType, attributes);

            if (isArrayOfErrors(paymentSource)) {
                paymentSource.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
            } else {
                const { paymentId, clientSecret } = paymentSource;

                // Handle Stripe payment specific actions.
                if (clientSecret) {
                    // Assuming we've got a secret then confirm the card payment with stripe.
                    const result = await stripe.confirmCardPayment(clientSecret, {
                        payment_method: {
                            card,
                            billing_details: {
                                name: `${billingAddress.first_name || ''} ${billingAddress.last_name || ''}`,
                                email: billingAddress.email || '',
                                phone: billingAddress.phone || '',
                                address: {
                                    city: billingAddress.city || '',
                                    country: billingAddress.country_code || 'GB',
                                    line1: billingAddress.line_1 || '',
                                    line2: billingAddress.line_2 || '',
                                    postal_code: billingAddress.zip_code || '',
                                    state: billingAddress.state_code || '',
                                },
                            },
                        },
                    });

                    // Stripe error
                    if (result.error) {
                        dispatch(addAlert({ message: result.error.message, level: AlertLevel.Error }));
                        return;
                    }
                }

                // Place the order with commerce layer.
                const hasBeenPlaced = await confirmOrder(accessToken, orderId, '_place');

                if (isArrayOfErrors(hasBeenPlaced)) {
                    hasBeenPlaced.forEach((value) => {
                        dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                    });
                } else {
                    if (hasBeenPlaced && paymentId) {
                        const hasBeenRefreshed = await refreshPayment(accessToken, paymentId, paymentSourceType);
                        const hasBeenAuthorized = await confirmOrder(accessToken, orderId, '_authorize');

                        const hasBeenApproved = await confirmOrder(accessToken, orderId, '_approve_and_capture');
                        const hasErrors =
                            isArrayOfErrors(hasBeenRefreshed) ||
                            isArrayOfErrors(hasBeenAuthorized) ||
                            isArrayOfErrors(hasBeenApproved);

                        if (isArrayOfErrors(hasBeenRefreshed)) {
                            hasBeenRefreshed.forEach((value) => {
                                dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                            });
                        }

                        if (isArrayOfErrors(hasBeenAuthorized)) {
                            hasBeenAuthorized.forEach((value) => {
                                dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                            });
                        }

                        if (isArrayOfErrors(hasBeenApproved)) {
                            hasBeenApproved.forEach((value) => {
                                dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                            });
                        }

                        if (!hasErrors) {
                            // Set the confirmation data in the store.
                            if (hasBeenRefreshed && hasBeenAuthorized && hasBeenApproved) {
                                // Set the confirmation data in the store.
                                dispatch(
                                    setConfirmationData({
                                        order,
                                        items,
                                        customerDetails,
                                        billingAddress,
                                        shippingAddress,
                                    })
                                );

                                // Distribute the confirmation email so the customer has a receipt.
                                const orderConfirmationRes = await sendOrderConfirmation(
                                    order,
                                    items,
                                    customerDetails,
                                    billingAddress,
                                    shippingAddress
                                );

                                if (isArrayOfErrors(orderConfirmationRes)) {
                                    orderConfirmationRes.forEach((value) => {
                                        dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                                    });
                                }

                                // Figure out achievement progress now that the order has been confirmed.
                                if (currentSession) {
                                    const achievements = new Achievements(currentSession, accessToken);
                                    items.forEach(async (item) => {
                                        const { categories, types } = item.metadata;
                                        const hasFetchedObjectives = await achievements.fetchObjectives(
                                            categories,
                                            types
                                        );

                                        if (isArrayOfErrors(hasFetchedObjectives)) {
                                            hasFetchedObjectives.forEach((value) => {
                                                dispatch(
                                                    addAlert({
                                                        message: value.description,
                                                        level: AlertLevel.Error,
                                                    })
                                                );
                                            });
                                        } else {
                                            if (hasFetchedObjectives && achievements.objectives) {
                                                achievements.objectives.forEach((objective) => {
                                                    const {
                                                        _id,
                                                        min,
                                                        max,
                                                        milestone,
                                                        reward,
                                                        milestoneMultiplier: multiplier,
                                                    } = objective;

                                                    // Increment the achievement based on the objective found.
                                                    achievements.incrementAchievement(
                                                        _id,
                                                        min,
                                                        max,
                                                        reward,
                                                        milestone,
                                                        multiplier
                                                    );
                                                });

                                                // Update achievements and points once all increments have been achieved.
                                                achievements.updateAchievements();

                                                // Dispatch coin update
                                                dispatch(setShouldFetchRewards(true));
                                            }
                                        }
                                    });
                                }
                            } else {
                                dispatch(addAlert({ message: 'Could not place your order.', type: AlertLevel.Error }));
                            }
                        }
                    } else {
                        dispatch(addAlert({ message: 'Could not place your order.', type: AlertLevel.Error }));
                    }
                }
            }

            dispatch(setCheckoutLoading(false));
        },
        [dispatch, checkoutLoading]
    );

    const handlePaypalPayment = useCallback(
        async (accessToken: string, orderId: string, paymentMethod: string, checkoutLoading: boolean) => {
            if (checkoutLoading) return;

            dispatch(setCheckoutLoading(true));

            const attributes = buildPaymentAttributes(paymentMethod, orderId);

            // Fetch the client secret from Commerce Layer to use with Stripe.
            const paymentSource = await createPaymentSource(accessToken, orderId, paymentMethod, attributes);

            if (isArrayOfErrors(paymentSource)) {
                paymentSource.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
            } else {
                const { approvalUrl } = paymentSource;

                if (approvalUrl) {
                    location.assign(approvalUrl);
                }
            }

            dispatch(setCheckoutLoading(false));
        },
        [dispatch]
    );

    const onSubmit = () => {
        if (accessToken && order && paymentMethod) {
            if (paymentMethod === 'stripe_payments' && stripe && elements) {
                // Get the card element with Stripe hooks.
                const card = elements.getElement(CardElement);

                // If both exist then call the payment handler.
                if (card) {
                    handleStripePayment(
                        accessToken,
                        order.id,
                        stripe,
                        card,
                        paymentMethod,
                        order,
                        items,
                        customerDetails,
                        session,
                        billingAddress,
                        shippingAddress
                    );
                }
            }

            // If we're processing a paypal order then ensure to sent the payment method id
            if (paymentMethod === 'paypal_payments') {
                handlePaypalPayment(accessToken, order.id, paymentMethod, checkoutLoading);
            }
        }
    };

    const handlePaymentMethodSelect = async (sourceType: string) => {
        // Find the payment method chosen by the user.
        const paymentMethodData = paymentMethods.find((pM) => pM.payment_source_type === sourceType) || null;

        // Don't act if we're missing vital data.
        if (!accessToken || !orderId || !paymentMethodData) return;

        // Set the payment method chosen in the local state.
        setPaymentMethod(sourceType);

        const hasPatchedMethod = await updatePaymentMethod(accessToken, orderId, paymentMethodData.id);

        if (isArrayOfErrors(hasPatchedMethod)) {
            hasPatchedMethod.forEach((value) => {
                dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
            });
        }
    };

    useEffect(() => {
        if (confirmationDetails.order && confirmationDetails.items.length > 0) {
            router.push('/confirmation');
        }
    }, [confirmationDetails, router]);

    return (
        <div
            className={`collapse collapse-plus card bordered rounded-md mb-6 lg:mb-0 collapse-${
                isCurrentStep ? 'open' : 'closed'
            }`}
        >
            <h3 className="collapse-title text-xl font-medium" onClick={handleEdit}>
                {!isCurrentStep ? 'Payment - Edit' : 'Payment'}
            </h3>
            <div className="collapse-content p-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {paymentMethods &&
                        paymentMethods.map((method) => {
                            const sourceType = method.payment_source_type;
                            const isPayPal = sourceType === 'paypal_payments';
                            const logo = isPayPal ? (
                                <BsPaypal className={paypalClass} />
                            ) : (
                                <FaStripeS className={stripeClass} />
                            );
                            const title = isPayPal ? 'PayPal' : 'Credit / Debit Card (Stripe)';

                            return (
                                <SelectionWrapper
                                    id={sourceType}
                                    title={title}
                                    name="paymentMethod"
                                    isChecked={paymentMethod === sourceType}
                                    defaultChecked={sourceType === 'stripe_payments'}
                                    titleLogo={logo}
                                    onSelect={handlePaymentMethodSelect}
                                    key={`payment-method-${method.id}`}
                                >
                                    {!isPayPal && <Source sourceType={sourceType} />}
                                </SelectionWrapper>
                            );
                        })}
                    <div className="flex justify-end">
                        <button
                            className={`btn btn-primary${checkoutLoading ? ' loading btn-square' : ''}${
                                !stripe || checkoutLoading ? ' btn-disabled' : ''
                            }`}
                        >
                            {!checkoutLoading ? btnText : ''}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Payment;
