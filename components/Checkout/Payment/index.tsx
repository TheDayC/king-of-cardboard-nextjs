import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeCardElement, Stripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { BsPaypal, BsFillCreditCard2BackFill } from 'react-icons/bs';

import { setCurrentStep } from '../../../store/slices/checkout';
import { createPaymentSource } from '../../../utils/commerce';
import { confirmOrder, refreshPayment, sendOrderConfirmation } from '../../../utils/payment';
import { CartItem, CustomerAddress, CustomerDetails } from '../../../store/types/state';
import { setCheckoutLoading } from '../../../store/slices/global';
import { setConfirmationData } from '../../../store/slices/confirmation';
import { Order } from '../../../types/cart';
import Achievements from '../../../services/achievments';
import { setShouldFetchRewards } from '../../../store/slices/account';
import { addError } from '../../../store/slices/alerts';
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
    const stripeClass = 'inline-block mr-3 text-md -mt-0.5 text-gray-500';

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

            if (paymentSource) {
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
                        dispatch(addError(result.error.message));
                        return;
                    }
                }

                // Place the order with commerce layer.
                const hasBeenPlaced = await confirmOrder(accessToken, orderId, '_place');

                if (hasBeenPlaced && paymentId) {
                    const hasBeenRefreshed = await refreshPayment(accessToken, paymentId, paymentSourceType);
                    const hasBeenAuthorized = await confirmOrder(accessToken, orderId, '_authorize');
                    const hasBeenApproved = await confirmOrder(accessToken, orderId, '_approve_and_capture');

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
                        await sendOrderConfirmation(order, items, customerDetails, billingAddress, shippingAddress);

                        // Figure out achievement progress now that the order has been confirmed.
                        if (currentSession) {
                            const achievements = new Achievements(currentSession, accessToken);
                            items.forEach(async (item) => {
                                const { categories, types } = item.metadata;
                                const hasFetchedObjectives = await achievements.fetchObjectives(categories, types);

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
                                        achievements.incrementAchievement(_id, min, max, reward, milestone, multiplier);
                                    });

                                    // Update achievements and points once all increments have been achieved.
                                    achievements.updateAchievements();

                                    // Dispatch coin update
                                    dispatch(setShouldFetchRewards(true));
                                }
                            });
                        }
                    } else {
                        dispatch(addError('Failed to place your order, please contact support.'));
                    }
                } else {
                    dispatch(addError('Failed to place your order, please contact support.'));
                }
            }

            dispatch(setCheckoutLoading(false));
        },
        [dispatch, checkoutLoading]
    );

    // If the user has chosen paypal, handle it here.
    const handlePaypalPayment = useCallback(async () => {
        // If we're already loading make sure not to execute again.
        if (checkoutLoading || !accessToken || !order) return;

        // Set checkout to loading.
        dispatch(setCheckoutLoading(true));

        // Piece together the attributes for the payment source request.
        const attributes = buildPaymentAttributes(paymentMethod, order.id);

        // Fetch the client secret from Commerce Layer to use with Stripe.
        const paymentSource = await createPaymentSource(accessToken, order.id, paymentMethod, attributes);

        // If the payment source was created then capture the approval url from paypal.
        if (paymentSource) {
            const { approvalUrl } = paymentSource;

            if (approvalUrl) {
                location.assign(approvalUrl);
            }
        } else {
            // Dispatch an error if we for some reason can't handle this properly.
            dispatch(addError('Failed to create payment source for PayPal, please contact support.'));
        }

        dispatch(setCheckoutLoading(false));
    }, [dispatch, checkoutLoading, paymentMethod, order, accessToken]);

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
                handlePaypalPayment();
            }
        }
    };

    // Handle the paypal or stripe choice made by the user.
    const handlePaymentMethodSelect = async (sourceType: string) => {
        // Find the payment method chosen by the user.
        const paymentMethodData = paymentMethods.find((pM) => pM.payment_source_type === sourceType) || null;

        // Don't act if we're missing vital data.
        if (!accessToken || !orderId || !paymentMethodData) return;

        // Set the payment method chosen in the local state. We'll use this in the form submission.
        setPaymentMethod(sourceType);

        // Update the user's payment method choice on selection.
        await updatePaymentMethod(accessToken, orderId, paymentMethodData.id);
    };

    // When confirmation details exist then move the user to the confirmation stage.
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
                    <div className="pt-4">
                        {paymentMethods &&
                            paymentMethods.map((method) => {
                                const sourceType = method.payment_source_type;
                                const isPayPal = sourceType === 'paypal_payments';
                                const logo = isPayPal ? (
                                    <BsPaypal className={paypalClass} />
                                ) : (
                                    <BsFillCreditCard2BackFill className={stripeClass} />
                                );
                                const title = isPayPal ? 'PayPal' : 'Credit / Debit Card';

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
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Payment;
