import axios from 'axios';
import { FaCcVisa, FaCcMastercard, FaCcPaypal } from 'react-icons/fa';
import { AiFillCreditCard } from 'react-icons/ai';
import { DateTime } from 'luxon';

import { GetOrders } from '../types/account';
import {
    parseAsArrayOfCommerceResponse,
    safelyParse,
    parseAsCommerceMeta,
    parseAsString,
    parseAsNumber,
    parseAsCommerceResponse,
    parseAsBoolean,
} from './parsers';
import { AddressResponse, CommerceLayerResponse, ErrorResponse } from '../types/api';
import { authClient } from './auth';
import { errorHandler } from '../middleware/errors';

export async function getHistoricalOrders(
    accessToken: string,
    emailAddress: string,
    pageSize: number,
    page: number
): Promise<GetOrders | ErrorResponse | ErrorResponse[]> {
    try {
        const filters = `filter[q][email_eq]=${emailAddress}&filter[q][status_not_in]=draft,pending`;
        const pagination = `page[size]=${pageSize}&page[number]=${page}`;
        const sort = 'sort=-created_at,number';
        const orderFields =
            'fields[orders]=number,status,payment_status,fulfillment_status,skus_count,formatted_total_amount_with_taxes,shipments_count,placed_at,updated_at,line_items';
        const include = 'line_items';
        const lineItemFields = 'fields[line_items]=id,sku_code,image_url,quantity';
        const cl = authClient(accessToken);
        const res = await cl.get(
            `/api/orders?${filters}&${sort}&${pagination}&${orderFields}&include=${include}&${lineItemFields}`
        );

        return {
            orders: safelyParse(res, 'data.data', parseAsArrayOfCommerceResponse, null),
            included: safelyParse(res, 'data.included', parseAsArrayOfCommerceResponse, null),
            meta: safelyParse(res, 'data.meta', parseAsCommerceMeta, null),
        };
    } catch (error: unknown) {
        return errorHandler(error, 'We could not get historical orders.');
    }
}

export async function getHistoricalOrder(
    accessToken: string,
    emailAddress: string,
    orderNumber: string
): Promise<GetOrders | ErrorResponse | ErrorResponse[]> {
    try {
        const filters = `filter[q][number_eq]=${orderNumber}&filter[q][email_eq]=${emailAddress}`;
        const orderFields =
            'fields[orders]=number,status,payment_status,fulfillment_status,skus_count,formatted_total_amount,formatted_subtotal_amount,formatted_shipping_amount,formatted_discount_amount,shipments_count,placed_at,updated_at,line_items,shipping_address,billing_address,payment_source_details';
        const include = 'line_items,shipping_address,billing_address,shipments';
        const lineItemFields = 'fields[line_items]=id,sku_code,image_url,quantity';
        const addressFields =
            'fields[addresses]=id,name,first_name,last_name,company,line_1,line_2,city,zip_code,state_code,country_code,phone';
        const shipmentFields = 'fields[shipments]=id,number,status,formatted_cost_amount';
        const cl = authClient(accessToken);
        const res = await cl.get(
            `/api/orders?${filters}&${orderFields}&include=${include}&${lineItemFields}&${addressFields}&${shipmentFields}`
        );

        return {
            orders: safelyParse(res, 'data.data', parseAsArrayOfCommerceResponse, null),
            included: safelyParse(res, 'data.included', parseAsArrayOfCommerceResponse, null),
            meta: safelyParse(res, 'data.meta', parseAsCommerceMeta, null),
        };
    } catch (error: unknown) {
        return errorHandler(error, 'We could not get historical order.');
    }
}

export function statusColour(status: string): string {
    switch (status) {
        case 'approved':
            return 'green';
        case 'placed':
        case 'pending':
            return 'yellow';
        case 'cancelled':
            return 'red';
        default:
            return 'gray';
    }
}

export function paymentStatusColour(status: string): string {
    switch (status) {
        case 'paid':
            return 'green';
        case 'authorized':
            return 'yellow';
        case 'voided':
        case 'refunded':
            return 'red';
        default:
            return 'gray';
    }
}

export function fulfillmentStatusColour(status: string): string {
    switch (status) {
        case 'fulfilled':
            return 'green';
        case 'in_progress':
            return 'yellow';
        default:
            return 'gray';
    }
}

export function cardLogo(card: string | null): JSX.Element {
    switch (card) {
        case 'visa':
            return <FaCcVisa />;
        case 'mastercard':
            return <FaCcMastercard />;
        case 'paypal':
            return <FaCcPaypal />;
        default:
            return <AiFillCreditCard />;
    }
}

export async function getAddresses(
    accessToken: string,
    emailAddress: string,
    pageSize: number,
    page: number
): Promise<AddressResponse | ErrorResponse | ErrorResponse[]> {
    try {
        const filters = `filter[q][email_eq]=${emailAddress}`;
        const pagination = `page[size]=${pageSize}&page[number]=${page}`;
        const cl = authClient(accessToken);
        const res = await cl.get(`/api/customer_addresses?${filters}&${pagination}`);

        return {
            addresses: safelyParse(res, 'data.data', parseAsArrayOfCommerceResponse, null),
            meta: safelyParse(res, 'data.meta', parseAsCommerceMeta, null),
        };
    } catch (error: unknown) {
        return errorHandler(error, 'We could not fetch your saved addresses.');
    }
}

export async function addAddress(
    accessToken: string,
    emailAddress: string,
    addressLineOne: string,
    addressLineTwo: string,
    city: string,
    company: string,
    county: string,
    firstName: string,
    lastName: string,
    phone: string,
    postcode: string
): Promise<string | ErrorResponse | ErrorResponse[] | null> {
    try {
        const response = await axios.post('/api/account/addAddress', {
            token: accessToken,
            emailAddress,
            addressLineOne,
            addressLineTwo,
            city,
            company,
            county,
            firstName,
            lastName,
            phone,
            postcode,
        });

        return safelyParse(response, 'data.customerAddressId', parseAsString, null);
    } catch (error: unknown) {
        return errorHandler(error, 'We could not fetch your saved addresses.');
    }
}

export async function deleteAddress(
    accessToken: string,
    id: string
): Promise<boolean | ErrorResponse | ErrorResponse[]> {
    try {
        const cl = authClient(accessToken);
        const response = await cl.delete(`/api/customer_addresses/${id}`);

        const status = safelyParse(response, 'status', parseAsNumber, false);

        return status && status === 204 ? true : false;
    } catch (error: unknown) {
        return errorHandler(error, 'We could not delete the selected address.');
    }
}

export async function getAddress(
    accessToken: string,
    id: string
): Promise<CommerceLayerResponse | ErrorResponse | ErrorResponse[] | null> {
    try {
        const cl = authClient(accessToken);
        const response = await cl.get(`/api/addresses/${id}`);

        return safelyParse(response, 'data.data', parseAsCommerceResponse, null);
    } catch (error: unknown) {
        return errorHandler(error, 'We could not delete the selected address.');
    }
}

export async function getCustomerAddress(
    accessToken: string,
    id: string
): Promise<CommerceLayerResponse | ErrorResponse | ErrorResponse[] | null> {
    try {
        const cl = authClient(accessToken);
        const response = await cl.get(`/api/customer_addresses/${id}?include=address`);

        return safelyParse(response, 'data.data', parseAsCommerceResponse, null);
    } catch (error: unknown) {
        return errorHandler(error, 'We could not delete the selected address.');
    }
}

export async function editAddress(
    accessToken: string,
    addressId: string,
    addressLineOne: string,
    addressLineTwo: string,
    city: string,
    company: string,
    county: string,
    firstName: string,
    lastName: string,
    phone: string,
    postcode: string
): Promise<CommerceLayerResponse | ErrorResponse | ErrorResponse[] | null> {
    try {
        const cl = authClient(accessToken);

        const response = await cl.patch(`/api/addresses/${addressId}`, {
            data: {
                type: 'addresses',
                id: addressId,
                attributes: {
                    line_1: addressLineOne,
                    line_2: addressLineTwo,
                    city,
                    company,
                    state_code: county,
                    zip_code: postcode,
                    first_name: firstName,
                    last_name: lastName,
                    phone,
                },
            },
        });

        return safelyParse(response, 'data.data', parseAsCommerceResponse, null);
    } catch (error: unknown) {
        return errorHandler(error, 'We could not get historical order.');
    }
}

export async function requestPasswordReset(
    accessToken: string,
    email: string
): Promise<boolean | ErrorResponse | ErrorResponse[]> {
    try {
        const response = await axios.post('/api/account/requestPasswordReset', {
            token: accessToken,
            email,
        });

        return safelyParse(response, 'data.hasSent', parseAsBoolean, false);
    } catch (error: unknown) {
        return errorHandler(error, 'We could not create a payment source.');
    }
}

export function shouldResetPassword(lastSent: DateTime): boolean {
    const now = DateTime.now().setZone('Europe/London');
    const expiry = lastSent.plus({ seconds: 300 });

    return now >= expiry;
}

export async function updatePassword(
    accessToken: string,
    emailAddress: string,
    password: string
): Promise<boolean | ErrorResponse | ErrorResponse[]> {
    try {
        const cl = authClient(accessToken);
        const customer = await cl.get(`/api/customers/?filter[q][email_eq]=${emailAddress}`);
        const customerRes = safelyParse(customer, 'data.data', parseAsArrayOfCommerceResponse, null);

        if (!customerRes) {
            return false;
        }

        const customerId = customerRes[0].id;

        const res = await cl.patch(`/api/customers/${customerId}`, {
            data: {
                type: 'customers',
                id: customerId,
                attributes: {
                    password,
                },
            },
        });
        const status = safelyParse(res, 'response.status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        return errorHandler(error, 'We could not create a payment source.');
    }
}

export async function resetPassword(
    accessToken: string,
    password: string,
    id: string,
    resetToken: string
): Promise<boolean | ErrorResponse | ErrorResponse[]> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.patch(`/api/customer_password_resets/${id}`, {
            data: {
                type: 'customer_password_resets',
                id: id,
                attributes: {
                    customer_password: password,
                    _reset_password_token: resetToken,
                },
            },
        });
        const status = safelyParse(res, 'response.status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        return errorHandler(error, 'We could not create a payment source.');
    }
}
