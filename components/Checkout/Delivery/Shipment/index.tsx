import React from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';

import { MergedShipmentMethods } from '../../../../types/checkout';

interface ShipmentProps {
    id: string;
    shippingMethods: MergedShipmentMethods[];
    shipmentCount: number;
    shipmentsTotal: number;
    register: UseFormRegister<FieldValues>;
    defaultChecked: string;
}

export const Shipment: React.FC<ShipmentProps> = ({
    id,
    shippingMethods,
    shipmentCount,
    shipmentsTotal,
    register,
    defaultChecked,
}) => {
    // TODO: Flesh out Shipment.
    return (
        <div className="flex">
            <h4>
                Shipment {shipmentCount} of {shipmentsTotal}
            </h4>
            <div className="collapse-content">
                {shippingMethods.map((method) => (
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
                            defaultChecked={defaultChecked === method.id ? true : false}
                            {...register(`shipment-${id}-shippingMethod`, {
                                required: { value: true, message: 'Required' },
                            })}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shipment;
