import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FieldValues, useForm } from 'react-hook-form';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { BsPaypal, BsFillCreditCard2BackFill } from 'react-icons/bs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toNumber } from 'lodash';
import axios from 'axios';
import { BiExit } from 'react-icons/bi';
import { CreateOrderActions, CreateOrderData, OnApproveActions, OnApproveData } from '@paypal/paypal-js';

import { setCurrentStep, setIsCheckoutLoading } from '../../../store/slices/checkout';
import { addError } from '../../../store/slices/alerts';
import selector from './selector';
import SelectionWrapper from '../../SelectionWrapper';
import Source from './Source';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import UseCoins from '../../UseCoins';
import { gaEvent } from '../../../utils/ga';
import { PaymentMethods } from '../../../enums/checkout';
import { addOrder } from '../../../utils/account/order';
import { Status, Payment as PaymentStatus, Fulfillment } from '../../../enums/orders';
import { setConfirmationData } from '../../../store/slices/confirmation';
import { getPrettyPrice } from '../../../utils/account/products';
import { resetCart } from '../../../store/slices/cart';

const URL = process.env.NEXT_PUBLIC_SITE_URL || '';
const paymentMethods = [
    { id: PaymentMethods.Stripe, title: 'Credit / Debit Card' },
    { id: PaymentMethods.PayPal, title: 'PayPal' },
];
const CURRENCY_CODE = 'GBP';

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
    const paypalClass = 'inline-block mr-3 text-md -mt-0.5 text-blue-800';
    const stripeClass = 'inline-block mr-3 text-md -mt-0.5 text-gray-500';
    const status = safelyParse(session, 'status', parseAsString, 'unauthenticated');
    const userId = safelyParse(session, 'user.id', parseAsString, null);
    const shouldShowCoins = status === 'authenticated' && coins > 0;

    const handleEdit = () => {
        if (!isCurrentStep) {
            dispatch(setCurrentStep(2));
        }
    };

    const handleError = (message: string) => {
        dispatch(addError(message));
        dispatch(setIsCheckoutLoading(false));
    };

    const confirmOrder = async (paymentId: string, paymentMethod: PaymentMethods) => {
        // Place the order.
        const {
            _id: orderId,
            orderNumber,
            subTotal: orderSubTotal,
            discount: orderDiscount,
            shipping: orderShipping,
            total: orderTotal,
        } = await addOrder({
            userId,
            email: customerDetails.email,
            orderStatus: Status.Placed,
            paymentStatus: PaymentStatus.Paid,
            fulfillmentStatus: Fulfillment.Unfulfilled,
            items,
            subTotal,
            discount,
            shipping,
            total,
            customerDetails,
            shippingAddress,
            billingAddress,
            paymentId,
            paymentMethod,
            coins,
        });

        // If no order id is returned then we couldn't place the order.
        if (!orderId) {
            // Remove spinner.
            dispatch(setIsCheckoutLoading(false));

            // Show the user some feedback.
            handleError('Failed to place your order, please contact support.');
            return;
        }

        // Set the confirmation data in the store.
        dispatch(
            setConfirmationData({
                subTotal: getPrettyPrice(orderSubTotal),
                shipping: getPrettyPrice(orderShipping),
                discount: getPrettyPrice(orderDiscount),
                total: getPrettyPrice(orderTotal),
                orderNumber,
                items,
                customerDetails,
                billingAddress,
                shippingAddress,
            })
        );

        // Reset the cart and checkout for re-use
        dispatch(resetCart());

        // Set loading spinner to false.
        dispatch(setIsCheckoutLoading(false));

        // Push the user to the confirmation page.
        router.push('/confirmation');
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

        // Confirm the order.
        await confirmOrder(paymentIntent.id, PaymentMethods.Stripe);
    };

    const handlePayPalCreateOrder = async (data: CreateOrderData, actions: CreateOrderActions) => {
        return await actions.order.create({
            purchase_units: [
                {
                    amount: {
                        currency_code: CURRENCY_CODE,
                        value: `${(total / 100).toFixed(2)}`,
                        breakdown: {
                            item_total: {
                                value: `${(subTotal / 100).toFixed(2)}`,
                                currency_code: CURRENCY_CODE,
                            },
                            discount: {
                                value: `${(discount / 100).toFixed(2)}`,
                                currency_code: CURRENCY_CODE,
                            },
                            shipping: {
                                value: `${(shipping / 100).toFixed(2)}`,
                                currency_code: CURRENCY_CODE,
                            },
                        },
                    },
                    items: items.map((item) => ({
                        name: item.title,
                        unit_amount: {
                            currency_code: 'GBP',
                            value: `${(item.price / 100).toFixed(2)}`,
                        },
                        quantity: `${item.quantity}`,
                        sku: item.sku,
                    })),
                },
            ],
        });
    };

    const handlePayPalOnApprove = async (data: OnApproveData, actions: OnApproveActions) => {
        if (!actions.order) return;

        dispatch(setIsCheckoutLoading(true));

        // Capture the order in PayPal.
        const paypalOrderResponseBody = await actions.order.capture();

        // Confirm the order in DB.
        await confirmOrder(paypalOrderResponseBody.id, PaymentMethods.PayPal);
    };

    // Handle the paypal or stripe choice made by the user.
    const handlePaymentMethodSelect = async (method: number) => {
        setPaymentMethod(method);
    };

    const onSubmit = async (data: FieldValues) => {
        const chosenPaymentMethod = toNumber(data.paymentMethod);

        setPaymentMethod(chosenPaymentMethod);
        gaEvent('checkout', { paymentMethod: chosenPaymentMethod });

        // Form now only submits stripe payments
        handleStripePayment();
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
                                        <Source
                                            paymentMethod={id}
                                            isCurrentlyDisplayed={isSelected}
                                            handleCreateOrder={handlePayPalCreateOrder}
                                            handleOnApprove={handlePayPalOnApprove}
                                        />
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
                            {paymentMethod === PaymentMethods.Stripe && (
                                <button
                                    className={`btn btn-primary w-full lg:w-auto${isCheckoutLoading ? ' loading' : ''}${
                                        !stripe || isCheckoutLoading ? ' btn-disabled' : ''
                                    }`}
                                    role="button"
                                >
                                    {!isCheckoutLoading && (
                                        <React.Fragment>
                                            Checkout
                                            <BiExit className="inline-block w-6 h-6 ml-2" />
                                        </React.Fragment>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Payment;
