import axios from 'axios';
import { FaCcVisa, FaCcMastercard, FaCcPaypal } from 'react-icons/fa';
import { AiFillCreditCard } from 'react-icons/ai';
import { DateTime } from 'luxon';
import { join, values } from 'lodash';
import CommerceLayer from '@commercelayer/sdk';

import { Address, GetOrders, GiftCard, SingleAddress, SingleOrder } from '../types/account';
import {
    parseAsArrayOfCommerceResponse,
    safelyParse,
    parseAsString,
    parseAsNumber,
    parseAsCommerceResponse,
    parseAsBoolean,
} from './parsers';
import { CommerceLayerResponse } from '../types/api';
import { authClient } from './auth';
import { errorHandler } from '../middleware/errors';
import { SocialMedia } from '../types/profile';

export async function getOrders(
    accessToken: string,
    userToken: string,
    userId: string,
    pageSize: number,
    pageNumber: number
): Promise<GetOrders> {
    try {
        const cl = CommerceLayer({
            organization: process.env.NEXT_PUBLIC_ECOM_SLUG || '',
            accessToken: userToken,
        });

        const customer = await cl.customers.retrieve(userId, {
            fields: { customers: ['id', 'orders'], orders: ['id'] },
            include: ['orders'],
        });

        if (!customer.orders) {
            return {
                orders: [],
                count: 1,
            };
        }

        const orderIds = customer.orders.map((order) => order.id);

        if (orderIds.length <= 0) {
            return {
                orders: [],
                count: 0,
            };
        }

        const orderRes = await cl.orders.list(
            {
                filters: {
                    id_in: join(orderIds, ','),
                    status_not_eq: 'draft',
                },
                fields: {
                    orders: [
                        'id',
                        'number',
                        'status',
                        'payment_status',
                        'fulfillment_status',
                        'skus_count',
                        'shipments_count',
                        'formatted_total_amount_with_taxes',
                        'placed_at',
                        'updated_at',
                    ],
                },
                sort: {
                    created_at: 'desc',
                    number: 'desc',
                },
                pageNumber,
                pageSize,
            },
            {
                organization: process.env.NEXT_PUBLIC_ECOM_SLUG || '',
                accessToken,
            }
        );

        const { meta, ...ordersAsObj } = orderRes;
        const orders = values(ordersAsObj);

        return {
            orders: orders.map((order) => ({
                number: safelyParse(order, 'number', parseAsNumber, 0),
                status: safelyParse(order, 'status', parseAsString, 'draft'),
                payment_status: safelyParse(order, 'payment_status', parseAsString, 'unpaid'),
                fulfillment_status: safelyParse(order, 'fulfillment_status', parseAsString, 'unfulfilled'),
                skus_count: safelyParse(order, 'skus_count', parseAsNumber, 0),
                shipments_count: safelyParse(order, 'attributes.shipments_count', parseAsNumber, 0),
                formatted_total_amount_with_taxes: safelyParse(
                    order,
                    'formatted_total_amount_with_taxes',
                    parseAsString,
                    ''
                ),
                placed_at: safelyParse(order, 'placed_at', parseAsString, ''),
                updated_at: safelyParse(order, 'updated_at', parseAsString, ''),
                lineItems: [],
            })),
            count: meta.pageCount,
        };
    } catch (error: unknown) {
        errorHandler(error, 'We could not get historical orders.');
    }

    return {
        orders: [],
        count: 1,
    };
}

export async function getOrderPageCount(accessToken: string, emailAddress: string): Promise<number> {
    try {
        const filters = `filter[q][email_eq]=${emailAddress}&filter[q][status_not_in]=draft,pending`;
        const sort = 'sort=-created_at,number';
        const orderFields = 'fields[orders]=number';
        const cl = authClient(accessToken);
        const res = await cl.get(`/api/orders?${filters}&${sort}&${orderFields}`);

        return safelyParse(res, 'data.meta.page_count', parseAsNumber, 1);
    } catch (error: unknown) {
        errorHandler(error, 'Failed to get order page count.');
    }

    return 1;
}

export async function getOrder(accessToken: string, orderNumber: string): Promise<SingleOrder> {
    try {
        const cl = CommerceLayer({
            organization: process.env.NEXT_PUBLIC_ECOM_SLUG || '',
            accessToken: accessToken,
        });

        const orderRes = await cl.orders.list({
            filters: {
                number_eq: orderNumber,
            },
            fields: {
                orders: ['id'],
            },
        });

        const listedOrder = orderRes.first();

        if (listedOrder) {
            const order = await cl.orders.retrieve(listedOrder.id, {
                fields: {
                    orders: [
                        'id',
                        'number',
                        'status',
                        'payment_status',
                        'fulfillment_status',
                        'skus_count',
                        'formatted_total_amount',
                        'formatted_subtotal_amount',
                        'formatted_shipping_amount',
                        'formatted_discount_amount',
                        'shipments_count',
                        'placed_at',
                        'updated_at',
                        'line_items',
                        'shipping_address',
                        'billing_address',
                        'payment_source_details',
                    ],
                    line_items: ['id', 'sku_code', 'image_url', 'quantity', 'name', 'formatted_total_amount'],
                    addresses: [
                        'id',
                        'name',
                        'first_name',
                        'last_name',
                        'company',
                        'line_1',
                        'line_2',
                        'city',
                        'zip_code',
                        'state_code',
                        'country_code',
                        'phone',
                    ],
                },
                include: ['line_items', 'shipping_address', 'billing_address', 'shipments'],
            });

            const filteredLineItems = order.line_items
                ? order.line_items.filter((lineItem) => !!lineItem.sku_code) || []
                : [];
            return {
                status: safelyParse(order, 'status', parseAsString, 'draft'),
                payment_status: safelyParse(order, 'payment_status', parseAsString, 'unpaid'),
                fulfillment_status: safelyParse(order, 'fulfillment_status', parseAsString, 'unfulfilled'),
                skus_count: safelyParse(order, 'skus_count', parseAsNumber, 0),
                shipments_count: safelyParse(order, 'shipments_count', parseAsNumber, 0),
                formatted_subtotal_amount: safelyParse(order, 'formatted_subtotal_amount', parseAsString, ''),
                formatted_shipping_amount: safelyParse(order, 'formatted_shipping_amount', parseAsString, ''),
                formatted_discount_amount: safelyParse(order, 'formatted_discount_amount', parseAsString, ''),
                formatted_total_amount: safelyParse(order, 'formatted_total_amount', parseAsString, ''),
                placed_at: safelyParse(order, 'placed_at', parseAsString, ''),
                updated_at: safelyParse(order, 'updated_at', parseAsString, ''),
                payment_method_details: {
                    brand: safelyParse(order, 'payment_source_details.payment_method_details.brand', parseAsString, ''),
                    checks: {
                        address_line1_check: safelyParse(
                            order,
                            'payment_source_details.payment_method_details.checks.address_line1_check',
                            parseAsString,
                            ''
                        ),
                        address_postal_code_check: safelyParse(
                            order,
                            'payment_source_details.payment_method_details.checks.address_postal_code_check',
                            parseAsString,
                            ''
                        ),
                        cvc_check: safelyParse(
                            order,
                            'payment_source_details.payment_method_details.checks.cvc_check',
                            parseAsString,
                            ''
                        ),
                    },
                    country: safelyParse(
                        order,
                        'payment_source_details.payment_method_details.country',
                        parseAsString,
                        ''
                    ),
                    exp_month: safelyParse(
                        order,
                        'payment_source_details.payment_method_details.exp_month',
                        parseAsNumber,
                        0
                    ),
                    exp_year: safelyParse(
                        order,
                        'payment_source_details.payment_method_details.exp_year',
                        parseAsNumber,
                        0
                    ),
                    fingerprint: safelyParse(
                        order,
                        'payment_source_details.payment_method_details.fingerprint',
                        parseAsString,
                        ''
                    ),
                    funding: safelyParse(
                        order,
                        'payment_source_details.payment_method_details.funding',
                        parseAsString,
                        ''
                    ),
                    generated_from: safelyParse(
                        order,
                        'payment_source_details.payment_method_details.generated_from',
                        parseAsString,
                        ''
                    ),
                    last4: safelyParse(order, 'payment_source_details.payment_method_details.last4', parseAsString, ''),
                },
                shipping_address: {
                    first_name: safelyParse(order, 'shipping_address.first_name', parseAsString, 'draft'),
                    last_name: safelyParse(order, 'shipping_address.last_name', parseAsString, 'draft'),
                    company: safelyParse(order, 'shipping_address.company', parseAsString, 'draft'),
                    line_1: safelyParse(order, 'shipping_address.line_1', parseAsString, 'draft'),
                    line_2: safelyParse(order, 'shipping_address.line_2', parseAsString, 'draft'),
                    city: safelyParse(order, 'shipping_address.city', parseAsString, 'draft'),
                    zip_code: safelyParse(order, 'shipping_address.zip_code', parseAsString, 'draft'),
                    state_code: safelyParse(order, 'shipping_address.state_code', parseAsString, 'draft'),
                    country_code: safelyParse(order, 'shipping_address.country_code', parseAsString, 'draft'),
                    phone: safelyParse(order, 'shipping_address.phone', parseAsString, 'draft'),
                },
                billing_address: {
                    first_name: safelyParse(order, 'billing_address.first_name', parseAsString, 'draft'),
                    last_name: safelyParse(order, 'billing_address.last_name', parseAsString, 'draft'),
                    company: safelyParse(order, 'billing_address.company', parseAsString, 'draft'),
                    line_1: safelyParse(order, 'billing_address.line_1', parseAsString, 'draft'),
                    line_2: safelyParse(order, 'billing_address.line_2', parseAsString, 'draft'),
                    city: safelyParse(order, 'billing_address.city', parseAsString, 'draft'),
                    zip_code: safelyParse(order, 'billing_address.zip_code', parseAsString, 'draft'),
                    state_code: safelyParse(order, 'billing_address.state_code', parseAsString, 'draft'),
                    country_code: safelyParse(order, 'billing_address.country_code', parseAsString, 'draft'),
                    phone: safelyParse(order, 'billing_address.phone', parseAsString, 'draft'),
                },
                lineItems: filteredLineItems.map((lineItem) => {
                    return {
                        lineItemId: safelyParse(lineItem, 'id', parseAsString, ''),
                        name: safelyParse(lineItem, 'name', parseAsString, ''),
                        skuCode: safelyParse(lineItem, 'sku_code', parseAsString, ''),
                        imageUrl: safelyParse(lineItem, 'image_url', parseAsString, ''),
                        quantity: safelyParse(lineItem, 'quantity', parseAsNumber, 0),
                        amount: safelyParse(lineItem, 'formatted_total_amount', parseAsString, ''),
                    };
                }),
            };
        }
    } catch (error: unknown) {
        errorHandler(error, 'Failed to get historical order.');
    }

    return {
        status: '',
        payment_status: '',
        fulfillment_status: '',
        skus_count: 0,
        shipments_count: 0,
        formatted_subtotal_amount: '',
        formatted_shipping_amount: '',
        formatted_discount_amount: '',
        formatted_total_amount: '',
        placed_at: '',
        updated_at: '',
        payment_method_details: {
            brand: '',
            checks: {
                address_line1_check: '',
                address_postal_code_check: '',
                cvc_check: '',
            },
            country: '',
            exp_month: 0,
            exp_year: 0,
            fingerprint: '',
            funding: '',
            generated_from: '',
            last4: '',
        },
        shipping_address: {
            first_name: '',
            last_name: '',
            company: '',
            line_1: '',
            line_2: '',
            city: '',
            zip_code: '',
            state_code: '',
            country_code: '',
            phone: '',
        },
        billing_address: {
            first_name: '',
            last_name: '',
            company: '',
            line_1: '',
            line_2: '',
            city: '',
            zip_code: '',
            state_code: '',
            country_code: '',
            phone: '',
        },
        lineItems: [],
    };
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

export async function getAddresses(accessToken: string): Promise<Address[]> {
    try {
        const cl = authClient(accessToken);

        const fields = `fields[customer_addresses]=id,reference&fields[addresses]=full_address`;
        const res = await cl.get(`/api/customer_addresses?include=address&${fields}`);
        const addresses = safelyParse(res, 'data.data', parseAsArrayOfCommerceResponse, []);
        const included = safelyParse(res, 'data.included', parseAsArrayOfCommerceResponse, []);

        return addresses.map((address, i) => ({
            id: safelyParse(address, 'id', parseAsString, ''),
            addressId: safelyParse(included[i], 'id', parseAsString, ''),
            name: safelyParse(address, 'attributes.reference', parseAsString, '[NO NAME FOUND]'),
            full_address: safelyParse(included[i], 'attributes.full_address', parseAsString, ''),
        }));
    } catch (error: unknown) {
        errorHandler(error, 'We could not fetch your saved addresses.');
    }

    return [];
}

export async function getAddressPageCount(accessToken: string): Promise<number> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.get(`/api/customer_addresses?include=address`);

        return safelyParse(res, 'data.meta.page_count', parseAsNumber, 1);
    } catch (error: unknown) {
        errorHandler(error, 'We could not fetch the address page count.');
    }

    return 0;
}

export async function addAddress(
    accessToken: string,
    emailAddress: string,
    name: string,
    addressLineOne: string,
    addressLineTwo: string,
    city: string,
    company: string,
    county: string,
    firstName: string,
    lastName: string,
    phone: string,
    postcode: string
): Promise<boolean> {
    try {
        const cl = authClient(accessToken);
        const customer = await cl.get(`/api/customers/?filter[q][email_eq]=${emailAddress}`);
        const customerRes = safelyParse(customer, 'data.data', parseAsArrayOfCommerceResponse, [])[0];

        const customerId = safelyParse(customerRes, 'id', parseAsString, null);

        if (!customerId) return false;

        const addressRes = await cl.post('/api/addresses', {
            data: {
                type: 'addresses',
                attributes: {
                    reference: name,
                    first_name: firstName,
                    last_name: lastName,
                    company,
                    line_1: addressLineOne,
                    line_2: addressLineTwo,
                    city,
                    zip_code: postcode,
                    state_code: county,
                    country_code: 'GB',
                    phone,
                    email: emailAddress,
                },
            },
        });
        const addressId = safelyParse(addressRes, 'data.data.id', parseAsString, null);

        const res = await cl.post('/api/customer_addresses', {
            data: {
                type: 'customer_addresses',
                relationships: {
                    customer: {
                        data: {
                            type: 'customers',
                            id: customerId,
                        },
                    },
                    address: {
                        data: {
                            type: 'addresses',
                            id: addressId,
                        },
                    },
                },
            },
        });

        const status = safelyParse(res, 'status', parseAsNumber, false);

        return status === 201;
    } catch (error: unknown) {
        errorHandler(error, 'Failed to create address.');
    }

    return false;
}

export async function deleteAddress(accessToken: string, id: string): Promise<boolean> {
    try {
        const cl = authClient(accessToken);
        const response = await cl.delete(`/api/customer_addresses/${id}`);

        const status = safelyParse(response, 'status', parseAsNumber, false);

        return status && status === 204 ? true : false;
    } catch (error: unknown) {
        errorHandler(error, 'We could not delete the selected address.');
    }

    return false;
}

export async function getAddress(accessToken: string, id: string): Promise<CommerceLayerResponse | null> {
    try {
        const cl = authClient(accessToken);
        const response = await cl.get(`/api/addresses/${id}`);

        return safelyParse(response, 'data.data', parseAsCommerceResponse, null);
    } catch (error: unknown) {
        errorHandler(error, 'We could not delete the selected address.');
    }

    return null;
}

export async function getCurrentAddress(accessToken: string, id: string): Promise<SingleAddress> {
    try {
        const cl = authClient(accessToken);
        const res = await cl.get(`/api/customer_addresses/${id}?include=address`);

        const address = safelyParse(res, 'data.data', parseAsCommerceResponse, {});
        const included = safelyParse(res, 'data.included', parseAsArrayOfCommerceResponse, [])[0];

        return {
            id: safelyParse(address, 'id', parseAsString, ''),
            addressId: safelyParse(address, 'relationships.address.data.id', parseAsString, ''),
            name: safelyParse(address, 'attributes.reference', parseAsString, ''),
            addressLineOne: safelyParse(included, 'attributes.line_1', parseAsString, ''),
            addressLineTwo: safelyParse(included, 'attributes.line_2', parseAsString, ''),
            city: safelyParse(included, 'attributes.city', parseAsString, ''),
            company: safelyParse(included, 'attributes.company', parseAsString, ''),
            county: safelyParse(included, 'attributes.state_code', parseAsString, ''),
            firstName: safelyParse(included, 'attributes.first_name', parseAsString, ''),
            lastName: safelyParse(included, 'attributes.last_name', parseAsString, ''),
            phone: safelyParse(included, 'attributes.phone', parseAsString, ''),
            postcode: safelyParse(included, 'attributes.zip_code', parseAsString, ''),
        };
    } catch (error: unknown) {
        errorHandler(error, 'We could not delete the selected address.');
    }

    return {
        id: '',
        addressId: '',
        name: '',
        addressLineOne: '',
        addressLineTwo: '',
        city: '',
        company: '',
        county: '',
        firstName: '',
        lastName: '',
        phone: '',
        postcode: '',
    };
}

export async function editAddress(
    accessToken: string,
    id: string,
    addressId: string,
    name: string,
    addressLineOne: string,
    addressLineTwo: string,
    city: string,
    company: string,
    county: string,
    firstName: string,
    lastName: string,
    phone: string,
    postcode: string
): Promise<boolean> {
    try {
        const cl = authClient(accessToken);

        const res = await cl.patch(`/api/addresses/${addressId}`, {
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

        const customerRes = await cl.patch(`/api/customer_addresses/${id}`, {
            data: {
                type: 'customer_addresses',
                id,
                attributes: {
                    reference: name,
                },
            },
        });

        const status = safelyParse(res, 'status', parseAsNumber, 500);
        const customerStatus = safelyParse(customerRes, 'status', parseAsNumber, 500);

        return status === 200 && customerStatus === 200;
    } catch (error: unknown) {
        errorHandler(error, 'We could not get historical order.');
    }

    return false;
}

export async function requestPasswordReset(accessToken: string, email: string): Promise<boolean> {
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/account/requestPasswordReset`, {
            token: accessToken,
            email,
        });

        return safelyParse(response, 'data.hasSent', parseAsBoolean, false);
    } catch (error: unknown) {
        errorHandler(error, 'We could not reset your password.');
    }

    return false;
}

export function shouldResetPassword(lastSent: DateTime): boolean {
    const now = DateTime.now().setZone('Europe/London');
    const expiry = lastSent.plus({ seconds: 300 });

    return now >= expiry;
}

export async function updatePassword(accessToken: string, emailAddress: string, password: string): Promise<boolean> {
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
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        errorHandler(error, 'We could not update your password.');
    }

    return false;
}

export async function resetPassword(
    accessToken: string,
    password: string,
    id: string,
    resetToken: string
): Promise<boolean> {
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
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        errorHandler(error, 'We could not reset your password.');
    }

    return false;
}

export async function updateUsername(emailAddress: string, username: string): Promise<boolean> {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/account/updateUsername`, {
            emailAddress,
            username,
        });

        const status = safelyParse(res, 'response.status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        errorHandler(error, 'Failed to update username.');
    }

    return false;
}

export async function getSocialMedia(emailAddress: string): Promise<SocialMedia> {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/account/getSocialMedia`, {
            emailAddress,
        });

        return {
            instagram: safelyParse(res, 'data.socialMedia.instagram', parseAsString, ''),
            twitter: safelyParse(res, 'data.socialMedia.twitter', parseAsString, ''),
            twitch: safelyParse(res, 'data.socialMedia.twitch', parseAsString, ''),
            youtube: safelyParse(res, 'data.socialMedia.youtube', parseAsString, ''),
            ebay: safelyParse(res, 'data.socialMedia.ebay', parseAsString, ''),
        };
    } catch (error: unknown) {
        errorHandler(error, 'Failed to update social media.');
    }

    return {
        instagram: '',
        twitter: '',
        twitch: '',
        youtube: '',
        ebay: '',
    };
}

export async function updateSocialMedia(
    emailAddress: string,
    instagram: string,
    twitter: string,
    twitch: string,
    youtube: string,
    ebay: string
): Promise<boolean> {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/account/updateSocialMedia`, {
            emailAddress,
            instagram,
            twitter,
            twitch,
            youtube,
            ebay,
        });

        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        errorHandler(error, 'Failed to update social media.');
    }

    return false;
}

export async function getGiftCard(accessToken: string, emailAddress: string): Promise<GiftCard> {
    try {
        const cl = authClient(accessToken);
        const filters = `filter[q][reference_eq]=${emailAddress}-reward-card&filter[q][status_eq]=active`;
        const res = await cl.get(
            `/api/gift_cards/?${filters}&fields[gift_cards]=id,status,balance_cents,reference,recipient_email,code`
        );
        const giftCard = safelyParse(res, 'data.data', parseAsArrayOfCommerceResponse, [])[0];

        return {
            id: safelyParse(giftCard, 'id', parseAsString, ''),
            status: safelyParse(giftCard, 'attributes.status', parseAsString, ''),
            balance: safelyParse(giftCard, 'attributes.balance_cents', parseAsNumber, 0),
            reference: safelyParse(giftCard, 'attributes.reference', parseAsString, ''),
            recipient_email: safelyParse(giftCard, 'attributes.recipient_email', parseAsString, ''),
            code: safelyParse(giftCard, 'attributes.code', parseAsString, ''),
        };
    } catch (error: unknown) {
        errorHandler(error, 'We could not fetch your gift card details.');
    }

    return {
        id: '',
        status: '',
        balance: 0,
        reference: '',
        recipient_email: '',
        code: '',
    };
}
