import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';
import { BsPaypal, BsFillCreditCard2BackFill } from 'react-icons/bs';
import { useSession } from 'next-auth/react';

import { setCurrentStep } from '../../../store/slices/checkout';
import { createPaymentSource } from '../../../utils/commerce';
import { confirmOrder, refreshPayment } from '../../../utils/payment';
import { setCheckoutLoading } from '../../../store/slices/global';
import { setConfirmationData } from '../../../store/slices/confirmation';
import { fetchGiftCard } from '../../../store/slices/account';
import { addError } from '../../../store/slices/alerts';
import selector from './selector';
import SelectionWrapper from '../../SelectionWrapper';
import Source from './Source';
import { buildPaymentAttributes, paymentBtnText, updatePaymentMethod } from '../../../utils/checkout';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import UseCoins from '../../UseCoins';
import { gaEvent } from '../../../utils/ga';

const STRIPE_METHOD = 'stripe_payments';
const PAYPAL_METHOD = 'paypal_payments';

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
        subTotal,
        shipping,
        total,
        orderNumber,
        items,
        billingAddress,
        shippingAddress,
        balance,
    } = useSelector(selector);
    const { handleSubmit, register } = useForm();
    const { data: session } = useSession();
    const isCurrentStep = currentStep === 2;
    const [paymentMethod, setPaymentMethod] = useState(STRIPE_METHOD);
    const btnText = paymentBtnText(paymentMethod);
    const paypalClass = 'inline-block mr-3 text-md -mt-0.5 text-blue-800';
    const stripeClass = 'inline-block mr-3 text-md -mt-0.5 text-gray-500';
    const shouldEnable = paymentMethods.length > 0;
    const status = safelyParse(session, 'status', parseAsString, 'unauthenticated');
    const shouldShowCoins = status === 'authenticated' && balance > 0;

    const handleEdit = () => {
        if (!isCurrentStep && shouldEnable) {
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

    const handleStripePayment = async () => {
        // Ensure we return to avoid multiple executions if criteria is met.
        if (
            checkoutLoading ||
            !accessToken ||
            !billingAddress.line_1 ||
            !elements ||
            !customerDetails ||
            !items ||
            !orderId ||
            !shippingAddress.line_1 ||
            !stripe
        ) {
            handleError('Missing some details');
            return;
        }

        // Show load blockers.
        dispatch(setCheckoutLoading(true));

        // Piece together the attributes for the payment source request.
        const attributes = buildPaymentAttributes(STRIPE_METHOD, orderId);

        // Create the payment source in CommerceLayer.
        const { paymentId, clientSecret } = await createPaymentSource(accessToken, orderId, STRIPE_METHOD, attributes);

        // Get the card element with Stripe hooks.
        const card = elements.getElement(CardElement);

        if (!clientSecret || !paymentId || !card) {
            handleError('Failed to validate the credit / debit card, please check your details.');
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

        const hasBeenRefreshed = await refreshPayment(accessToken, paymentId, STRIPE_METHOD);
        const hasBeenAuthorized = await confirmOrder(accessToken, orderId, '_authorize');
        const hasBeenApproved = await confirmOrder(accessToken, orderId, '_approve_and_capture');

        // Ensure our order has been pushed through.
        if (hasBeenRefreshed && hasBeenAuthorized && hasBeenApproved) {
            // Set the confirmation data in the store.
            dispatch(
                setConfirmationData({
                    subTotal,
                    shipping,
                    total,
                    orderNumber,
                    items,
                    customerDetails,
                    billingAddress,
                    shippingAddress,
                })
            );

            router.push('/confirmation');
        } else {
            dispatch(addError('Failed to place your order, please contact support.'));
        }

        dispatch(setCheckoutLoading(false));
    };

    // If the user has chosen paypal, handle it here.
    const handlePaypalPayment = useCallback(async () => {
        // If we're already loading make sure not to execute again.
        if (checkoutLoading || !accessToken || !orderId) return;

        // Piece together the attributes for the payment source request.
        const attributes = buildPaymentAttributes(PAYPAL_METHOD, orderId);

        // Create the payment source in CommerceLayer.
        const { approvalUrl } = await createPaymentSource(accessToken, orderId, PAYPAL_METHOD, attributes);

        // If the payment source was created then capture the approval url from paypal.
        if (approvalUrl) {
            dispatch(setCheckoutLoading(false));
            location.assign(approvalUrl);
        } else {
            // Dispatch an error if we for some reason can't handle this properly.
            dispatch(addError('Failed to fetch approval url for PayPal, please contact support.'));
        }

        dispatch(setCheckoutLoading(false));
    }, [dispatch, checkoutLoading, orderId, accessToken]);

    const onSubmit = async (data: unknown) => {
        const formPaymentMethod = safelyParse(data, 'paymentMethod', parseAsString, null);

        // Find the payment method chosen by the user.
        const paymentMethodData = paymentMethods.find((pM) => pM.payment_source_type === formPaymentMethod) || null;

        if (!accessToken || !orderId || !paymentMethodData || !formPaymentMethod) return;

        setPaymentMethod(formPaymentMethod);

        // Update the user's payment method choice on selection.
        await updatePaymentMethod(accessToken, orderId, paymentMethodData.id);

        gaEvent('checkout', { paymentMethod: formPaymentMethod });

        // Handle a credit / debit card order.
        if (formPaymentMethod === STRIPE_METHOD) {
            handleStripePayment();
        }

        // Handle a paypal order.
        if (formPaymentMethod === PAYPAL_METHOD) {
            handlePaypalPayment();
        }
    };

    // Handle the paypal or stripe choice made by the user.
    const handlePaymentMethodSelect = async (method: string) => {
        setPaymentMethod(method);
    };

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
                                        isChecked={sourceType === STRIPE_METHOD}
                                        defaultChecked={sourceType === 'stripe_payments'}
                                        titleLogo={logo}
                                        onSelect={handlePaymentMethodSelect}
                                        register={register}
                                        key={`payment-method-${method.id}`}
                                    >
                                        <Source sourceType={sourceType} />
                                    </SelectionWrapper>
                                );
                            })}
                        {shouldShowCoins && (
                            <React.Fragment>
                                <div className="divider lightDivider my-2 lg:my-4"></div>
                                <UseCoins />
                                <div className="divider lightDivider my-2 lg:my-4"></div>
                            </React.Fragment>
                        )}
                        <div className="flex justify-end">
                            <button
                                className={`btn btn-primary w-full lg:w-auto${checkoutLoading ? ' loading' : ''}${
                                    !stripe || checkoutLoading ? ' btn-disabled' : ''
                                }`}
                                role="button"
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
