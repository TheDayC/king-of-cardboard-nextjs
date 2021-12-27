/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types */
import { Counties } from '../enums/checkout';
import { CustomerDetails } from '../store/types/state';
import { Order } from '../types/cart';
import {
    isString,
    isNumber,
    isBoolean,
    isArray,
    isSocialMedia,
    isCommerceResponse,
    isCommerceResponseArray,
    isArrayOfStrings,
    isAttributes,
    isEnumMember,
    isCommerceMeta,
    isArrayOfLineItemRelationships,
    isHistoricalAddress,
    isPaymentMethodDetails,
    isAxiosError,
    isObjective,
    isArrayOfObjectives,
    isArrayOfAchievements,
    isCommerceLayerError,
    isArrayofCommerceLayerErrors,
    isImageCollection,
    isImageItem,
    isSkuInventory,
    isSkuOption,
    isArrayofSkuOptions,
    isOrder,
    isItem,
    isArrayofItems,
    isCustomerDetails,
} from './typeguards';
import { ITypeGuard, IParser } from '../types/parsers';
import { Slugs } from '../enums/account';

export function parseOrderData(order: any, included: any): Order | null {
    if (order !== null) {
        const id = safelyParse(order, 'id', parseAsString, '');
        const orderNumber = safelyParse(order, 'attributes.number', parseAsNumber, 0);
        const sku_count = safelyParse(order, 'attributes.sku_count', parseAsNumber, 0);
        const formatted_subtotal_amount = safelyParse(
            order,
            'attributes.formatted_subtotal_amount',
            parseAsString,
            '£0.00'
        );
        const formatted_discount_amount = safelyParse(
            order,
            'attributes.formatted_discount_amount',
            parseAsString,
            '£0.00'
        );
        const formatted_shipping_amount = safelyParse(
            order,
            'attributes.formatted_shipping_amount',
            parseAsString,
            '£0.00'
        );
        const formatted_total_tax_amount = safelyParse(
            order,
            'attributes.formatted_total_tax_amount',
            parseAsString,
            '£0.00'
        );
        const formatted_gift_card_amount = safelyParse(
            order,
            'attributes.formatted_gift_card_amount',
            parseAsString,
            '£0.00'
        );
        const formatted_total_amount_with_taxes = safelyParse(
            order,
            'attributes.formatted_total_amount_with_taxes',
            parseAsString,
            '£0.00'
        );
        const status = safelyParse(order, 'attributes.status', parseAsString, 'draft');
        const payment_status = safelyParse(order, 'attributes.payment_status', parseAsString, 'unpaid');
        const fulfillment_status = safelyParse(order, 'attributes.fulfillment_status', parseAsString, 'unfulfilled');
        const line_items = safelyParse(order, 'attributes.line_items', parseAsArrayOfStrings, [] as string[]);

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
            status,
            payment_status,
            fulfillment_status,
            line_items,
            included: included
                ? included.map((include: unknown) => {
                      const id = safelyParse(include, 'id', parseAsString, '');
                      const type = safelyParse(include, 'type', parseAsString, '');
                      const attributes = safelyParse(include, 'attributes', parseAsAttributes, null);

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
    const firstName = safelyParse(data, 'firstName', parseAsString, null);
    const lastName = safelyParse(data, 'lastName', parseAsString, null);
    const company = safelyParse(data, 'company', parseAsString, null);
    const email = safelyParse(data, 'email', parseAsString, null);
    const phone = safelyParse(data, 'phone', parseAsString, null);
    const addressLineOne = safelyParse(data, 'billingAddressLineOne', parseAsString, null);
    const addressLineTwo = safelyParse(data, 'billingAddressLineTwo', parseAsString, null);
    const city = safelyParse(data, 'billingCity', parseAsString, null);
    const postcode = safelyParse(data, 'billingPostcode', parseAsString, null);
    const county = safelyParse(data, 'billingCounty', parseAsCounties, null);

    const shippingAddressLineOne = allowShipping
        ? safelyParse(data, 'shippingAddressLineOne', parseAsString, null)
        : addressLineOne;
    const shippingAddressLineTwo = allowShipping
        ? safelyParse(data, 'shippingAddressLineTwo', parseAsString, null)
        : addressLineTwo;
    const shippingCity = allowShipping ? safelyParse(data, 'shippingCity', parseAsString, null) : city;
    const shippingPostcode = allowShipping ? safelyParse(data, 'shippingPostcode', parseAsString, null) : postcode;
    const shippingCounty = allowShipping ? safelyParse(data, 'shippingCounty', parseAsCounties, null) : county;

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
export const parseAsArrayOfStrings = parseAsType(isArrayOfStrings);
export const parseAsSocialMedia = parseAsType(isSocialMedia);
export const parseAsCommerceResponse = parseAsType(isCommerceResponse);
export const parseAsCommerceResponseArray = parseAsType(isCommerceResponseArray);
export const parseAsCommerceMeta = parseAsType(isCommerceMeta);
export const parseAsAttributes = parseAsType(isAttributes);
export const parseAsCounties = parseAsType(isEnumMember(Counties));
export const parseAsArrayOfLineItemRelationships = parseAsType(isArrayOfLineItemRelationships);
export const parseAsHistoricalAddress = parseAsType(isHistoricalAddress);
export const parseAsPaymentMethodDetails = parseAsType(isPaymentMethodDetails);
export const parseAsAxiosError = parseAsType(isAxiosError);
export const parseAsObjective = parseAsType(isObjective);
export const parseAsArrayOfObjectives = parseAsType(isArrayOfObjectives);
export const parseAsArrayOfAchievements = parseAsType(isArrayOfAchievements);
export const parseAsCommerceLayerError = parseAsType(isCommerceLayerError);
export const parseAsArrayOfCommerceLayerErrors = parseAsType(isArrayofCommerceLayerErrors);
export const parseAsSlug = parseAsType(isEnumMember(Slugs));
export const parseAsImageCollection = parseAsType(isImageCollection);
export const parseAsImageItem = parseAsType(isImageItem);
export const parseAsSkuInventory = parseAsType(isSkuInventory);
export const parseAsSkuOption = parseAsType(isSkuOption);
export const parseAsArrayOfSkuOptions = parseAsType(isArrayofSkuOptions);
export const parseAsOrder = parseAsType(isOrder);
export const parseAsItem = parseAsType(isItem);
export const parseAsArrayOfItems = parseAsType(isArrayofItems);
export const parseAsCustomerDetails = parseAsType(isCustomerDetails);
