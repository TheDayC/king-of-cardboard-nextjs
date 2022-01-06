import axios from 'axios';
import { FaCcVisa, FaCcMastercard, FaCcPaypal } from 'react-icons/fa';
import { AiFillCreditCard } from 'react-icons/ai';
import { DateTime } from 'luxon';

import { Address, GiftCard, Order, SingleAddress, SingleOrder } from '../types/account';
import {
    parseAsArrayOfCommerceResponse,
    safelyParse,
    parseAsCommerceMeta,
    parseAsString,
    parseAsNumber,
    parseAsCommerceResponse,
    parseAsBoolean,
    parseAsArrayOfLineItemRelationships,
} from './parsers';
import { AddressResponse, CommerceLayerResponse } from '../types/api';
import { authClient } from './auth';
import { errorHandler } from '../middleware/errors';
import { SocialMedia } from '../types/profile';

export async function getOrders(
    accessToken: string,
    emailAddress: string,
    pageSize: number,
    page: number
): Promise<Order[]> {
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
        const orders = safelyParse(res, 'data.data', parseAsArrayOfCommerceResponse, []);
        const included = safelyParse(res, 'data.included', parseAsArrayOfCommerceResponse, []);

        return orders.map((order) => {
            const lineItems = safelyParse(
                order,
                'relationships.line_items.data',
                parseAsArrayOfLineItemRelationships,
                []
            );

            return {
                number: safelyParse(order, 'attributes.number', parseAsNumber, 0),
                status: safelyParse(order, 'attributes.status', parseAsString, 'draft'),
                payment_status: safelyParse(order, 'attributes.payment_status', parseAsString, 'unpaid'),
                fulfillment_status: safelyParse(order, 'attributes.fulfillment_status', parseAsString, 'unfulfilled'),
                skus_count: safelyParse(order, 'attributes.skus_count', parseAsNumber, 0),
                shipments_count: safelyParse(order, 'attributes.shipments_count', parseAsNumber, 0),
                formatted_total_amount_with_taxes: safelyParse(
                    order,
                    'attributes.formatted_total_amount_with_taxes',
                    parseAsString,
                    ''
                ),
                placed_at: safelyParse(order, 'attributes.placed_at', parseAsString, ''),
                updated_at: safelyParse(order, 'attributes.updated_at', parseAsString, ''),
                lineItems: lineItems.map((lineItem) => {
                    const includedLineItem = included.filter((include) => include.id === lineItem.id);

                    return {
                        ...lineItem,
                        sku_code: safelyParse(includedLineItem, 'attributes.sku_code', parseAsString, ''),
                        quantity: safelyParse(includedLineItem, 'attributes.quantity', parseAsNumber, 0),
                        image_url: safelyParse(includedLineItem, 'attributes.image_url', parseAsString, ''),
                    };
                }),
            };
        });
    } catch (error: unknown) {
        errorHandler(error, 'We could not get historical orders.');
    }

    return [];
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
        const filters = `filter[q][number_eq]=${orderNumber}`;
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
        const order = safelyParse(res, 'data.data', parseAsArrayOfCommerceResponse, [])[0];
        const included = safelyParse(res, 'data.included', parseAsArrayOfCommerceResponse, []);

        const shippingAddressId = safelyParse(order, 'relationships.shipping_address.data.id', parseAsString, '');
        const shippingAddressInclude = included.find(
            (include) => include.type === 'addresses' && include.id === shippingAddressId
        );
        const billingAddressId = safelyParse(order, 'relationships.billing_address.data.id', parseAsString, '');
        const billingAddressInclude = included.find(
            (include) => include.type === 'addresses' && include.id === billingAddressId
        );
        const includedLineItems = included.filter((include) =>
            safelyParse(include, 'attributes.sku_code', parseAsString, null)
        );

        return {
            status: safelyParse(order, 'attributes.status', parseAsString, 'draft'),
            payment_status: safelyParse(order, 'attributes.payment_status', parseAsString, 'unpaid'),
            fulfillment_status: safelyParse(order, 'attributes.fulfillment_status', parseAsString, 'unfulfilled'),
            skus_count: safelyParse(order, 'attributes.skus_count', parseAsNumber, 0),
            shipments_count: safelyParse(order, 'attributes.shipments_count', parseAsNumber, 0),
            formatted_subtotal_amount: safelyParse(order, 'attributes.formatted_subtotal_amount', parseAsString, ''),
            formatted_shipping_amount: safelyParse(order, 'attributes.formatted_shipping_amount', parseAsString, ''),
            formatted_discount_amount: safelyParse(order, 'attributes.formatted_discount_amount', parseAsString, ''),
            formatted_total_amount: safelyParse(order, 'attributes.formatted_total_amount', parseAsString, ''),
            placed_at: safelyParse(order, 'attributes.placed_at', parseAsString, ''),
            updated_at: safelyParse(order, 'attributes.updated_at', parseAsString, ''),
            payment_method_details: {
                brand: safelyParse(
                    order,
                    'attributes.payment_source_details.payment_method_details.brand',
                    parseAsString,
                    ''
                ),
                checks: {
                    address_line1_check: safelyParse(
                        order,
                        'attributes.payment_source_details.payment_method_details.checks.address_line1_check',
                        parseAsString,
                        ''
                    ),
                    address_postal_code_check: safelyParse(
                        order,
                        'attributes.payment_source_details.payment_method_details.checks.address_postal_code_check',
                        parseAsString,
                        ''
                    ),
                    cvc_check: safelyParse(
                        order,
                        'attributes.payment_source_details.payment_method_details.checks.cvc_check',
                        parseAsString,
                        ''
                    ),
                },
                country: safelyParse(
                    order,
                    'attributes.payment_source_details.payment_method_details.country',
                    parseAsString,
                    ''
                ),
                exp_month: safelyParse(
                    order,
                    'attributes.payment_source_details.payment_method_details.exp_month',
                    parseAsNumber,
                    0
                ),
                exp_year: safelyParse(
                    order,
                    'attributes.payment_source_details.payment_method_details.exp_year',
                    parseAsNumber,
                    0
                ),
                fingerprint: safelyParse(
                    order,
                    'attributes.payment_source_details.payment_method_details.fingerprint',
                    parseAsString,
                    ''
                ),
                funding: safelyParse(
                    order,
                    'attributes.payment_source_details.payment_method_details.funding',
                    parseAsString,
                    ''
                ),
                generated_from: safelyParse(
                    order,
                    'attributes.payment_source_details.payment_method_details.generated_from',
                    parseAsString,
                    ''
                ),
                last4: safelyParse(
                    order,
                    'attributes.payment_source_details.payment_method_details.last4',
                    parseAsString,
                    ''
                ),
            },
            shipping_address: {
                first_name: safelyParse(shippingAddressInclude, 'attributes.first_name', parseAsString, 'draft'),
                last_name: safelyParse(shippingAddressInclude, 'attributes.last_name', parseAsString, 'draft'),
                company: safelyParse(shippingAddressInclude, 'attributes.company', parseAsString, 'draft'),
                line_1: safelyParse(shippingAddressInclude, 'attributes.line_1', parseAsString, 'draft'),
                line_2: safelyParse(shippingAddressInclude, 'attributes.line_2', parseAsString, 'draft'),
                city: safelyParse(shippingAddressInclude, 'attributes.city', parseAsString, 'draft'),
                zip_code: safelyParse(shippingAddressInclude, 'attributes.zip_code', parseAsString, 'draft'),
                state_code: safelyParse(shippingAddressInclude, 'attributes.state_code', parseAsString, 'draft'),
                country_code: safelyParse(shippingAddressInclude, 'attributes.country_code', parseAsString, 'draft'),
                phone: safelyParse(shippingAddressInclude, 'attributes.phone', parseAsString, 'draft'),
            },
            billing_address: {
                first_name: safelyParse(billingAddressInclude, 'attributes.first_name', parseAsString, 'draft'),
                last_name: safelyParse(billingAddressInclude, 'attributes.last_name', parseAsString, 'draft'),
                company: safelyParse(billingAddressInclude, 'attributes.company', parseAsString, 'draft'),
                line_1: safelyParse(billingAddressInclude, 'attributes.line_1', parseAsString, 'draft'),
                line_2: safelyParse(billingAddressInclude, 'attributes.line_2', parseAsString, 'draft'),
                city: safelyParse(billingAddressInclude, 'attributes.city', parseAsString, 'draft'),
                zip_code: safelyParse(billingAddressInclude, 'attributes.zip_code', parseAsString, 'draft'),
                state_code: safelyParse(billingAddressInclude, 'attributes.state_code', parseAsString, 'draft'),
                country_code: safelyParse(billingAddressInclude, 'attributes.country_code', parseAsString, 'draft'),
                phone: safelyParse(billingAddressInclude, 'attributes.phone', parseAsString, 'draft'),
            },
            lineItems: includedLineItems.map((lineItem) => {
                const skuItem = included.filter((include) => include.id === lineItem.id)[0];

                return {
                    lineItemId: safelyParse(lineItem, 'id', parseAsString, ''),
                    skuId: safelyParse(skuItem, 'id', parseAsString, ''),
                    name: safelyParse(skuItem, 'name', parseAsString, ''),
                    skuCode: safelyParse(skuItem, 'attributes.sku_code', parseAsString, ''),
                    imageUrl: safelyParse(skuItem, 'image_url', parseAsString, ''),
                    quantity: safelyParse(lineItem, 'attributes.quantity', parseAsNumber, 0),
                    amount: safelyParse(skuItem, 'amount', parseAsString, ''),
                    compareAmount: safelyParse(skuItem, 'compare_amount', parseAsString, ''),
                };
            }),
        };
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

export async function getAddresses(accessToken: string, emailAddress: string): Promise<Address[]> {
    try {
        const cl = authClient(accessToken);
        const include = 'include=address';
        const filters = `filter[q][email_eq]=${emailAddress}`;
        const fields = `fields[customer_addresses]=id,reference&fields[addresses]=full_address`;
        const res = await cl.get(`/api/customer_addresses?${filters}&${include}&${fields}`);
        const addresses = safelyParse(res, 'data.data', parseAsArrayOfCommerceResponse, []);
        const included = safelyParse(res, 'data.included', parseAsArrayOfCommerceResponse, []);

        return addresses.map((address, i) => ({
            id: safelyParse(address, 'id', parseAsString, ''),
            name: safelyParse(address, 'attributes.reference', parseAsString, '[NO NAME FOUND]'),
            full_address: safelyParse(included[i], 'attributes.full_address', parseAsString, ''),
        }));
    } catch (error: unknown) {
        errorHandler(error, 'We could not fetch your saved addresses.');
    }

    return [];
}

export async function getAddressPageCount(accessToken: string, emailAddress: string): Promise<number> {
    try {
        const include = 'address';
        const filters = `filter[q][email_eq]=${emailAddress}`;
        const cl = authClient(accessToken);
        const res = await cl.get(`/api/customer_addresses?${filters}&include=${include}`);

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
        const response = await axios.post('/api/account/requestPasswordReset', {
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
        const status = safelyParse(res, 'response.status', parseAsNumber, 500);

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
        const status = safelyParse(res, 'response.status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        errorHandler(error, 'We could not reset your password.');
    }

    return false;
}

export async function updateUsername(emailAddress: string, username: string): Promise<boolean> {
    try {
        const res = await axios.post('/api/account/updateUsername', {
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
        const res = await axios.post('/api/account/getSocialMedia', { emailAddress });

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
        const res = await axios.post('/api/account/updateSocialMedia', {
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
