import { PaymentMethod, CustomerAddress, ShipmentsWithLineItems } from '../store/types/state';
import { CustomerDetails, PaymentAttributes, Shipment } from '../types/checkout';
import { authClient } from './auth';
import { CommerceLayerResponse } from '../types/api';
import { errorHandler } from '../middleware/errors';
import { parseAsArrayOfCommerceResponse, parseAsNumber, parseAsString, safelyParse } from './parsers';
import { PaymentMethods } from '../enums/checkout';

export function fieldPatternMsgs(field: string): string {
    switch (field) {
        case 'firstName':
        case 'lastName':
            return 'Name must only contain letters.';
        case 'email':
            return 'Email address must be valid.';
        case 'mobile':
            return 'Must not contain letters.';
        case 'billingPostcode':
        case 'shippingPostcode':
        case 'postcode':
            return 'Must be a valid postcode.';
        default:
            return '';
    }
}

export async function updateAddressClone(
    accessToken: string,
    orderId: string,
    cloneId: string,
    isShipping: boolean
): Promise<boolean> {
    try {
        const baseData = {
            type: 'orders',
            id: orderId,
        };
        const data = isShipping
            ? {
                  ...baseData,
                  attributes: {
                      _shipping_address_clone_id: cloneId,
                  },
              }
            : {
                  ...baseData,
                  attributes: {
                      _billing_address_clone_id: cloneId,
                  },
              };
        const cl = authClient(accessToken);
        const res = await cl.patch(`/api/orders/${orderId}`, { data });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        errorHandler(error, 'Address could not be updated.');
    }

    return false;
}

export async function updateSameAsBilling(
    accessToken: string,
    orderId: string,
    sameAsBilling: boolean
): Promise<boolean> {
    try {
        const data = {
            type: 'orders',
            id: orderId,
            attributes: {
                _shipping_address_same_as_billing: sameAsBilling,
            },
        };
        const cl = authClient(accessToken);
        const res = await cl.patch(`/api/orders/${orderId}`, { data });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        errorHandler(error, 'Failed to set shipping address to the same as billing.');
    }

    return false;
}

export async function getShipments(accessToken: string, orderId: string): Promise<Shipment[]> {
    try {
        const cl = authClient(accessToken);
        const methodFields = 'fields[shipping_methods]=id,name,formatted_price_amount_for_shipment';
        const shipmentFields = 'fields[shipments]=id,available_shipping_methods';
        const res = await cl.get(
            `/api/orders/${orderId}/shipments?include=available_shipping_methods&${methodFields}&${shipmentFields}`
        );
        const shipments = safelyParse(res, 'data.data', parseAsArrayOfCommerceResponse, []);
        const included = safelyParse(res, 'data.included', parseAsArrayOfCommerceResponse, []);

        const deliveryLeadTimesRes = await cl.get(
            '/api/delivery_lead_times?fields[delivery_lead_times]=min_days,max_days,shipping_method&include=shipping_method'
        );
        const deliveryLeadTimes = safelyParse(deliveryLeadTimesRes, 'data.data', parseAsArrayOfCommerceResponse, []);

        return shipments.map((shipment) => {
            const methodIds: string[] = shipment.relationships.available_shipping_methods.data.map((m: unknown) =>
                safelyParse(m, 'id', parseAsString, '')
            );

            const methods = included
                .filter((i) => i.type === 'shipping_methods' && methodIds.includes(i.id))
                .map((i) => {
                    const leadTime =
                        deliveryLeadTimes.find((dLT) => dLT.relationships.shipping_method.data.id === i.id) || null;

                    return {
                        id: safelyParse(i, 'id', parseAsString, ''),
                        name: safelyParse(i, 'attributes.name', parseAsString, ''),
                        minDays: safelyParse(leadTime, 'attributes.min_days', parseAsNumber, 0),
                        maxDays: safelyParse(leadTime, 'attributes.max_days', parseAsNumber, 0),
                        price: safelyParse(i, 'attributes.formatted_price_amount_for_shipment', parseAsString, ''),
                    };
                });

            return {
                id: safelyParse(shipment, 'id', parseAsString, ''),
                category: safelyParse(shipment, 'relationships.shipping_category.data.id', parseAsString, ''),
                methods,
            };
        });
    } catch (error: unknown) {
        errorHandler(error, 'Failed to fetch shipments.');
    }

    return [];
}

export async function updateShipmentMethod(
    accessToken: string,
    shipmentId: string,
    methodId: string
): Promise<boolean> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.patch(`/api/shipments/${shipmentId}`, {
            data: {
                type: 'shipments',
                id: shipmentId,
                relationships: {
                    shipping_method: {
                        data: {
                            type: 'shipping_methods',
                            id: methodId,
                        },
                    },
                },
            },
        });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        errorHandler(error, 'Failed to update shipment method.');
    }

    return false;
}

export async function getShipment(accessToken: string, shipmentId: string): Promise<ShipmentsWithLineItems | null> {
    try {
        const cl = authClient(accessToken);
        const include = 'shipping_method,delivery_lead_time,shipment_line_items';
        const res = await cl.get(`/api/shipments/${shipmentId}?include=${include}`);
        const included = safelyParse(res, 'data.included', parseAsArrayOfCommerceResponse, null);

        if (!included) {
            return null;
        }

        const method = included.find((i) => i.type === 'shipping_methods');
        const items = included
            .filter((i) => i.type === 'shipment_line_items')
            .map((item) => safelyParse(item, 'attributes.sku_code', parseAsString, ''));
        const methodId = safelyParse(method, 'id', parseAsString, '');

        return {
            shipmentId,
            methodId,
            lineItems: items,
        };
    } catch (error: unknown) {
        errorHandler(error, 'Failed to fetch shipment.');
    }

    return null;
}

export async function updatePaymentMethod(accessToken: string, id: string, paymentMethodId: string): Promise<boolean> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.patch(`/api/orders/${id}`, {
            data: {
                type: 'orders',
                id,
                relationships: {
                    payment_method: {
                        data: {
                            type: 'payment_methods',
                            id: paymentMethodId,
                        },
                    },
                },
            },
        });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        errorHandler(error, 'We could not get a shipment.');
    }

    return false;
}

export function buildPaymentAttributes(method: string, orderId: string): PaymentAttributes {
    const complete = process.env.NEXT_PUBLIC_COMPLETE_ORDER;
    const cancel = process.env.NEXT_PUBLIC_CANCEL_ORDER;

    switch (method) {
        case 'paypal_payments':
            return {
                return_url: `${complete}/${orderId}`,
                cancel_url: `${cancel}/${orderId}`,
            };
        case 'stripe_payments':
        default:
            return {};
    }
}

export async function getPayPalPaymentIdByOrder(accessToken: string, orderId: string): Promise<string | null> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.get(`/api/paypal_payments?include=order&filter[q][order_id_eq]=${orderId}`);
        const resArray = safelyParse(res, 'data.data', parseAsArrayOfCommerceResponse, [] as CommerceLayerResponse[]);

        return safelyParse(resArray[0], 'id', parseAsString, null);
    } catch (error: unknown) {
        errorHandler(error, 'Failed to confirm your paypal order, please try again.');
    }

    return null;
}

export async function completePayPalOrder(accessToken: string, paymentId: string, payerId: string): Promise<boolean> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.patch(`/api/paypal_payments/${paymentId}`, {
            data: {
                type: 'paypal_payments',
                id: paymentId,
                attributes: {
                    paypal_payer_id: payerId,
                },
            },
        });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        errorHandler(error, 'Failed to confirm your paypal order, please try again.');
    }

    return false;
}

export function paymentBtnText(method: PaymentMethods): string {
    switch (method) {
        case PaymentMethods.PayPal:
            return 'Checkout with PayPal';
        default:
            return 'Checkout';
    }
}

export async function getPaymentMethods(accessToken: string, orderId: string): Promise<PaymentMethod[]> {
    try {
        const apiUrl = `/api/orders/${orderId}?include=available_payment_methods&fields[payment_methods]=id,name,payment_source_type&fields[orders]=id`;

        const cl = authClient(accessToken);
        const res = await cl.get(apiUrl);
        const included = safelyParse(res, 'data.included', parseAsArrayOfCommerceResponse, []);

        return included.map((include) => ({
            id: safelyParse(include, 'id', parseAsString, ''),
            name: safelyParse(include, 'attributes.name', parseAsString, ''),
            payment_source_type: safelyParse(include, 'attributes.payment_source_type', parseAsString, ''),
        }));
    } catch (error: unknown) {
        errorHandler(error, 'We could not fetch an order.');
    }

    return [];
}

export async function updateGiftCardCode(accessToken: string, orderId: string, code: string): Promise<boolean> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.patch(`/api/orders/${orderId}`, {
            data: {
                type: 'orders',
                id: orderId,
                attributes: {
                    gift_card_code: code,
                },
            },
        });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        errorHandler(error, 'We could not add subtract your coin balance.');
    }

    return false;
}

export function formatOrderNumber(orderNumber: number): string {
    if (orderNumber < 100) {
        return `#00${orderNumber}`;
    }

    if (orderNumber < 1000) {
        return `#0${orderNumber}`;
    }

    return `#${orderNumber}`;
}
