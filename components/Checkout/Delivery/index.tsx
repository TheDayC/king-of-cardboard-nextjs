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
import { setCheckoutLoading } from '../../../store/slices/global';
import { isArrayOfErrors, isError } from '../../../utils/typeguards';
import { addAlert } from '../../../store/slices/alerts';
import { AlertLevel } from '../../../enums/system';
import { parseAsString, safelyParse } from '../../../utils/parsers';
import Alert from '../../Alert';

export const Delivery: React.FC = () => {
    const dispatch = useDispatch();
    const { accessToken, currentStep, shipmentsWithMethods, order, checkoutLoading } = useSelector(selector);
    const [shipments, setShipments] = useState<FinalShipments | null>(null);
    console.log('🚀 ~ file: index.tsx ~ line 29 ~ shipments', shipments);
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
            const hasResErrors =
                !shipmentData ||
                !deliveryLeadTimes ||
                isError(shipmentData) ||
                isError(deliveryLeadTimes) ||
                isArrayOfErrors(shipmentData) ||
                isArrayOfErrors(deliveryLeadTimes);

            if (!hasResErrors) {
                const { shipments, shippingMethods } = shipmentData;
                const mergedMethods = mergeMethodsAndLeadTimes(shippingMethods, deliveryLeadTimes);

                setShipments({
                    shipments,
                    shippingMethods: mergedMethods,
                });
            } else {
                if (isError(shipmentData)) {
                    dispatch(addAlert({ message: shipmentData.description, level: AlertLevel.Error }));
                }

                if (isError(deliveryLeadTimes)) {
                    dispatch(addAlert({ message: deliveryLeadTimes.description, level: AlertLevel.Error }));
                }

                if (isArrayOfErrors(shipmentData)) {
                    shipmentData.forEach((shipmentErr) => {
                        dispatch(addAlert({ message: shipmentErr.description, level: AlertLevel.Error }));
                    });
                }

                if (isArrayOfErrors(deliveryLeadTimes)) {
                    deliveryLeadTimes.forEach((leadErr) => {
                        dispatch(addAlert({ message: leadErr.description, level: AlertLevel.Error }));
                    });
                }
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
                        if (!isError(res)) {
                            // Fetch the order with new details.
                            dispatch(fetchOrder(true));

                            // Redirect to next stage.
                            dispatch(setCurrentStep(2));
                        } else {
                            dispatch(addAlert({ message: res.description, level: AlertLevel.Error }));
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
