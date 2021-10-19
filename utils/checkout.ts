import axios, { AxiosResponse } from 'axios';
import { get } from 'lodash';

import { AxiosData } from '../types/fetch';
import { Counties } from '../enums/checkout';
import { CustomerDetails, ShipmentsWithLineItems, ShipmentsWithMethods } from '../store/types/state';
import {
    DeliveryLeadTimes,
    MergedShipmentMethods,
    MergedShipments,
    Shipments,
    ShippingMethods,
} from '../types/checkout';
import { Order } from '../types/cart';

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
): Promise<boolean> {
    try {
        const response = await axios.post('/api/updateAddress', {
            token: accessToken,
            id,
            personalDetails,
            isShipping,
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

export async function getShipments(accessToken: string, orderId: string): Promise<Shipments | null> {
    try {
        const response = await axios.post('/api/getShipments', {
            token: accessToken,
            id: orderId,
        });

        if (response) {
            const shipments: any[] | null = get(response, 'data.shipments', null);
            const included: any[] | null = get(response, 'data.included', null);

            if (shipments && included) {
                return {
                    shipments: shipments.map((shipment) => shipment.id),
                    shippingMethods: included.map((method) => {
                        const id: string = get(method, 'id', '');
                        const name: string = get(method, 'attributes.name', '');
                        const price_amount_cents: number = get(method, 'attributes.price_amount_cents', 0);
                        const price_amount_float: number = get(method, 'attributes.price_amount_float', 0);
                        const price_amount_for_shipment_cents: number = get(
                            method,
                            'attributes.price_amount_for_shipment_cents',
                            0
                        );
                        const price_amount_for_shipment_float: number = get(
                            method,
                            'attributes.price_amount_for_shipment_float',
                            0
                        );
                        const currency_code: string = get(method, 'attributes.currency_code', '');
                        const formatted_price_amount: string = get(method, 'attributes.formatted_price_amount', '');
                        const formatted_price_amount_for_shipment: string = get(
                            method,
                            'attributes.formatted_price_amount_for_shipment',
                            ''
                        );

                        return {
                            id,
                            name,
                            price_amount_cents,
                            price_amount_float,
                            price_amount_for_shipment_cents,
                            price_amount_for_shipment_float,
                            currency_code,
                            formatted_price_amount,
                            formatted_price_amount_for_shipment,
                        };
                    }),
                };
            } else {
                return null;
            }
        }

        return null;
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
}

export async function getDeliveryLeadTimes(accessToken: string): Promise<DeliveryLeadTimes[] | null> {
    try {
        const response = await axios.post('/api/getDeliveryLeadTimes', {
            token: accessToken,
        });

        if (response) {
            const deliveryLeadTimes: any | null = get(response, 'data.deliveryLeadTimes', null);
            const included: any | null = get(response, 'data.included', null);

            if (deliveryLeadTimes) {
                return deliveryLeadTimes.map((leadTime) => ({
                    id: leadTime.id,
                    minHours: leadTime.attributes.min_hours,
                    maxHours: leadTime.attributes.max_hours,
                    minDays: leadTime.attributes.min_days,
                    maxDays: leadTime.attributes.max_days,
                }));
            } else {
                return null;
            }
        }
    } catch (error) {
        console.log('Error: ', error);
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

export async function getShipment(accessToken: string, shipmentId: string): Promise<ShipmentsWithLineItems | null> {
    try {
        const response = await axios.post('/api/getShipment', {
            token: accessToken,
            shipmentId,
        });

        if (response) {
            const included = get(response, 'data.included', null);
            const method = included ? included.find((include) => include.type === 'shipping_methods') : null;
            const items = included
                ? included
                      .filter((include) => include.type === 'shipment_line_items')
                      .map((item) => item.attributes.sku_code)
                : null;

            if (method && items) {
                const methodId: string = method ? get(method, 'id', '') : '';

                return {
                    shipmentId,
                    methodId,
                    lineItems: items,
                };
            } else {
                return null;
            }
        }
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
}

export async function getLineItem(accessToken: string, id: string): Promise<any | null> {
    try {
        const response = await axios.post('/api/getLineItem', {
            token: accessToken,
            id,
        });

        if (response) {
            const items = get(response, 'data.items', null);

            if (items) {
                return items;
            } else {
                return null;
            }
        }
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
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
