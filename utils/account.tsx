import axios, { AxiosError } from 'axios';
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
    parseAsError,
    parseAsAxiosError,
} from './parsers';
import { AddressResponse, CommerceLayerResponse, ErrorResponse } from '../types/api';
import { authClient } from './auth';
import { isAxiosError } from './typeguards';
import { axiosErrorHandler, errorHandler } from '../middleware/errors';

export async function getHistoricalOrders(
    accessToken: string,
    emailAddress: string,
    pageSize: number,
    page: number
): Promise<GetOrders | null> {
    try {
        const response = await axios.post('/api/account/getHistoricalOrders', {
            token: accessToken,
            emailAddress,
            pageSize,
            page,
        });

        if (response) {
            const orders = safelyParse(response, 'data.orders', parseAsArrayOfCommerceResponse, null);
            const included = safelyParse(response, 'data.included', parseAsArrayOfCommerceResponse, null);
            const meta = safelyParse(response, 'data.meta', parseAsCommerceMeta, null);

            return { orders, included, meta };
        }

        return null;
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
}

export async function getHistoricalOrder(
    accessToken: string,
    emailAddress: string,
    orderNumber: string
): Promise<GetOrders | null> {
    try {
        const response = await axios.post('/api/account/getHistoricalOrder', {
            token: accessToken,
            emailAddress,
            orderNumber,
        });

        if (response) {
            const orders = safelyParse(response, 'data.orders', parseAsArrayOfCommerceResponse, null);
            const included = safelyParse(response, 'data.included', parseAsArrayOfCommerceResponse, null);
            const meta = safelyParse(response, 'data.meta', parseAsCommerceMeta, null);

            return { orders, included, meta };
        }

        return null;
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
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
): Promise<AddressResponse | null> {
    try {
        const response = await axios.post('/api/account/getAddresses', {
            token: accessToken,
            emailAddress,
            pageSize,
            page,
        });

        if (response) {
            return {
                addresses: safelyParse(response, 'data.addresses', parseAsArrayOfCommerceResponse, null),
                meta: safelyParse(response, 'data.meta', parseAsCommerceMeta, null),
            };
        }

        return null;
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
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
): Promise<string | null> {
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
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
}

export async function deleteAddress(accessToken: string, id: string): Promise<boolean> {
    try {
        const cl = authClient(accessToken);

        const response = await cl.delete(`/api/customer_addresses/${id}`);
        const status = safelyParse(response, 'status', parseAsNumber, false);

        return status && status === 204 ? true : false;
    } catch (error) {
        console.log('Error: ', error);
    }

    return false;
}

export async function getAddress(accessToken: string, id: string): Promise<CommerceLayerResponse | null> {
    try {
        const cl = authClient(accessToken);

        const response = await cl.get(`/api/addresses/${id}`);
        return safelyParse(response, 'data.data', parseAsCommerceResponse, null);
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
}

export async function getCustomerAddress(accessToken: string, id: string): Promise<CommerceLayerResponse | null> {
    try {
        const cl = authClient(accessToken);

        const response = await cl.get(`/api/customer_addresses/${id}?include=address`);
        return safelyParse(response, 'data.data', parseAsCommerceResponse, null);
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
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
): Promise<CommerceLayerResponse | null> {
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
    } catch (error) {
        console.log('Error: ', error);
    }

    return null;
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
