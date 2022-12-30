/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types */
import {
    isString,
    isNumber,
    isBoolean,
    isArray,
    isArrayOfStrings,
    isEnumMember,
    isArrayOfObjectives,
    isArrayOfAchievements,
    isArrayofCommerceLayerErrors,
    isArrayOfContentfulBreaks,
    isUnknown,
    isArrayOfDocuments,
    isArrayOfHeroes,
    isArrayOfSliderImages,
    isDocument,
    isArrayOfNumbers,
    isFile,
    isArrayOfAccountAddresses,
} from './typeguards';
import { ITypeGuard, IParser } from '../types/parsers';
import { Slugs } from '../enums/account';
import { Roles } from '../enums/auth';

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
export const parseAsArrayOfObjectives = parseAsType(isArrayOfObjectives);
export const parseAsArrayOfAchievements = parseAsType(isArrayOfAchievements);
export const parseAsArrayOfCommerceLayerErrors = parseAsType(isArrayofCommerceLayerErrors);
export const parseAsSlug = parseAsType(isEnumMember(Slugs));
export const parseAsArrayOfContentfulBreaks = parseAsType(isArrayOfContentfulBreaks);
export const parseAsDocument = parseAsType(isDocument);
export const parseAsArrayOfDocuments = parseAsType(isArrayOfDocuments);
export const parseAsArrayOfHeroes = parseAsType(isArrayOfHeroes);
export const parseAsArrayOfSliderImages = parseAsType(isArrayOfSliderImages);
export const parseAsRole = parseAsType(isEnumMember(Roles));
export const parseAsArrayOfAccountAddresses = parseAsType(isArrayOfAccountAddresses);
