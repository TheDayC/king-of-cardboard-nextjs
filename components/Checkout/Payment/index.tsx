import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeCardElement, Stripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

import { setCurrentStep } from '../../../store/slices/checkout';
import { createPaymentSource } from '../../../utils/commerce';
import { confirmOrder, refreshPayment, sendOrderConfirmation } from '../../../utils/payment';
import { CartItem, CustomerAddress, CustomerDetails } from '../../../store/types/state';
import { setCheckoutLoading } from '../../../store/slices/global';
import { setConfirmationData } from '../../../store/slices/confirmation';
import { Order } from '../../../types/cart';
import Achievements from '../../../services/achievments';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import { setShouldFetchRewards } from '../../../store/slices/account';
import { addAlert } from '../../../store/slices/alerts';
import { isArrayOfErrors } from '../../../utils/typeguards';
import { AlertLevel } from '../../../enums/system';
import selector from './selector';
import Method from './Method';

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
    const { register, handleSubmit } = useForm();
    const { data: session } = useSession();
    const isCurrentStep = currentStep === 2;

    const handleEdit = () => {
        if (!isCurrentStep) {
            dispatch(setCurrentStep(2));
        }
    };

    const handlePaymentMethod = useCallback(
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

            // Fetch the client secret from Commerce Layer to use with Stripe.
            const paymentSource = await createPaymentSource(accessToken, orderId, paymentSourceType);

            if (isArrayOfErrors(paymentSource)) {
                paymentSource.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
            } else {
                const { paymentId, clientSecret } = paymentSource;

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
                    } else {
                        // Place the order with commerce layer.
                        const hasBeenPlaced = await confirmOrder(accessToken, orderId, '_place');

                        if (isArrayOfErrors(hasBeenPlaced)) {
                            hasBeenPlaced.forEach((value) => {
                                dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                            });
                        } else {
                            if (hasBeenPlaced && paymentId) {
                                const hasBeenRefreshed = await refreshPayment(
                                    accessToken,
                                    paymentId,
                                    paymentSourceType
                                );
                                const hasBeenAuthorized = await confirmOrder(accessToken, orderId, '_authorize');

                                const hasBeenApproved = await confirmOrder(
                                    accessToken,
                                    orderId,
                                    '_approve_and_capture'
                                );
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
                                                dispatch(
                                                    addAlert({ message: value.description, level: AlertLevel.Error })
                                                );
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
                                        dispatch(
                                            addAlert({ message: 'Could not place your order.', type: AlertLevel.Error })
                                        );
                                    }
                                }
                            } else {
                                dispatch(addAlert({ message: 'Could not place your order.', type: AlertLevel.Error }));
                            }
                        }
                    }
                }
            }

            dispatch(setCheckoutLoading(false));
        },
        [dispatch, checkoutLoading]
    );

    const onSubmit = useCallback(
        (data: unknown) => {
            const methodId = safelyParse(data, 'paymentMethod', parseAsString, null);
            if (accessToken && orderId && methodId && stripe && elements) {
                // Get the card element with Strip hooks.
                const card = elements.getElement(CardElement);

                // Find the payment method chosen by the user.
                const paymentMethodData = paymentMethods.find((pM) => pM.id === methodId) || null;

                // If both exist then call the payment handler.
                if (card && paymentMethodData && order) {
                    handlePaymentMethod(
                        accessToken,
                        orderId,
                        stripe,
                        card,
                        paymentMethodData.payment_source_type,
                        order,
                        items,
                        customerDetails,
                        session,
                        billingAddress,
                        shippingAddress
                    );
                }
            }
        },
        [
            accessToken,
            orderId,
            paymentMethods,
            stripe,
            handlePaymentMethod,
            elements,
            order,
            items,
            customerDetails,
            session,
            billingAddress,
            shippingAddress,
        ]
    );

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
            <div className="collapse-content">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {paymentMethods &&
                        paymentMethods.map((method) => (
                            <Method
                                id={method.id}
                                name={method.name}
                                sourceType={method.payment_source_type}
                                defaultChecked={paymentMethods.length < 2 ? true : false}
                                register={register}
                                key={`card-entry-${method.name}`}
                            />
                        ))}
                    <div className="flex justify-end">
                        <button
                            className={`btn btn-primary${checkoutLoading ? ' loading btn-square' : ''}${
                                !stripe || checkoutLoading ? ' btn-disabled' : ''
                            }`}
                        >
                            {!checkoutLoading ? 'Place Order' : ''}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Payment;
