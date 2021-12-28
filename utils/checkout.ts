/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios';
import { get } from 'lodash';

import { AxiosData } from '../types/fetch';
import { Counties } from '../enums/checkout';
import { CustomerDetails, ShipmentsWithLineItems } from '../store/types/state';
import { DeliveryLeadTimes, MergedShipmentMethods, Shipments, ShippingMethods } from '../types/checkout';
import { authClient } from './auth';
import { ErrorResponse } from '../types/api';
import { errorHandler } from '../middleware/errors';
import { isArray } from './typeguards';
import {
    parseAsArrayOfLineItemRelationships,
    parseAsArrayOfCommerceResponse,
    parseAsNumber,
    parseAsString,
    safelyParse,
    parseAsCommerceResponse,
} from './parsers';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchStripeGateway(accessToken: string): Promise<AxiosResponse<AxiosData> | void> {
    try {
        const url = `${process.env.NEXT_PUBLIC_ECOM_DOMAIN}/api/stripe_gateways/`;

        return await axios.get(url, {
            headers: {
                Accept: 'application/vnd.api+json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } catch (e) {
        console.error(e);
    }
}

export async function updateAddress(
    accessToken: string,
    id: string,
    personalDetails: CustomerDetails,
    isShipping: boolean
): Promise<boolean | ErrorResponse | ErrorResponse[]> {
    try {
        const data = {
            type: 'addresses',
            attributes: {
                first_name: personalDetails.firstName,
                last_name: personalDetails.lastName,
                company: personalDetails.company,
                line_1: isShipping ? personalDetails.shippingAddressLineOne : personalDetails.addressLineOne,
                line_2: isShipping ? personalDetails.shippingAddressLineTwo : personalDetails.addressLineTwo,
                city: isShipping ? personalDetails.shippingCity : personalDetails.city,
                zip_code: isShipping ? personalDetails.shippingPostcode : personalDetails.postcode,
                state_code: isShipping ? personalDetails.shippingCounty : personalDetails.county,
                country_code: 'GB',
                phone: personalDetails.phone,
            },
        };
        const cl = authClient(accessToken);
        const res = await cl.post('/api/addresses', { data });
        const addressData = safelyParse(res, 'data', parseAsCommerceResponse, null);

        if (!addressData) {
            return false;
        }

        const relationshipProp = isShipping ? 'shipping_address' : 'billing_address';
        const relationships = {
            [relationshipProp]: {
                data: {
                    type: 'addresses',
                    id: addressData.id,
                },
            },
        };

        const orderRes = cl.patch(`/api/orders/${id}`, {
            data: {
                type: 'orders',
                id,
                attributes: {
                    customer_email: personalDetails.email,
                },
                relationships,
            },
        });
        const status = safelyParse(orderRes, 'status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        return errorHandler(error, 'We could not fetch delivery lead times.');
    }
}

export async function getShipments(
    accessToken: string,
    orderId: string
): Promise<Shipments | ErrorResponse | ErrorResponse[] | null> {
    try {
        const cl = authClient(accessToken);
        const include = 'available_shipping_methods,stock_location';
        const res = await cl.get(`/api/orders/${orderId}/shipments?include=${include}`);
        const shipments = safelyParse(res, 'data.data', parseAsArrayOfCommerceResponse, null);
        const included = safelyParse(res, 'data.included', parseAsArrayOfCommerceResponse, null);

        if (!shipments || !included) {
            return null;
        }

        return {
            shipments: shipments.map((shipment) => shipment.id),
            shippingMethods: included.map((method) => {
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
                    formatted_price_amount: safelyParse(method, 'attributes.formatted_price_amount', parseAsString, ''),
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
        return errorHandler(error, 'We could not fetch delivery lead times.');
    }
}

export async function getDeliveryLeadTimes(
    accessToken: string
): Promise<DeliveryLeadTimes[] | ErrorResponse | ErrorResponse[] | null> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.get('/api/delivery_lead_times?include=shipping_method,stock_location');
        const deliveryLeadTimes: unknown = get(res, 'data.deliveryLeadTimes', null);

        if (deliveryLeadTimes && isArray(deliveryLeadTimes)) {
            return deliveryLeadTimes.map((leadTime: unknown) => ({
                id: safelyParse(leadTime, 'id', parseAsString, ''),
                minHours: safelyParse(leadTime, 'attributes.min_hours', parseAsNumber, 0),
                maxHours: safelyParse(leadTime, 'attributes.max_hours', parseAsNumber, 0),
                minDays: safelyParse(leadTime, 'attributes.min_days', parseAsNumber, 0),
                maxDays: safelyParse(leadTime, 'attributes.max_days', parseAsNumber, 0),
            }));
        }

        return null;
    } catch (error: unknown) {
        return errorHandler(error, 'We could not fetch delivery lead times.');
    }
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
        const response = await axios.post('/api/updateShipmentMethod', {
            token: accessToken,
            shipmentId,
            methodId,
        });

        if (response) {
            const hasUpdated: boolean = get(response, 'data.hasUpdated', false);

            return hasUpdated;
        }
    } catch (error) {
        console.log('Error: ', error);
    }

    return false;
}

export async function getShipment(
    accessToken: string,
    shipmentId: string
): Promise<ShipmentsWithLineItems | ErrorResponse | ErrorResponse[] | null> {
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
        return errorHandler(error, 'We could not get a shipment.');
    }
}

export async function updatePaymentMethod(accessToken: string, id: string, paymentMethodId: string): Promise<boolean> {
    try {
        const response = await axios.post('/api/updatePaymentMethod', {
            token: accessToken,
            id,
            paymentMethodId,
        });

        if (response) {
            const hasUpdated: boolean = get(response, 'data.hasUpdated', false);

            return hasUpdated;
        }
    } catch (error) {
        console.log('Error: ', error);
    }

    return false;
}
