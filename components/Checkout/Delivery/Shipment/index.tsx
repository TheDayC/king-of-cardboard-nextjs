import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';
import { useForm } from 'react-hook-form';

import selector from './selector';
import { setCurrentStep } from '../../../store/slices/checkout';
import { DeliveryDetails, MergedShipments } from '../../../types/checkout';
import {
    getDeliveryLeadTimes,
    getShipments,
    mergeMethodsAndLeadTimes,
    updateShipmentMethod,
} from '../../../utils/checkout';
import { fetchOrder } from '../../../store/slices/cart';

export const Shipment: React.FC = () => {
    // TODO: Flesh out Shipment.
    return (
        <form onSubmit={handleSubmit(handleSelectShippingMethod)}>
            <div className="flex">
                <div className={`collapse collapse-${isCurrentStep ? 'open' : 'closed'}`}>
                    <h3 className="collapse-title text-xl font-medium" onClick={handleEdit}>
                        {!hasErrors && !isCurrentStep ? 'Delivery - Edit' : 'Delivery'}
                    </h3>
                    <div className="collapse-content">
                        {shippingMethodsInt &&
                            shippingMethodsInt.map((method) => (
                                <div className="form-control" key={`method-${method.id}`}>
                                    <label className="label cursor-pointer">
                                        <span className="label-text">
                                            {method.name}
                                            {method.formatted_price_amount_for_shipment}
                                            {method.leadTimes &&
                                                `Available in ${method.leadTimes.minDays} - ${method.leadTimes.maxDays} days.`}
                                        </span>
                                    </label>
                                    <input
                                        type="radio"
                                        className="radio"
                                        value={method.id}
                                        defaultChecked={Boolean(shippingMethod)}
                                        {...register('shippingMethod', {
                                            required: { value: true, message: 'Required' },
                                        })}
                                    />
                                </div>
                            ))}
                        <button
                            type="submit"
                            className={`btn-sm btn-outline${
                                hasErrors ? ' btn-base-200 btn-disabled' : ' btn-secondary'
                            }`}
                        >
                            Back to Details
                        </button>
                        <button
                            type="submit"
                            className={`btn-sm${hasErrors ? ' btn-base-200 btn-disabled' : ' btn-secondary'}`}
                        >
                            Payment
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Shipment;
