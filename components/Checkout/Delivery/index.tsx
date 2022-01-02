import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import selector from './selector';
import { setCurrentStep, setShipmentsWithMethods } from '../../../store/slices/checkout';
import { MergedShipmentMethods } from '../../../types/checkout';
import {
    getDeliveryLeadTimes,
    getShipments,
    mergeMethodsAndLeadTimes,
    updateShipmentMethod,
} from '../../../utils/checkout';
import Shipment from './Shipment';
import { fetchOrder } from '../../../store/slices/cart';
import { setCheckoutLoading } from '../../../store/slices/global';
import Loading from '../../Loading';
import { ShipmentsWithMethods } from '../../../store/types/state';

interface FormMethods {
    [x: string]: ShipmentsWithMethods;
}

interface FormData {
    method: FormMethods;
}

export const Delivery: React.FC = () => {
    const dispatch = useDispatch();
    const { accessToken, currentStep, order, checkoutLoading, hasBothAddresses } = useSelector(selector);
    const [shipments, setShipments] = useState<string[] | null>(null);
    const [methods, setMethods] = useState<MergedShipmentMethods[] | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const isCurrentStep = currentStep === 1;
    const hasErrors = Object.keys(errors).length > 0;
    const hasShipmentsAndMethods = shipments && methods;

    const fetchAllShipments = useCallback(async (accessToken: string, orderId: string) => {
        if (accessToken && orderId) {
            const shipmentData = await getShipments(accessToken, orderId);
            const deliveryLeadTimes = await getDeliveryLeadTimes(accessToken);

            if (shipmentData && deliveryLeadTimes) {
                const { shipments, shippingMethods } = shipmentData;
                const mergedMethods = mergeMethodsAndLeadTimes(shippingMethods, deliveryLeadTimes);

                setMethods(mergedMethods);
                setShipments(shipments);
            }
        }
    }, []);

    useEffect(() => {
        if (accessToken && order) {
            fetchAllShipments(accessToken, order.id);
        }
    }, [accessToken, order, fetchAllShipments]);

    const handleSelectShippingMethod = async (data: FormData) => {
        if (hasErrors || checkoutLoading || !accessToken || !shipments) {
            return;
        }

        // Start checkout loader.
        dispatch(setCheckoutLoading(true));

        const mappedData = shipments.map((shipment) => ({
            shipmentId: shipment,
            methodId: data.method[shipment].methodId,
        }));

        dispatch(setShipmentsWithMethods(mappedData));

        mappedData.forEach(async (mD) => await updateShipmentMethod(accessToken, mD.shipmentId, mD.methodId));

        // Fetch the order with new details.
        dispatch(fetchOrder(true));

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
                <Loading show={!hasShipmentsAndMethods} />
                <form onSubmit={handleSubmit(handleSelectShippingMethod)}>
                    {hasShipmentsAndMethods &&
                        shipments.map((shipment, index) => {
                            return (
                                <Shipment
                                    id={shipment}
                                    shippingMethods={methods}
                                    shipmentCount={index}
                                    shipmentsTotal={shipments.length}
                                    register={register}
                                    defaultChecked={methods[0].id}
                                    key={`shipment-${index}`}
                                />
                            );
                        })}
                    <div className="flex justify-end items-center p-4">
                        <button
                            type="submit"
                            className={`btn ${hasErrors ? ' btn-base-200 btn-disabled' : ' btn-secondary'}${
                                checkoutLoading ? ' loading btn-square' : ''
                            }`}
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
