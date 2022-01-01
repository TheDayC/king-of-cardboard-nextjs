import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { AlertLevel } from '../../../enums/system';
import { addAlert } from '../../../store/slices/alerts';
import { completePayPalOrder } from '../../../utils/checkout';
import { isArrayOfErrors } from '../../../utils/typeguards';
import selector from './selector';
import { confirmOrder, sendOrderConfirmation } from '../../../utils/payment';
import { setConfirmationData } from '../../../store/slices/confirmation';
import { setCheckoutLoading } from '../../../store/slices/global';
import Addresses from './Addresses';

interface CompleteProps {
    paymentId: string | null;
    payerId: string;
    orderId: string;
}

const Complete: React.FC<CompleteProps> = ({ paymentId, payerId, orderId }) => {
    const { accessToken, checkoutLoading, order, items, customerDetails, billingAddress, shippingAddress } =
        useSelector(selector);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleComplete = async () => {
        if (accessToken && paymentId && order) {
            dispatch(setCheckoutLoading(true));
            const res = await completePayPalOrder(accessToken, paymentId, payerId);

            if (isArrayOfErrors(res)) {
                res.forEach((value) => {
                    dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                });
            } else {
                if (res) {
                    // Place the order with commerce layer.
                    const hasBeenPlaced = await confirmOrder(accessToken, orderId, '_place');

                    if (isArrayOfErrors(hasBeenPlaced)) {
                        hasBeenPlaced.forEach((value) => {
                            dispatch(addAlert({ message: value.description, level: AlertLevel.Error }));
                        });
                    } else {
                        if (hasBeenPlaced && paymentId) {
                            const hasBeenAuthorized = await confirmOrder(accessToken, orderId, '_authorize');

                            const hasBeenApproved = await confirmOrder(accessToken, orderId, '_approve_and_capture');
                            const hasErrors = isArrayOfErrors(hasBeenAuthorized) || isArrayOfErrors(hasBeenApproved);

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
                                if (hasBeenAuthorized && hasBeenApproved) {
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

                    router.push('/confirmation');
                } else {
                    dispatch(
                        addAlert({
                            message: 'Failed to confirm your paypal order, please try again.',
                            level: AlertLevel.Error,
                        })
                    );
                }
            }

            dispatch(setCheckoutLoading(false));
        }
    };

    return (
        <div className="flex flex-col w-full">
            <h1 className="text-2xl mb-4">Complete Order</h1>
            <p>Please review your details below and complete your order.</p>
            <div className="divider lightDivider"></div>
            <div className="flex-1 flex-col mb-4">
                <h4 className="text-lg font-bold">Email Address:</h4>
                <p>{customerDetails.email || ''}</p>
            </div>
            <Addresses />
            <div className="divider lightDivider"></div>
            <p>
                If the personal and item details are correct please click the complete order button below to finalise
                your payment.
            </p>
            <div className="flex justify-end p-4">
                <button
                    type="submit"
                    className={`btn btn-primary${checkoutLoading ? ' loading btn-square' : ''}`}
                    onClick={handleComplete}
                >
                    {checkoutLoading ? '' : 'Complete Order'}
                </button>
            </div>
        </div>
    );
};

export default Complete;
