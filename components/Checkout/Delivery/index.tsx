import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { get } from 'lodash';
import { BsArrowLeftCircle } from 'react-icons/bs';

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

export const Delivery: React.FC = () => {
    const dispatch = useDispatch();
    const { accessToken, currentStep, shipmentsWithMethods, order } = useSelector(selector);
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
        if (shipments) {
            // Set shipments with methods for local storage.
            const setShipmentsAndMethods: ShipmentsWithMethods[] = shipments.shipments.map((shipment) => ({
                shipmentId: shipment,
                methodId: get(data, `shipment-${shipment}-method`, ''),
            }));

            dispatch(setShipmentsWithMethods(setShipmentsAndMethods));

            // Set shipments in the commerce layer.
            shipments.shipments.forEach((shipment) => {
                const chosenMethod = get(data, `shipment-${shipment}-shippingMethod`, null);

                if (chosenMethod && accessToken) {
                    updateShipmentMethod(accessToken, shipment, chosenMethod).then((res) => {
                        if (res) {
                            dispatch(setCurrentStep(2));
                            dispatch(fetchOrder(true));
                        }
                    });
                }
            });
        }
    };

    const handleEdit = () => {
        if (!isCurrentStep) {
            dispatch(setCurrentStep(1));
        }
    };

    return (
        <div
            className={`collapse collapse-plus card bordered mb-6 rounded-md collapse-${
                isCurrentStep ? 'open' : 'closed'
            }`}
        >
            <h3 className="collapse-title text-xl font-medium" onClick={handleEdit}>
                {!hasErrors && !isCurrentStep ? 'Delivery - Edit' : 'Delivery'}
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
                        {/* <button
                        type="submit"
                        className={`btn btn-outline${hasErrors ? ' btn-base-200 btn-disabled' : ' btn-accent'}`}
                    >
                            <BsArrowLeftCircle className="inline-block w-6 h-6 mr-2 stroke-current" />
                        Back to Details
                    </button> */}
                        <button
                            type="submit"
                            className={`btn ${hasErrors ? ' btn-base-200 btn-disabled' : ' btn-secondary'}`}
                        >
                            Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Delivery;
