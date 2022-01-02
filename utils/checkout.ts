import { Counties } from '../enums/checkout';
import { CustomerAddress, CustomerDetails, ShipmentsWithLineItems } from '../store/types/state';
import {
    DeliveryLeadTimes,
    MergedShipmentMethods,
    PaymentAttributes,
    Shipments,
    ShippingMethods,
} from '../types/checkout';
import { authClient } from './auth';
import { CommerceLayerResponse } from '../types/api';
import { errorHandler } from '../middleware/errors';
import { isArray } from './typeguards';
import { parseAsArrayOfCommerceResponse, parseAsNumber, parseAsString, parseAsUnknown, safelyParse } from './parsers';

function regexEmail(email: string): boolean {
    // eslint-disable-next-line no-useless-escape
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
    );
}

function regexName(name: string): boolean {
    return /^[a-z ,.'-]+$/i.test(name);
}

function regexPostCode(postcode: string): boolean {
    return /^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/gim.test(postcode);
}

function regexPhone(phone: string): boolean {
    return /^(\+\d{1,3}[- ]?)?\d{10}$/gm.test(phone);
}

export function shouldEmailError(email: string | null): boolean {
    let shouldError = true;

    if (email !== null) {
        const isValid = regexEmail(email);

        if (isValid) {
            shouldError = false;
        } else {
            shouldError = true;
        }
    } else {
        shouldError = false;
    }

    return shouldError;
}

export function shouldNameError(name: string | null): boolean {
    let shouldError = true;

    if (name !== null) {
        const isValid = regexName(name);

        if (isValid) {
            shouldError = false;
        } else {
            shouldError = true;
        }
    } else {
        shouldError = false;
    }

    return shouldError;
}

export function shouldAddressLineError(line: string | null): boolean {
    if (line !== null) {
        return line.length <= 0;
    } else {
        return false;
    }
}

export function shouldPostcodeError(code: string | null): boolean {
    let shouldError = true;

    if (code !== null) {
        const isValid = regexPostCode(code);

        if (isValid) {
            shouldError = false;
        } else {
            shouldError = true;
        }
    } else {
        shouldError = false;
    }

    return shouldError;
}

export function shouldPhoneError(phone: string): boolean {
    return regexPhone(phone);
}

export function getCounties(): Counties[] {
    return [
        Counties.Aberdeenshire,
        Counties.Angus,
        Counties.Antrim,
        Counties.Argyll,
        Counties.Armagh,
        Counties.Ayrshire,
        Counties.Banffshire,
        Counties.Bedfordshire,
        Counties.Berkshire,
        Counties.Berwickshire,
        Counties.Bristol,
        Counties.Buckinghamshire,
        Counties.Bute,
        Counties.Caithness,
        Counties.Cambridgeshire,
        Counties.Cheshire,
        Counties.CityofLondon,
        Counties.Clackmannanshire,
        Counties.Clwyd,
        Counties.Cornwall,
        Counties.Cumbria,
        Counties.Derbyshire,
        Counties.Devon,
        Counties.Dorset,
        Counties.Down,
        Counties.Dumfriesshire,
        Counties.Dunbartonshire,
        Counties.Durham,
        Counties.Dyfed,
        Counties.EastLothian,
        Counties.EastRidingofYorkshire,
        Counties.EastSussex,
        Counties.Essex,
        Counties.Fermanagh,
        Counties.Fife,
        Counties.Gloucestershire,
        Counties.GreaterLondon,
        Counties.GreaterManchester,
        Counties.Gwent,
        Counties.Gwynedd,
        Counties.Hampshire,
        Counties.Herefordshire,
        Counties.Hertfordshire,
        Counties.Invernessshire,
        Counties.IsleofWight,
        Counties.Kent,
        Counties.Kincardineshire,
        Counties.Kinrossshire,
        Counties.Kirkcudbrightshire,
        Counties.Lanarkshire,
        Counties.Lancashire,
        Counties.Leicestershire,
        Counties.Lincolnshire,
        Counties.Londonderry,
        Counties.Merseyside,
        Counties.MidGlamorgan,
        Counties.Midlothian,
        Counties.Moray,
        Counties.Nairnshire,
        Counties.Norfolk,
        Counties.NorthYorkshire,
        Counties.Northamptonshire,
        Counties.Northumberland,
        Counties.Nottinghamshire,
        Counties.Orkney,
        Counties.Oxfordshire,
        Counties.Peeblesshire,
        Counties.Perthshire,
        Counties.Powys,
        Counties.Renfrewshire,
        Counties.RossandCromarty,
        Counties.Roxburghshire,
        Counties.Rutland,
        Counties.Selkirkshire,
        Counties.Shetland,
        Counties.Shropshire,
        Counties.Somerset,
        Counties.SouthGlamorgan,
        Counties.SouthYorkshire,
        Counties.Staffordshire,
        Counties.Stirlingshire,
        Counties.Suffolk,
        Counties.Surrey,
        Counties.Sutherland,
        Counties.TyneandWear,
        Counties.Tyrone,
        Counties.Warwickshire,
        Counties.WestGlamorgan,
        Counties.WestLothian,
        Counties.WestMidlands,
        Counties.WestSussex,
        Counties.WestYorkshire,
        Counties.Wigtownshire,
        Counties.Wiltshire,
        Counties.Worcestershire,
    ];
}

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

export async function updateAddress(
    accessToken: string,
    id: string,
    details: CustomerDetails,
    address: Partial<CustomerAddress>,
    isShipping: boolean
): Promise<boolean> {
    try {
        const data = {
            type: 'addresses',
            attributes: {
                ...details,
                ...address,
            },
        };
        const cl = authClient(accessToken);
        const res = await cl.post('/api/addresses', { data });
        const addressId = safelyParse(res, 'data.data.id', parseAsString, null);

        if (!addressId) {
            return false;
        }

        const relationshipProp = isShipping ? 'shipping_address' : 'billing_address';
        const relationships = {
            [relationshipProp]: {
                data: {
                    type: 'addresses',
                    id: addressId,
                },
            },
        };

        const orderRes = await cl.patch(`/api/orders/${id}`, {
            data: {
                type: 'orders',
                id,
                attributes: {
                    customer_email: details.email,
                },
                relationships,
            },
        });
        const status = safelyParse(orderRes, 'status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        errorHandler(error, 'Address could not be updated.');
    }

    return false;
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

export async function getShipments(accessToken: string, orderId: string): Promise<Shipments | null> {
    try {
        const cl = authClient(accessToken);
        const include = 'available_shipping_methods';
        const res = await cl.get(`/api/orders/${orderId}/shipments?include=${include}`);
        const shipments = safelyParse(res, 'data.data', parseAsArrayOfCommerceResponse, null);
        const included = safelyParse(res, 'data.included', parseAsArrayOfCommerceResponse, null);

        if (!shipments || !included) {
            return null;
        }

        return {
            shipments: shipments.map((shipment) => shipment.id),
            shippingMethods: included
                .filter((i) => i.type === 'shipping_methods')
                .map((method) => {
                    return {
                        id: safelyParse(method, 'id', parseAsString, ''),
                        name: safelyParse(method, 'attributes.name', parseAsString, ''),
                        price_amount_cents: safelyParse(method, 'attributes.price_amount_cents', parseAsNumber, 0),
                        price_amount_float: safelyParse(method, 'attributes.price_amount_float', parseAsNumber, 0),
                        price_amount_for_shipment_cents: safelyParse(
                            method,
                            'attributes.price_amount_for_shipment_cents',
                            parseAsNumber,
                            0
                        ),
                        price_amount_for_shipment_float: safelyParse(
                            method,
                            'attributes.price_amount_for_shipment_float',
                            parseAsNumber,
                            0
                        ),
                        currency_code: safelyParse(method, 'attributes.currency_code', parseAsString, ''),
                        formatted_price_amount: safelyParse(
                            method,
                            'attributes.formatted_price_amount',
                            parseAsString,
                            ''
                        ),
                        formatted_price_amount_for_shipment: safelyParse(
                            method,
                            'attributes.formatted_price_amount_for_shipment',
                            parseAsString,
                            ''
                        ),
                    };
                }),
        };
    } catch (error: unknown) {
        errorHandler(error, 'Failed to fetch shipments.');
    }

    return null;
}

export async function getDeliveryLeadTimes(accessToken: string): Promise<DeliveryLeadTimes[] | null> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.get('/api/delivery_lead_times?include=shipping_method');
        const deliveryLeadTimes = safelyParse(res, 'data.data', parseAsUnknown, null);

        if (deliveryLeadTimes && isArray(deliveryLeadTimes)) {
            return deliveryLeadTimes.map((leadTime: unknown) => ({
                id: safelyParse(leadTime, 'id', parseAsString, ''),
                minHours: safelyParse(leadTime, 'attributes.min_hours', parseAsNumber, 0),
                maxHours: safelyParse(leadTime, 'attributes.max_hours', parseAsNumber, 0),
                minDays: safelyParse(leadTime, 'attributes.min_days', parseAsNumber, 0),
                maxDays: safelyParse(leadTime, 'attributes.max_days', parseAsNumber, 0),
            }));
        }
    } catch (error: unknown) {
        errorHandler(error, 'Failed to fetch delivery lead times.');
    }

    return null;
}

export function mergeMethodsAndLeadTimes(
    shippingMethods: ShippingMethods[],
    leadTimes: DeliveryLeadTimes[]
): MergedShipmentMethods[] {
    return shippingMethods.map((method) => {
        const matchingLeadTime = findLeadTimeIdFromMethodName(method.name, leadTimes);

        return {
            ...method,
            leadTimes: matchingLeadTime,
        };
    });
}

function findLeadTimeIdFromMethodName(name: string, leadTimes: DeliveryLeadTimes[]): DeliveryLeadTimes | null {
    switch (name) {
        case 'Royal Mail 1st Class':
            return leadTimes.find((time) => time.maxDays === 2) || null;
        case 'Royal Mail 2nd Class':
            return leadTimes.find((time) => time.maxDays === 5) || null;
        default:
            return null;
    }
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

export function paymentBtnText(method: string): string {
    switch (method) {
        case 'paypal_payments':
            return 'Checkout with PayPal';
        default:
            return 'Checkout';
    }
}
