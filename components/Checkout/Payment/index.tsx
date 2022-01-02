import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { BsPaypal, BsFillCreditCard2BackFill } from 'react-icons/bs';

import { setCurrentStep } from '../../../store/slices/checkout';
import { createPaymentSource } from '../../../utils/commerce';
import { confirmOrder, refreshPayment, sendOrderConfirmation } from '../../../utils/payment';
import { setCheckoutLoading } from '../../../store/slices/global';
import { setConfirmationData } from '../../../store/slices/confirmation';
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
        items,
        confirmationDetails,
        billingAddress,
        shippingAddress,
        hasBothAddresses,
        hasShipmentMethods,
    } = useSelector(selector);
    const { handleSubmit } = useForm();
    const { data: session } = useSession();
    const isCurrentStep = currentStep === 2;
    const [paymentMethod, setPaymentMethod] = useState('stripe_payments');
    const btnText = paymentBtnText(paymentMethod);
    const paypalClass = 'inline-block mr-3 text-md -mt-0.5 text-blue-800';
    const stripeClass = 'inline-block mr-3 text-md -mt-0.5 text-gray-500';
    const shouldEnable = hasBothAddresses && hasShipmentMethods;

    // Get the card element with Stripe hooks.
    const card = elements ? elements.getElement(CardElement) : null;

    const handleEdit = () => {
        if (!isCurrentStep) {
            dispatch(setCurrentStep(2));
        }
    };

    const handleError = useCallback(
        (message: string) => {
            dispatch(addError(message));
            dispatch(setCheckoutLoading(false));
        },
        [dispatch]
    );

    const handleAchievements = useCallback(async () => {
        // Figure out achievement progress now that the order has been confirmed.
        if (!session || items.length <= 0 || !accessToken) return;

        const achievements = new Achievements(session, accessToken);
        items.forEach(async (item) => {
            const { categories, types } = item.metadata;
            const hasFetchedObjectives = await achievements.fetchObjectives(categories, types);

            if (hasFetchedObjectives && achievements.objectives) {
                achievements.objectives.forEach((objective) => {
                    const { _id, min, max, milestone, reward, milestoneMultiplier: multiplier } = objective;

                    // Increment the achievement based on the objective found.
                    achievements.incrementAchievement(_id, min, max, reward, milestone, multiplier);
                });

                // Update achievements and points once all increments have been achieved.
                achievements.updateAchievements();

                // Dispatch coin update
                dispatch(setShouldFetchRewards(true));
            }
        });
    }, [dispatch, session, accessToken, items]);

    const handleStripePayment = useCallback(async () => {
        // Ensure we return to avoid multiple executions if criteria is met.
        if (
            checkoutLoading ||
            !accessToken ||
            !billingAddress ||
            !card ||
            !customerDetails ||
            items.length <= 0 ||
            !orderId ||
            !paymentMethod ||
            !shippingAddress ||
            !stripe
        ) {
            return;
        }

        // Show load blockers
        dispatch(setCheckoutLoading(true));

        // Piece together the attributes for the payment source request.
        const attributes = buildPaymentAttributes(paymentMethod, orderId);

        // Create the payment source in CommerceLayer.
        const { paymentId, clientSecret } = await createPaymentSource(accessToken, orderId, paymentMethod, attributes);

        if (!clientSecret || !paymentId) {
            handleError('Failed to validate the credit / debit card, please contact support.');
            return;
        }

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

        // Handle the stripe card confirmation error.
        if (result.error) {
            console.error(result.error.message);
            handleError('Failed to confirm card, please contact support');
            return;
        }

        // Place the order with commerce layer.
        const hasBeenPlaced = await confirmOrder(accessToken, orderId, '_place');

        if (!hasBeenPlaced) {
            handleError('Failed to confirm your order, please contact support.');
            return;
        }

        const hasBeenRefreshed = await refreshPayment(accessToken, paymentId, paymentMethod);
        const hasBeenAuthorized = await confirmOrder(accessToken, orderId, '_authorize');
        const hasBeenApproved = await confirmOrder(accessToken, orderId, '_approve_and_capture');

        // Ensure our order has been pushed through.
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

            // If the user is logged in we need to submit their achievements to the database.
            handleAchievements();
        } else {
            dispatch(addError('Failed to place your order, please contact support.'));
        }

        dispatch(setCheckoutLoading(false));
    }, [
        dispatch,
        checkoutLoading,
        accessToken,
        billingAddress,
        card,
        customerDetails,
        items,
        order,
        paymentMethod,
        shippingAddress,
        stripe,
        handleError,
        handleAchievements,
    ]);

    // If the user has chosen paypal, handle it here.
    const handlePaypalPayment = useCallback(async () => {
        // If we're already loading make sure not to execute again.
        if (checkoutLoading || !accessToken || !order) return;

        // Show load blockers.
        dispatch(setCheckoutLoading(true));

        // Piece together the attributes for the payment source request.
        const attributes = buildPaymentAttributes(paymentMethod, orderId);

        // Create the payment source in CommerceLayer.
        const { approvalUrl } = await createPaymentSource(accessToken, orderId, paymentMethod, attributes);

        // If the payment source was created then capture the approval url from paypal.
        if (approvalUrl) {
            location.assign(approvalUrl);
        } else {
            // Dispatch an error if we for some reason can't handle this properly.
            dispatch(addError('Failed to fetch approval url for PayPal, please contact support.'));
        }

        dispatch(setCheckoutLoading(false));
    }, [dispatch, checkoutLoading, paymentMethod, order, accessToken]);

    const onSubmit = () => {
        if (accessToken && order && paymentMethod) {
            // Handle a credit / debit card order.
            if (paymentMethod === 'stripe_payments') {
                handleStripePayment();
            }

            // Handle a paypal order.
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
            className={`collapse${
                shouldEnable ? ' collapse-plus' : ' bg-gray-200 cursor-not-allowed'
            } card bordered mb-6 rounded-md collapse-${isCurrentStep ? 'open' : 'closed'}`}
        >
            <h3 className={`text-xl font-medium${shouldEnable ? ' collapse-title' : ' p-4'}`} onClick={handleEdit}>
                {shouldEnable ? 'Payment - Edit' : 'Payment'}
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
