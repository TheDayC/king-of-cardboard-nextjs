import React from 'react';
import { useSelector } from 'react-redux';

import selector from './selector';

interface CompleteProps {
    paymentId: string | null;
    payerId: string;
    orderId: string;
}

const Complete: React.FC<CompleteProps> = (
    {
        /*paymentId,  payerId, orderId  */
    }
) => {
    const {
        /* checkoutLoading,
        subTotal,
        shipping,
        total,
        items,
        customerDetails,
        billingAddress,
        shippingAddress, */
    } = useSelector(selector);
    /* const dispatch = useDispatch();
    const router = useRouter(); */

    return null;

    /* const handleComplete = async () => {
        if (paymentId) {
            dispatch(setCheckoutLoading(true)); */
    //const res = await completePayPalOrder(accessToken, paymentId, payerId);

    //if (res) {
    // Place the order with commerce layer.
    //const hasBeenPlaced = await confirmOrder(accessToken, orderId, '_place');

    //if (hasBeenPlaced && paymentId) {
    // const hasBeenAuthorized = await confirmOrder(accessToken, orderId, '_authorize');
    // const hasBeenApproved = await confirmOrder(accessToken, orderId, '_approve_and_capture');

    // Set the confirmation data in the store.
    //if (hasBeenAuthorized && hasBeenApproved) {
    // Set the confirmation data in the store.
    /* dispatch(
                            setConfirmationData({
                                subTotal,
                                shipping,
                                total,
                                //orderNumber,
                                items,
                                customerDetails,
                                billingAddress,
                                shippingAddress,
                            })
                        ); */
    /* } else {
                        dispatch(addError('Failed to confirm your order, please contact support.'));
                    } */
    /* } else {
                    dispatch(addError('Failed to confirm your order, please contact support.'));
                } */

    //router.push('/confirmation');
    /* } else {
                dispatch(addError('Failed to confirm your order, please contact support.'));
            } */

    /* dispatch(setCheckoutLoading(false));
        }
    }; */

    // Give the user a warning before leaving the page.
    //useWarnIfUnsavedChanges(!checkoutLoading, 'Are you sure you want leave without completing your order?');

    /* return (
        <div className="flex flex-col w-full">
            <h1 className="text-2xl mb-4">Complete Order</h1>
            <p>Please review your details below and complete your order.</p>
            <div className="flex justify-end mt-4 relative">
                <span className="flex h-6 w-6 absolute -top-2 -right-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-full w-full bg-secondary"></span>
                </span>
                <button
                    type="submit"
                    className={`btn w-full btn-lg btn-primary${checkoutLoading ? ' loading' : ''}`}
                    onClick={handleComplete}
                >
                    <MdAdsClick className="inline-block mr-2 w-6 h-6 text-white" />
                    {checkoutLoading ? '' : 'Complete Order'}
                </button>
            </div>
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
        </div>
    ); */
};

export default Complete;
