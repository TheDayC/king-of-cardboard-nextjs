import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FieldValues, useForm } from 'react-hook-form';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { BsPaypal, BsFillCreditCard2BackFill } from 'react-icons/bs';
import { useSession } from 'next-auth/react';

import { setCurrentStep, setIsCheckoutLoading } from '../../../store/slices/checkout';
import { addError } from '../../../store/slices/alerts';
import selector from './selector';
import SelectionWrapper from '../../SelectionWrapper';
import Source from './Source';
import { paymentBtnText } from '../../../utils/checkout';
import { parseAsNumber, parseAsString, safelyParse } from '../../../utils/parsers';
import UseCoins from '../../UseCoins';
import { gaEvent } from '../../../utils/ga';
import { PaymentMethods } from '../../../enums/checkout';
import { toNumber } from 'lodash';
import { isNumber } from '../../../utils/typeguards';
import axios from 'axios';
import { addOrder } from '../../../utils/order';
import { Status, Payment as PaymentStatus, Fulfillment } from '../../../enums/orders';
import { setConfirmationData } from '../../../store/slices/confirmation';
import { getPrettyPrice } from '../../../utils/account/products';
import { useRouter } from 'next/router';

const URL = process.env.NEXT_PUBLIC_SITE_URL || '';
const paymentMethods = [
    { id: PaymentMethods.Stripe, title: 'Credit / Debit Card' },
    { id: PaymentMethods.PayPal, title: 'PayPal' },
];

export const Payment: React.FC = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();
    const {
        currentStep,
        customerDetails,
        isCheckoutLoading,
        subTotal,
        shipping,
        discount,
        total,
        items,
        billingAddress,
        shippingAddress,
        coins,
        shouldEnable,
    } = useSelector(selector);
    const { handleSubmit, register } = useForm();
    const { data: session } = useSession();
    const isCurrentStep = currentStep === 2;
    const [paymentMethod, setPaymentMethod] = useState(PaymentMethods.Stripe);
    const btnText = paymentBtnText(paymentMethod);
    const paypalClass = 'inline-block mr-3 text-md -mt-0.5 text-blue-800';
    const stripeClass = 'inline-block mr-3 text-md -mt-0.5 text-gray-500';
    const status = safelyParse(session, 'status', parseAsString, 'unauthenticated');
    const shouldShowCoins = status === 'authenticated' && coins > 0;

    const handleEdit = () => {
        if (!isCurrentStep) {
            dispatch(setCurrentStep(2));
        }
    };

    const handleError = useCallback(
        (message: string) => {
            dispatch(addError(message));
            dispatch(setIsCheckoutLoading(false));
        },
        [dispatch]
    );

    const placeOrder = async (id: string, method: PaymentMethods) => {
        return await addOrder({
            email: customerDetails.email,
            orderStatus: Status.Placed,
            paymentStatus: PaymentStatus.Paid,
            fulfillmentStatus: Fulfillment.Unfulfilled,
            items,
            subTotal,
            discount,
            shipping,
            total,
            shippingAddress,
            billingAddress,
            paymentId: id,
            paymentMethod: method,
        });
    };

    const handleStripePayment = async () => {
        // Ensure we return to avoid multiple executions if criteria is met.
        if (!billingAddress.lineOne || !elements || !customerDetails || !items || !shippingAddress.lineOne || !stripe) {
            handleError('Missing some details');
            return;
        }
        // Show load blockers.
        dispatch(setIsCheckoutLoading(true));

        // Fetch the payment intent.
        const res = await axios.get(`${URL}/api/payments/getPaymentIntent`, { params: { total } });
        const clientSecret = safelyParse(res, 'data.client_secret', parseAsString, null);

        if (!clientSecret) {
            handleError('Failed to connect to Stripe, please contact support.');
            dispatch(setIsCheckoutLoading(false));
            return;
        }

        // Get the card element with Stripe hooks.
        const card = elements.getElement(CardElement);

        if (!card) {
            handleError('Failed to validate the credit / debit card, please check your details.');
            dispatch(setIsCheckoutLoading(false));
            return;
        }

        // Assuming we've got a secret then confirm the card payment with stripe.
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card,
                billing_details: {
                    name: `${customerDetails.firstName} ${customerDetails.lastName}`,
                    email: customerDetails.email,
                    phone: customerDetails.phone,
                    address: {
                        line1: billingAddress.lineOne,
                        line2: billingAddress.lineTwo,
                        city: billingAddress.city,
                        postal_code: billingAddress.postcode,
                        state: billingAddress.county,
                        country: billingAddress.country || 'GB',
                    },
                },
            },
        });

        // Handle the stripe card confirmation error.
        if (error || !paymentIntent) {
            handleError('Failed to confirm card payment, please contact support');
            return;
        }

        // Place the order.
        const { _id: orderId, orderNumber } = await placeOrder(paymentIntent.id, PaymentMethods.Stripe);

        if (!orderId) {
            handleError('Failed to place your order, please contact support.');
            return;
        }

        // Set the confirmation data in the store.
        dispatch(
            setConfirmationData({
                subTotal: getPrettyPrice(subTotal),
                shipping: getPrettyPrice(shipping),
                discount: getPrettyPrice(discount),
                total: getPrettyPrice(total),
                orderNumber,
                items,
                customerDetails,
                billingAddress,
                shippingAddress,
            })
        );

        router.push('/confirmation');

        dispatch(setIsCheckoutLoading(false));
    };

    // If the user has chosen paypal, handle it here.
    const handlePaypalPayment = useCallback(async () => {
        // If we're already loading make sure not to execute again.
        if (isCheckoutLoading) return;

        // Piece together the attributes for the payment source request.
        //const attributes = buildPaymentAttributes(PAYPAL_METHOD, orderId);

        // Create the payment source in CommerceLayer.
        //const { approvalUrl } = await createPaymentSource(accessToken, orderId, PAYPAL_METHOD, attributes);

        // If the payment source was created then capture the approval url from paypal.
        /* if (approvalUrl) {
            dispatch(setIsCheckoutLoading(false));
            location.assign(approvalUrl);
        } else {
            // Dispatch an error if we for some reason can't handle this properly.
            dispatch(addError('Failed to fetch approval url for PayPal, please contact support.'));
        } */

        //dispatch(setIsCheckoutLoading(false));
    }, [dispatch, isCheckoutLoading]);

    const onSubmit = async (data: FieldValues) => {
        const chosenPaymentMethod = toNumber(data.paymentMethod);

        setPaymentMethod(chosenPaymentMethod);
        gaEvent('checkout', { paymentMethod: chosenPaymentMethod });

        // Handle a credit / debit card order.
        if (chosenPaymentMethod === PaymentMethods.Stripe) {
            handleStripePayment();
        }

        // Handle a paypal order.
        if (chosenPaymentMethod === PaymentMethods.Stripe) {
            handlePaypalPayment();
        }
    };

    // Handle the paypal or stripe choice made by the user.
    const handlePaymentMethodSelect = async (method: number) => {
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
                            paymentMethods.map(({ id, title }) => {
                                const isPayPal = id === PaymentMethods.PayPal;
                                const logo = isPayPal ? (
                                    <BsPaypal className={paypalClass} />
                                ) : (
                                    <BsFillCreditCard2BackFill className={stripeClass} />
                                );
                                const isDefault = id === PaymentMethods.Stripe;
                                const isSelected = paymentMethod === id;

                                return (
                                    <SelectionWrapper
                                        id={id}
                                        title={title}
                                        name="paymentMethod"
                                        isChecked={isSelected}
                                        defaultChecked={isDefault}
                                        titleLogo={logo}
                                        onSelect={handlePaymentMethodSelect}
                                        register={register}
                                        key={`payment-method-${id}`}
                                    >
                                        <Source paymentMethod={id} isCurrentlyDisplayed={isSelected} />
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
                                className={`btn btn-primary w-full lg:w-auto${isCheckoutLoading ? ' loading' : ''}${
                                    !stripe || isCheckoutLoading ? ' btn-disabled' : ''
                                }`}
                                role="button"
                            >
                                {!isCheckoutLoading ? btnText : ''}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Payment;
