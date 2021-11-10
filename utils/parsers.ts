/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types */
import { get } from 'lodash';

import { Counties } from '../enums/checkout';
import { CustomerDetails } from '../store/types/state';
import { Order } from '../types/cart';
import { isString, isNumber, isBoolean, isArray, isSocialMedia } from './typeguards';
import { ITypeGuard, IParser } from '../types/parsers';

export function parseOrderData(order: any, included: any): Order | null {
    if (order !== null) {
        const id: string = get(order, 'id', '');
        const orderNumber: number = get(order, 'attributes.number', 0);
        const sku_count: number = get(order, 'attributes.sku_count', 0);
        const formatted_subtotal_amount: string = get(order, 'attributes.formatted_subtotal_amount', '£0.00');
        const formatted_discount_amount: string = get(order, 'attributes.formatted_discount_amount', '£0.00');
        const formatted_shipping_amount: string = get(order, 'attributes.formatted_shipping_amount', '£0.00');
        const formatted_total_tax_amount: string = get(order, 'attributes.formatted_total_tax_amount', '£0.00');
        const formatted_gift_card_amount: string = get(order, 'attributes.formatted_gift_card_amount', '£0.00');
        const formatted_total_amount_with_taxes: string = get(
            order,
            'attributes.formatted_total_amount_with_taxes',
            '£0.00'
        );
        const line_items: string[] = get(order, 'attributes.line_items', []);

        return {
            id,
            number: orderNumber,
            sku_count,
            formatted_subtotal_amount,
            formatted_discount_amount,
            formatted_shipping_amount,
            formatted_total_tax_amount,
            formatted_gift_card_amount,
            formatted_total_amount_with_taxes,
            line_items,
            included: included
                ? included.map((include: any) => {
                      const id: string = get(include, 'id', '');
                      const type: string = get(include, 'type', '');
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const attributes: any = get(include, 'attributes', null);

                      return {
                          id,
                          type,
                          attributes,
                      };
                  })
                : [],
        };
    }

    return null;
}

export function parseCustomerDetails(data: unknown, allowShipping: boolean): CustomerDetails {
    const firstName: string | null = get(data, 'firstName', null);
    const lastName: string | null = get(data, 'lastName', null);
    const company: string | null = get(data, 'company', null);
    const email: string | null = get(data, 'email', null);
    const phone: string | null = get(data, 'phone', null);
    const addressLineOne: string | null = get(data, 'billingAddressLineOne', null);
    const addressLineTwo: string | null = get(data, 'billingAddressLineTwo', null);
    const city: string | null = get(data, 'billingCity', null);
    const postcode: string | null = get(data, 'billingPostcode', null);
    const county: Counties | null = get(data, 'billingCounty', null);

    const shippingAddressLineOne: string | null = allowShipping
        ? get(data, 'shippingAddressLineOne', null)
        : addressLineOne;
    const shippingAddressLineTwo: string | null = allowShipping
        ? get(data, 'shippingAddressLineTwo', null)
        : addressLineTwo;
    const shippingCity: string | null = allowShipping ? get(data, 'shippingCity', null) : city;
    const shippingPostcode: string | null = allowShipping ? get(data, 'shippingPostcode', null) : postcode;
    const shippingCounty: Counties | null = allowShipping ? get(data, 'shippingCounty', null) : county;

    return {
        firstName,
        lastName,
        company,
        email,
        phone,
        allowShippingAddress: allowShipping,
        addressLineOne,
        addressLineTwo,
        city,
        postcode,
        county,
        shippingAddressLineOne,
        shippingAddressLineTwo,
        shippingCity,
        shippingPostcode,
        shippingCounty,
    };
}

export function safelyParse<T, F>(
    data: unknown,
    property: string,
    parse: IParser<T>,
    fallback: F,
    logErrorOnUndefined: boolean = true
): T | F {
    // Always split properties, first must always exist, spread any leftover.
    const [first, ...chainedProperties] = property.split('.');

    // Make sure data is an object that contains the first property...
    if (typeof data === 'object' && data !== null && Object.prototype.hasOwnProperty.call(data, first)) {
        // ...this gives us our value.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const value = data[first];

        // Recursive call for chaining via dot notation. (e.g. 'firstProp.chainedProp.anotherChainedProp')
        if (chainedProperties.length) {
            return safelyParse(value, chainedProperties.join('.'), parse, fallback, logErrorOnUndefined);
        }

        // Call the passsed parser which will be setup to handle the appropriate type.
        return parse(value, fallback, property, logErrorOnUndefined);
    } else {
        // If the data doesn't meet the criteria above or we have chosen to log errors on undefined then warn the user we fell back.
        if (logErrorOnUndefined && !(typeof data === 'object' && data !== null)) {
            console.warn(`Parser: Cannot access ${property} of ${data}. Returning ${fallback}`);
        }

        // Always deliverf the fallback if we couldn't meet the criteria for parsing.
        return fallback;
    }
}

export function parseAsType<T>(isExpectedType: ITypeGuard<T>): IParser<T> {
    return (value: unknown, fallback: any, property: string = 'unknown', logError: boolean = true) => {
        // Check our typeguard, if acceptable return value else error.
        if (isExpectedType(value)) {
            return value;
        } else {
            // This prevents the errors when the parser expects a string, but fallback is null, meaning it's actually nullable.
            const hasError = logError && value && fallback;

            if (hasError) {
                console.warn(`Parser: ${property}: ${value} is not of expected type. Returning ${fallback}`);
            }

            return fallback;
        }
    };
}

export const parseAsString = parseAsType(isString);
export const parseAsNumber = parseAsType(isNumber);
export const parseAsBoolean = parseAsType(isBoolean);
export const parseAsArray = parseAsType(isArray);
export const parseAsSocialMedia = parseAsType(isSocialMedia);
