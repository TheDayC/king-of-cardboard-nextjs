import React from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';

import selector from './selector';
import styles from './summary.module.css';
import CartTotals from '../../Cart/CartTotals';
import Loading from '../../Loading';

export const Summary: React.FC = () => {
    const { order, lineItems, checkoutLoading } = useSelector(selector);

    if (!order) {
        return null;
    }

    return (
        <div className="flex flex-col relative">
            <Loading show={checkoutLoading} />
            <div className="flex flex-row w-100 justify-between items-center">
                <h2 className="text-2xl">Order #{order.number}</h2>
                <p className="text-xl">{`(${lineItems.length} item${lineItems.length > 1 ? 's' : ''})`}</p>
            </div>
            <div className="divider"></div>
            <div className="flex flex-col">
                {lineItems.length > 0 &&
                    lineItems.map((item) => {
                        if (item.sku_code) {
                            return (
                                <React.Fragment key={`checkout-line-item-${item.sku_code}`}>
                                    <div className="flex flex-row justify-between items-center px-4">
                                        <div className={`${styles.imageContainer}`}>
                                            <Image
                                                src={item.image_url}
                                                alt="shipment image"
                                                layout="fill"
                                                objectFit="scale-down"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-md">{item.name}</h4>
                                            <p className="text-xs text-base-200">{item.sku_code}</p>
                                            <p className="text-xs text-base-200">Quantity: {item.quantity}</p>
                                        </div>
                                        <p className="text-md">{item.formatted_total_amount}</p>
                                    </div>
                                    <div className={`divider ${styles.itemDivider}`}></div>
                                </React.Fragment>
                            );
                        }
                    })}
            </div>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <tbody>
                        <CartTotals />
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Summary;
