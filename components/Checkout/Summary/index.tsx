import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isArray } from 'lodash';
import Image from 'next/image';

import selector from './selector';
import styles from './summary.module.css';
import CartTotals from '../../Cart/CartTotals';
import Loading from '../../Loading';
import { ContentfulProductShort } from '../../../types/products';
import { fetchProductByProductLink } from '../../../utils/products';

interface SummaryProps {
    isConfirmation: boolean;
}

export const Summary: React.FC<SummaryProps> = ({ isConfirmation = false }) => {
    const { cartOrder, confirmationOrder, checkoutLoading, cartItems, confirmedItems } = useSelector(selector);
    const [products, setProducts] = useState<ContentfulProductShort[] | null>(null);
    const lineItems = isConfirmation ? confirmedItems : cartItems;
    const order = isConfirmation ? confirmationOrder : cartOrder;

    const fetchCurrentProduct = async (skuCodes: string[]) => {
        const cmsProducts = await fetchProductByProductLink(skuCodes);

        if (isArray(cmsProducts)) {
            setProducts(cmsProducts);
        }
    };

    useEffect(() => {
        if (lineItems) {
            fetchCurrentProduct(lineItems.map((item) => item.sku_code));
        }
    }, [lineItems]);

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
                        const matchingProduct = products
                            ? products.find((product) => product.productLink === item.sku_code)
                            : null;

                        return (
                            <React.Fragment key={`checkout-line-item-${item.sku_code}`}>
                                <div className="flex flex-row justify-between items-center px-4">
                                    <div className={styles.imageContainer}>
                                        {matchingProduct && matchingProduct.cardImage && (
                                            <Image
                                                src={matchingProduct.cardImage.url}
                                                alt={matchingProduct.cardImage.description}
                                                title={matchingProduct.cardImage.title}
                                                layout="fill"
                                                objectFit="scale-down"
                                            />
                                        )}
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
                    })}
            </div>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <tbody>
                        <CartTotals isConfirmation={isConfirmation} />
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Summary;
