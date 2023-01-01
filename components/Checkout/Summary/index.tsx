import React from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';

import selector from './selector';
import styles from './summary.module.css';
import Loading from '../../Loading';
import Totals from './Totals';
import { getPrettyPrice } from '../../../utils/account/products';
import { formatOrderNumber } from '../../../utils/checkout';

interface SummaryProps {
    isConfirmation: boolean;
}

export const Summary: React.FC<SummaryProps> = ({ isConfirmation = false }) => {
    const { orderNumber, isCheckoutLoading, cartItems, confirmedItems } = useSelector(selector);
    const lineItems = isConfirmation ? confirmedItems : cartItems;

    return (
        <div className="flex flex-col relative">
            <Loading show={isCheckoutLoading} />
            <div className="flex flex-row w-100 justify-between items-center">
                <h2 className="text-2xl">{orderNumber ? `Order ${formatOrderNumber(orderNumber)}` : 'Summary'}</h2>
                <p className="text-xl">{`(${lineItems.length} item${lineItems.length > 1 ? 's' : ''})`}</p>
            </div>
            <div className="divider"></div>
            <div className="flex flex-col">
                {lineItems.length > 0 &&
                    lineItems.map((item) => (
                        <React.Fragment key={`checkout-line-item-${item.sku}`}>
                            <div className="flex flex-row justify-between items-center px-4">
                                <div className="relative w-16 h-16 overflow-hidden rounded-md">
                                    {item.mainImage.url.length > 0 && (
                                        <Image
                                            src={item.mainImage.url}
                                            alt={item.mainImage.description}
                                            title={item.mainImage.title}
                                            width={64}
                                            height={64}
                                        />
                                    )}
                                </div>
                                <div className="px-2">
                                    <h4 className="text-sm font-bold lg:text-md">{item.title}</h4>
                                    <p className="text-xs text-gray-400 mb-1">{item.sku}</p>
                                    <p className="text-xs text-gray-400 mb-1">Quantity: {item.quantity}</p>
                                    {/* item.line_item_options.length > 0 &&
                                        item.line_item_options.map((option) => (
                                            <p className="text-xs text-gray-400 mb-1" key={`option-${option.id}`}>
                                                Addon: {option.name} - {option.formatted_total_amount}
                                            </p>
                                        )) */}
                                </div>

                                <p className="text-sm lg:text-md">{getPrettyPrice(item.price)}</p>
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
