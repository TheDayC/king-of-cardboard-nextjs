import React from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';

import selector from './selector';
import styles from './summary.module.css';
import Loading from '../../Loading';
import Totals from './Totals';

interface SummaryProps {
    isConfirmation: boolean;
}

export const Summary: React.FC<SummaryProps> = ({ isConfirmation = false }) => {
    const { cartOrderNumber, confirmationOrderNumber, checkoutLoading, cartItems, confirmedItems } =
        useSelector(selector);
    const lineItems = isConfirmation ? confirmedItems : cartItems;
    const orderNumber = isConfirmation ? confirmationOrderNumber : cartOrderNumber;

    return (
        <div className="flex flex-col relative">
            <Loading show={checkoutLoading} />
            <div className="flex flex-row w-100 justify-between items-center">
                <h2 className="text-2xl">Order #{orderNumber}</h2>
                <p className="text-xl">{`(${lineItems.length} item${lineItems.length > 1 ? 's' : ''})`}</p>
            </div>
            <div className="divider"></div>
            <div className="flex flex-col">
                {lineItems.length > 0 &&
                    lineItems.map((item) => (
                        <React.Fragment key={`checkout-line-item-${item.sku_code}`}>
                            <div className="flex flex-row justify-between items-center px-4">
                                <div className="relative w-16 h-16">
                                    {item.image.url.length > 0 && (
                                        <Image
                                            src={item.image.url}
                                            alt={item.image.description}
                                            title={item.image.title}
                                            layout="fill"
                                            objectFit="scale-down"
                                        />
                                    )}
                                </div>
                                <div className="px-2">
                                    <h4 className="text-sm lg:text-md">{item.name}</h4>
                                    <p className="text-xs text-base-200">{item.sku_code}</p>
                                    <p className="text-xs text-base-200">Quantity: {item.quantity}</p>
                                </div>
                                <p className="text-sm lg:text-md">{item.formatted_total_amount}</p>
                            </div>
                            <div className={`divider my-2 lg:my-4${styles.itemDivider}`}></div>
                        </React.Fragment>
                    ))}
            </div>
            <div className="block w-full">
                <Totals isConfirmation={isConfirmation} />
            </div>
        </div>
    );
};

export default Summary;
