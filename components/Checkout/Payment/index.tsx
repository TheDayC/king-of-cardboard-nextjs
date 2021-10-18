import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { StripeCardElement, Stripe } from '@stripe/stripe-js';
import { get } from 'lodash';

import selector from './selector';
import { setCurrentStep } from '../../../store/slices/checkout';
import Method from './Method';
import { createPaymentSource } from '../../../utils/commerce';
import { checkoutOrder, confirmOrder } from '../../../utils/payment';
import { CustomerDetails } from '../../../store/types/state';

export const Payment: React.FC = () => {
    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();
    const { currentStep, paymentMethods, accessToken, orderId, customerDetails } = useSelector(selector);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
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
            customerDetails: CustomerDetails
        ) => {
            // Fetch the client secret from Commerce Layer to use with Stripe.
            const clientSecret = await createPaymentSource(accessToken, orderId, paymentSourceType);

            if (clientSecret) {
                // Assuming we've got a secret then confirm the card payment with stripe.
                const result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card,
                        billing_details: {
                            name: `${customerDetails.firstName || ''} ${customerDetails.lastName || ''}`,
                            email: customerDetails.email || '',
                            phone: customerDetails.phone || '',
                            address: {
                                city: customerDetails.city || '',
                                country: 'GB',
                                line1: customerDetails.addressLineOne || '',
                                line2: customerDetails.addressLineTwo || '',
                                postal_code: customerDetails.postcode || '',
                                state: customerDetails.county || '',
                            },
                        },
                    },
                });

                if (result.error) {
                    // TODO: Show error to your customer (e.g., insufficient funds)
                    console.log(result.error.message);
                } else {
                    // Capture the order with stripe now that we know the payment source has been confirmed.
                    const paymentStatus = await checkoutOrder(result.paymentIntent.id);

                    // Place the order with commerce layer when the payment status is confirmed with stripe.
                    if (paymentStatus && paymentStatus === 'succeeded') {
                        const hasBeenConfirmed = confirmOrder(accessToken, orderId);
                        // TODO: Clear all order state after confirmation.
                    }
                }
            }
        },
        []
    );

    const onSubmit = useCallback(
        (data: any) => {
            const methodId = get(data, 'paymentMethod', null);
            if (accessToken && orderId && methodId && stripe && elements) {
                // Get the card element with Strip hooks.
                const card = elements.getElement(CardElement);

                // Find the payment method chosen by the user. THIS MIGHT NEED TO BE EARLIER.
                const paymentMethodData = paymentMethods.find((pM) => pM.id === methodId) || null;

                // If both exist then call the payment handler.
                if (card && paymentMethodData) {
                    handlePaymentMethod(
                        accessToken,
                        orderId,
                        stripe,
                        card,
                        paymentMethodData.payment_source_type,
                        customerDetails
                    );
                }
            }
        },
        [accessToken, orderId, paymentMethods, stripe, handlePaymentMethod, elements, customerDetails]
    );

    return (
        <div
            className={`collapse collapse-plus card bordered rounded-md collapse-${isCurrentStep ? 'open' : 'closed'}`}
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
                    <button className="btn btn-primary" disabled={!stripe}>
                        Place Order
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Payment;
