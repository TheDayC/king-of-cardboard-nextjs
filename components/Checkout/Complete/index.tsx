import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import { addError } from '../../../store/slices/alerts';
import { completePayPalOrder } from '../../../utils/checkout';
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
    const {
        accessToken,
        checkoutLoading,
        subTotal,
        shipping,
        total,
        orderNumber,
        items,
        customerDetails,
        billingAddress,
        shippingAddress,
    } = useSelector(selector);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleComplete = async () => {
        if (accessToken && paymentId) {
            dispatch(setCheckoutLoading(true));
            const res = await completePayPalOrder(accessToken, paymentId, payerId);

            if (res) {
                // Place the order with commerce layer.
                const hasBeenPlaced = await confirmOrder(accessToken, orderId, '_place');

                if (hasBeenPlaced && paymentId) {
                    const hasBeenAuthorized = await confirmOrder(accessToken, orderId, '_authorize');
                    const hasBeenApproved = await confirmOrder(accessToken, orderId, '_approve_and_capture');

                    // Set the confirmation data in the store.
                    if (hasBeenAuthorized && hasBeenApproved) {
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

                        // Distribute the confirmation email so the customer has a receipt.
                        await sendOrderConfirmation(
                            orderNumber,
                            subTotal,
                            shipping,
                            total,
                            items,
                            customerDetails,
                            billingAddress,
                            shippingAddress
                        );
                    } else {
                        dispatch(addError('Failed to confirm your order, please contact support.'));
                    }
                } else {
                    dispatch(addError('Failed to confirm your order, please contact support.'));
                }

                router.push('/confirmation');
            } else {
                dispatch(addError('Failed to confirm your order, please contact support.'));
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
