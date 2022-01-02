import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';

import selector from './selector';
import { setCurrentStep, setShipmentsWithMethods } from '../../../store/slices/checkout';
import { FinalShipments } from '../../../types/checkout';
import {
    getDeliveryLeadTimes,
    getShipments,
    mergeMethodsAndLeadTimes,
    updateShipmentMethod,
} from '../../../utils/checkout';
import Shipment from './Shipment';
import { fetchOrder } from '../../../store/slices/cart';
import { ShipmentsWithMethods } from '../../../store/types/state';
import { setCheckoutLoading } from '../../../store/slices/global';
import { parseAsString, safelyParse } from '../../../utils/parsers';

export const Delivery: React.FC = () => {
    const dispatch = useDispatch();
    const { accessToken, currentStep, shipmentsWithMethods, order, checkoutLoading, hasBothAddresses } =
        useSelector(selector);
    const [shipments, setShipments] = useState<FinalShipments | null>(null);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const isCurrentStep = currentStep === 1;
    const hasErrors = Object.keys(errors).length > 0;

    const fetchAllShipments = useCallback(async (accessToken: string, orderId: string) => {
        if (accessToken && orderId) {
            const shipmentData = await getShipments(accessToken, orderId);
            const deliveryLeadTimes = await getDeliveryLeadTimes(accessToken);

            if (shipmentData && deliveryLeadTimes) {
                const { shipments, shippingMethods } = shipmentData;
                const mergedMethods = mergeMethodsAndLeadTimes(shippingMethods, deliveryLeadTimes);

                setShipments({
                    shipments,
                    shippingMethods: mergedMethods,
                });
            }
        }
    }, []);

    useEffect(() => {
        if (accessToken && order) {
            fetchAllShipments(accessToken, order.id);
        }
    }, [accessToken, order, fetchAllShipments]);

    const handleSelectShippingMethod = async (data: unknown) => {
        if (hasErrors || checkoutLoading || !accessToken) {
            return;
        }

        if (shipments) {
            dispatch(setCheckoutLoading(true));
            // Set shipments with methods for local storage.
            const setShipmentsAndMethods: ShipmentsWithMethods[] = shipments.shipments.map((shipment) => ({
                shipmentId: shipment,
                methodId: safelyParse(data, `shipment-${shipment}-method`, parseAsString, ''),
            }));

            dispatch(setShipmentsWithMethods(setShipmentsAndMethods));

            // Set shipments in the commerce layer.
            shipments.shipments.forEach((shipment) => {
                const chosenMethod = safelyParse(data, `shipment-${shipment}-shippingMethod`, parseAsString, '');

                if (chosenMethod) {
                    updateShipmentMethod(accessToken, shipment, chosenMethod).then((res) => {
                        if (res) {
                            // Fetch the order with new details.
                            dispatch(fetchOrder(true));

                            // Redirect to next stage.
                            dispatch(setCurrentStep(2));
                        }
                    });
                }
            });
        }
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
            <div className="collapse-content p-0">
                <form onSubmit={handleSubmit(handleSelectShippingMethod)}>
                    {shipments &&
                        shipments.shipments.map((shipment, index) => {
                            const defaultValue = shipmentsWithMethods
                                ? shipmentsWithMethods.find((withMethod) => withMethod.shipmentId === shipment)
                                : null;
                            return (
                                <Shipment
                                    id={shipment}
                                    shippingMethods={shipments.shippingMethods}
                                    shipmentCount={index + 1}
                                    shipmentsTotal={shipments.shipments.length}
                                    register={register}
                                    defaultChecked={defaultValue ? defaultValue.methodId : ''}
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
