import { CommerceLayerObject, CommerceLayerResponse } from '../types/api';
import { ITypeGuard } from '../types/parsers';
import { SocialMedia } from '../types/profile';

export function isString(candidate: unknown): candidate is string {
    return typeof candidate === 'string';
}

export function isNumber(candidate: unknown): candidate is number {
    return typeof candidate === 'number';
}

export function isBoolean(candidate: unknown): candidate is boolean {
    return typeof candidate === 'boolean';
}

export function isArray(candidate: unknown): candidate is unknown[] {
    return Array.isArray(candidate);
}

export function isNotNullOrUndefined<T>(candidate: unknown): candidate is T {
    return candidate !== undefined && candidate !== null;
}

export function isEnumMember<E>(enumToTest: E): ITypeGuard<E[keyof E]> {
    return (candidate: unknown): candidate is E[keyof E] => {
        const members = Object.values(enumToTest);

        return members.includes(candidate);
    };
}

export function isSocialMedia(candidate: unknown): candidate is SocialMedia {
    return isNotNullOrUndefined<object>(candidate) && 'instagram' in candidate;
}

export function isCommerceResponse(candidate: unknown): candidate is CommerceLayerResponse {
    return isNotNullOrUndefined<object>(candidate) && 'type' in candidate;
}

export function isCommerceResponseArray(candidate: unknown): candidate is CommerceLayerResponse[] {
    return isArray(candidate) && isCommerceResponse(candidate[0]);
}

export function isArrayOfStrings(candidate: unknown): candidate is string[] {
    return isArray(candidate) && typeof candidate[0] === 'string';
}

export function isAttributes(candidate: unknown): candidate is CommerceLayerObject {
    return isNotNullOrUndefined<object>(candidate) && 'sku_code' in candidate;
}
