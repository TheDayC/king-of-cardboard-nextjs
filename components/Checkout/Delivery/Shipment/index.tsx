import React, { useCallback, useEffect, useState } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Image from 'next/image';

import { Method } from '../../../../types/checkout';
import { getShipment } from '../../../../utils/checkout';
import selector from './selector';
import styles from './shipment.module.css';
import { parseAsArrayOfStrings, safelyParse } from '../../../../utils/parsers';

interface ShipmentProps {
    id: string;
    shippingMethods: Method[];
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
    const { accessToken, lineItems } = useSelector(selector);
    const [lineItemSkus, setLineItemSkus] = useState<string[] | null>(null);

    const getShipmentLineItems = useCallback(async (accessToken: string, shipmentId: string) => {
        const res = await getShipment(accessToken, shipmentId);

        if (res) {
            const lineItemsSkus = safelyParse(res, 'lineItems', parseAsArrayOfStrings, null);

            if (lineItemsSkus) {
                setLineItemSkus(lineItemsSkus);
            }
        }
    }, []);

    useEffect(() => {
        if (accessToken && id) {
            getShipmentLineItems(accessToken, id);
        }
    }, [accessToken, id, getShipmentLineItems]);

    return (
        <div className="card p-4">
            <div className="card-title">
                Shipment {shipmentCount} of {shipmentsTotal}
            </div>
            <div className="collapse-body">
                {lineItemSkus &&
                    lineItemSkus.map((sku) => {
                        const lineItem = lineItems.find((item) => item.sku === sku);

                        if (lineItem) {
                            return (
                                <React.Fragment key={`checkout-line-item-${lineItem.sku}`}>
                                    <div className="flex flex-row justify-between items-center px-4">
                                        <div className={`${styles.imageContainer}`}>
                                            {lineItem.mainImage.url.length > 0 && (
                                                <Image
                                                    src={lineItem.mainImage.url}
                                                    alt={lineItem.mainImage.description}
                                                    title={lineItem.mainImage.title}
                                                    layout="fill"
                                                    objectFit="scale-down"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-md">{lineItem.title}</h4>
                                            <p className="text-xs text-base-200">{lineItem.sku}</p>
                                        </div>
                                        <p className="text-md">Quantity: {lineItem.quantity}</p>
                                    </div>
                                    <div className="divider"></div>
                                </React.Fragment>
                            );
                        }
                    })}
                {shippingMethods.map((method) => (
                    <div className="form-control" key={`method-${method.id}`}>
                        <label className="label cursor-pointer">
                            <span className="label-text">
                                <div className="grid grid-cols-1">
                                    <span className="md:text-lg">
                                        {method.name} - {method.price}
                                    </span>
                                    <span className="text-xs md:text-sm text-gray-400 mt-1">
                                        {`Available in ${method.minDays} - ${method.maxDays} days.`}
                                    </span>
                                </div>
                            </span>
                            <input
                                type="radio"
                                className="radio radio-md"
                                value={method.id}
                                defaultChecked={defaultChecked === method.id}
                                {...register(`method.${id}.methodId`, {
                                    required: { value: true, message: 'Required' },
                                })}
                            />
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shipment;
