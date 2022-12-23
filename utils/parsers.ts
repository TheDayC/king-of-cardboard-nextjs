/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types */
import { CustomerAddress } from '../store/types/state';
import {
    isString,
    isNumber,
    isBoolean,
    isArray,
    isSocialMedia,
    isCommerceResponse,
    isCommerceResponseArray,
    isArrayOfStrings,
    isEnumMember,
    isArrayOfLineItemRelationships,
    isArrayOfObjectives,
    isArrayOfAchievements,
    isArrayofCommerceLayerErrors,
    isImageCollection,
    isImageItem,
    isSkuInventory,
    isArrayofSkuOptions,
    isArrayofItems,
    isCustomerDetails,
    isArrayOfContentfulBreaks,
    isArrayOfContentfulPages,
    isArrayOfContentfulProducts,
    isUnknown,
    isArrayOfBreakSlots,
    isCustomerAddress,
    isBreakSlotsCollection,
    isArrayOfDocuments,
    isHero,
    isArrayOfHeroes,
    isContentfulBreak,
    isSliderImage,
    isArrayOfSliderImages,
    isRepeater,
    isArrayOfRepeater,
    isDocument,
    isArrayOfNumbers,
    isFile,
    isInterest,
    isCategory,
    isConfiguration,
    isArrayOfInterests,
    isArrayOfCategories,
    isArrayOfConfigurations,
} from './typeguards';
import { ITypeGuard, IParser } from '../types/parsers';
import { Slugs } from '../enums/account';
import { Roles } from '../enums/auth';

export function parseAddress(data: unknown): CustomerAddress {
    return {
        id: safelyParse(data, 'id', parseAsString, null),
        billing_info:
            safelyParse(data, 'attributes.billing_info', parseAsString, null) ||
            safelyParse(data, 'billing_info', parseAsString, null),
        business:
            safelyParse(data, 'attributes.business', parseAsBoolean, false) ||
            safelyParse(data, 'business', parseAsBoolean, false),
        city:
            safelyParse(data, 'attributes.city', parseAsString, null) || safelyParse(data, 'city', parseAsString, null),
        company:
            safelyParse(data, 'attributes.company', parseAsString, null) ||
            safelyParse(data, 'company', parseAsString, null),
        country_code:
            safelyParse(data, 'attributes.country_code', parseAsString, null) ||
            safelyParse(data, 'country_code', parseAsString, null),
        email:
            safelyParse(data, 'attributes.email', parseAsString, null) ||
            safelyParse(data, 'email', parseAsString, null),
        first_name:
            safelyParse(data, 'attributes.first_name', parseAsString, null) ||
            safelyParse(data, 'first_name', parseAsString, null),
        full_address:
            safelyParse(data, 'attributes.full_address', parseAsString, null) ||
            safelyParse(data, 'full_address', parseAsString, null),
        full_name:
            safelyParse(data, 'attributes.full_name', parseAsString, null) ||
            safelyParse(data, 'full_name', parseAsString, null),
        is_geocoded:
            safelyParse(data, 'attributes.is_geocoded', parseAsBoolean, false) ||
            safelyParse(data, 'is_geocoded', parseAsBoolean, false),
        is_localized:
            safelyParse(data, 'attributes.is_localized', parseAsBoolean, false) ||
            safelyParse(data, 'is_localized', parseAsBoolean, false),
        last_name:
            safelyParse(data, 'attributes.last_name', parseAsString, null) ||
            safelyParse(data, 'last_name', parseAsString, null),
        lat: safelyParse(data, 'attributes.lat', parseAsNumber, null) || safelyParse(data, 'lat', parseAsNumber, null),
        line_1:
            safelyParse(data, 'attributes.line_1', parseAsString, null) ||
            safelyParse(data, 'line_1', parseAsString, null),
        line_2:
            safelyParse(data, 'attributes.line_2', parseAsString, null) ||
            safelyParse(data, 'line_2', parseAsString, null),
        lng: safelyParse(data, 'attributes.lng', parseAsNumber, null) || safelyParse(data, 'lng', parseAsNumber, null),
        map_url:
            safelyParse(data, 'attributes.map_url', parseAsString, null) ||
            safelyParse(data, 'map_url', parseAsString, null),
        name:
            safelyParse(data, 'attributes.name', parseAsString, null) || safelyParse(data, 'name', parseAsString, null),
        notes:
            safelyParse(data, 'attributes.notes', parseAsString, null) ||
            safelyParse(data, 'notes', parseAsString, null),
        phone:
            safelyParse(data, 'attributes.phone', parseAsString, null) ||
            safelyParse(data, 'phone', parseAsString, null),
        provider_name:
            safelyParse(data, 'attributes.provider_name', parseAsString, null) ||
            safelyParse(data, 'provider_name', parseAsString, null),
        reference:
            safelyParse(data, 'attributes.reference', parseAsString, null) ||
            safelyParse(data, 'reference', parseAsString, null),
        reference_origin:
            safelyParse(data, 'attributes.reference_origin', parseAsString, null) ||
            safelyParse(data, 'reference_origin', parseAsString, null),
        state_code:
            safelyParse(data, 'attributes.state_code', parseAsString, null) ||
            safelyParse(data, 'state_code', parseAsString, null),
        static_map_url:
            safelyParse(data, 'attributes.static_map_url', parseAsString, null) ||
            safelyParse(data, 'static_map_url', parseAsString, null),
        zip_code:
            safelyParse(data, 'attributes.zip_code', parseAsString, null) ||
            safelyParse(data, 'zip_code', parseAsString, null),
    };
}

export function parseBillingAddress(data: unknown): Partial<CustomerAddress> {
    return {
        city: safelyParse(data, 'billingCity', parseAsString, null),
        company: safelyParse(data, 'billingCompany', parseAsString, null),
        country_code: safelyParse(data, 'country_code', parseAsString, 'GB'),
        line_1: safelyParse(data, 'billingAddressLineOne', parseAsString, null),
        line_2: safelyParse(data, 'billingAddressLineTwo', parseAsString, null),
        state_code: safelyParse(data, 'billingCounty', parseAsString, null),
        zip_code: safelyParse(data, 'billingPostcode', parseAsString, null),
    };
}

export function parseShippingAddress(data: unknown): Partial<CustomerAddress> {
    return {
        city: safelyParse(data, 'shippingCity', parseAsString, null),
        company: safelyParse(data, 'shippingCompany', parseAsString, null),
        country_code: safelyParse(data, 'country_code', parseAsString, 'GB'),
        line_1: safelyParse(data, 'shippingAddressLineOne', parseAsString, null),
        line_2: safelyParse(data, 'shippingAddressLineTwo', parseAsString, null),
        state_code: safelyParse(data, 'shippingCounty', parseAsString, null),
        zip_code: safelyParse(data, 'shippingPostcode', parseAsString, null),
    };
}

export function parseExistingAddress(data: unknown): Partial<CustomerAddress> {
    return {
        city: safelyParse(data, 'city', parseAsString, null),
        company: safelyParse(data, 'company', parseAsString, null),
        country_code: safelyParse(data, 'country_code', parseAsString, 'GB'),
        line_1: safelyParse(data, 'line_1', parseAsString, null),
        line_2: safelyParse(data, 'line_2', parseAsString, null),
        state_code: safelyParse(data, 'state_code', parseAsString, null),
        zip_code: safelyParse(data, 'zip_code', parseAsString, null),
    };
}

export function safelyParse<T, F>(
    data: unknown,
    property: string,
    parse: IParser<T>,
    fallback: F,
    logErrorOnUndefined: boolean = false
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
    return (value: unknown, fallback: any, property: string = 'unknown', logError: boolean = false) => {
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
export const parseAsUnknown = parseAsType(isUnknown);
export const parseAsFile = parseAsType(isFile);
export const parseAsArrayOfStrings = parseAsType(isArrayOfStrings);
export const parseAsArrayOfNumbers = parseAsType(isArrayOfNumbers);
export const parseAsSocialMedia = parseAsType(isSocialMedia);
export const parseAsCommerceResponse = parseAsType(isCommerceResponse);
export const parseAsArrayOfCommerceResponse = parseAsType(isCommerceResponseArray);
export const parseAsArrayOfLineItemRelationships = parseAsType(isArrayOfLineItemRelationships);
export const parseAsArrayOfObjectives = parseAsType(isArrayOfObjectives);
export const parseAsArrayOfAchievements = parseAsType(isArrayOfAchievements);
export const parseAsArrayOfCommerceLayerErrors = parseAsType(isArrayofCommerceLayerErrors);
export const parseAsSlug = parseAsType(isEnumMember(Slugs));
export const parseAsImageCollection = parseAsType(isImageCollection);
export const parseAsBreakSlotsCollection = parseAsType(isBreakSlotsCollection);
export const parseAsImageItem = parseAsType(isImageItem);
export const parseAsSkuInventory = parseAsType(isSkuInventory);
export const parseAsArrayOfSkuOptions = parseAsType(isArrayofSkuOptions);
export const parseAsArrayOfItems = parseAsType(isArrayofItems);
export const parseAsCustomerDetails = parseAsType(isCustomerDetails);
export const parseAsCustomerAddress = parseAsType(isCustomerAddress);
export const parseAsContentfulBreak = parseAsType(isContentfulBreak);
export const parseAsArrayOfContentfulBreaks = parseAsType(isArrayOfContentfulBreaks);
export const parseAsArrayOfContentfulPages = parseAsType(isArrayOfContentfulPages);
export const parseAsArrayOfContentfulProducts = parseAsType(isArrayOfContentfulProducts);
export const parseAsArrayOfBreakSlots = parseAsType(isArrayOfBreakSlots);
export const parseAsDocument = parseAsType(isDocument);
export const parseAsArrayOfDocuments = parseAsType(isArrayOfDocuments);
export const parseAsHero = parseAsType(isHero);
export const parseAsArrayOfHeroes = parseAsType(isArrayOfHeroes);
export const parseAsSliderImage = parseAsType(isSliderImage);
export const parseAsArrayOfSliderImages = parseAsType(isArrayOfSliderImages);
export const parseAsRepeater = parseAsType(isRepeater);
export const parseAsArrayOfRepeater = parseAsType(isArrayOfRepeater);
export const parseAsRole = parseAsType(isEnumMember(Roles));

// Product enum parsers
export const parseAsInterest = parseAsType(isInterest);
export const parseAsCategory = parseAsType(isCategory);
export const parseAsConfiguration = parseAsType(isConfiguration);
export const parseAsArrayOfInterests = parseAsType(isArrayOfInterests);
export const parseAsArrayOfCategories = parseAsType(isArrayOfCategories);
export const parseAsArrayOfConfigurations = parseAsType(isArrayOfConfigurations);
