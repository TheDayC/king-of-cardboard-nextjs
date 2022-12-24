import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import selector from './selector';
import { setCurrentStep } from '../../../store/slices/checkout';
import Shipment from './Shipment';
import { setCheckoutLoading } from '../../../store/slices/global';
import Loading from '../../Loading';

export const Delivery: React.FC = () => {
    const dispatch = useDispatch();
    const { currentStep, checkoutLoading, hasBothAddresses, shipments } = useSelector(selector);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const isCurrentStep = currentStep === 1;
    const hasErrors = Object.keys(errors).length > 0;
    const hasShipments = shipments.length > 0;

    const handleSelectShippingMethod: SubmitHandler<FieldValues> = async (/* data: FieldValues */) => {
        if (hasErrors || checkoutLoading || !shipments) {
            return;
        }

        // Start checkout loader.
        dispatch(setCheckoutLoading(true));

        // for...of used here over forEach to avoid race conditions with await.
        /* for (const shipment of shipments) {
            await updateShipmentMethod(accessToken, shipment.id, data.method[shipment.id].methodId);
        } */

        // Fetch items, totals and item count along with payment methods
        //dispatch(fetchCartTotals({ accessToken, orderId }));
        //dispatch(fetchPaymentMethods({ accessToken, orderId }));

        // Redirect to next stage.
        dispatch(setCurrentStep(2));

        // Stop the checkout loader
        dispatch(setCheckoutLoading(false));
    };

    // Handle edit for opening / closing the collapse element
    const handleEdit = () => {
        if (!isCurrentStep && hasBothAddresses) {
            dispatch(setCurrentStep(1));
        }
    };

    return (
        <div
            className={`collapse${
                hasBothAddresses ? ' collapse-plus' : ' bg-gray-200 cursor-not-allowed'
            } card bordered mb-6 rounded-md collapse-${isCurrentStep ? 'open' : 'closed'}`}
        >
            <h3 className={`text-xl font-medium${hasBothAddresses ? ' collapse-title' : ' p-4'}`} onClick={handleEdit}>
                {hasBothAddresses ? 'Delivery - Edit' : 'Delivery'}
            </h3>
            <div className="collapse-content p-0 relative">
                <Loading show={!hasShipments} />
                <form onSubmit={handleSubmit(handleSelectShippingMethod)}>
                    {hasShipments &&
                        hasBothAddresses &&
                        shipments.map((shipment, index) => {
                            return (
                                <Shipment
                                    id={shipment.id}
                                    shippingMethods={shipment.methods}
                                    shipmentCount={index + 1}
                                    shipmentsTotal={shipments.length}
                                    register={register}
                                    defaultChecked={shipment.methods[0].id}
                                    key={`shipment-${index}`}
                                />
                            );
                        })}
                    <div className="flex justify-end items-center px-4">
                        <button
                            type="submit"
                            className={`btn w-full lg:w-auto mb-4${
                                hasErrors ? ' btn-base-200 btn-disabled' : ' btn-secondary'
                            }${checkoutLoading ? ' loading' : ''}`}
                        >
                            {checkoutLoading ? '' : 'Payment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Delivery;
