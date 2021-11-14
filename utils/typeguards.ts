import axios, { AxiosError } from 'axios';
import { OrderHistoryAddress, OrderHistoryPaymentMethod } from '../types/account';
import { Objective } from '../types/achievements';
import {
    CommerceLayerLineItemRelationship,
    CommerceLayerMeta,
    CommerceLayerObject,
    CommerceLayerResponse,
} from '../types/api';
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

export function isCommerceMeta(candidate: unknown): candidate is CommerceLayerMeta {
    return isNotNullOrUndefined<object>(candidate) && 'page_count' in candidate;
}

export function isArrayOfStrings(candidate: unknown): candidate is string[] {
    return isArray(candidate) && typeof candidate[0] === 'string';
}

export function isAttributes(candidate: unknown): candidate is CommerceLayerObject {
    return isNotNullOrUndefined<object>(candidate) && 'name' in candidate;
}

export function isLineItemRelationship(candidate: unknown): candidate is CommerceLayerLineItemRelationship {
    return isNotNullOrUndefined<object>(candidate) && 'id' in candidate;
}

export function isArrayOfLineItemRelationships(candidate: unknown): candidate is CommerceLayerLineItemRelationship[] {
    return isArray(candidate) && isLineItemRelationship(candidate[0]);
}

export function isHistoricalAddress(candidate: unknown): candidate is OrderHistoryAddress {
    return isNotNullOrUndefined<object>(candidate) && 'line_1' in candidate;
}

export function isPaymentMethodDetails(candidate: unknown): candidate is OrderHistoryPaymentMethod {
    return isNotNullOrUndefined<object>(candidate) && 'brand' in candidate;
}

export function isAxiosError(candidate: unknown): candidate is AxiosError {
    return isNotNullOrUndefined<object>(candidate) && axios.isAxiosError(candidate);
}

export function isObjective(candidate: unknown): candidate is Objective {
    return isNotNullOrUndefined<object>(candidate) && 'rewardIncrement' in candidate;
}

export function isArrayOfObjectives(candidate: unknown): candidate is Objective[] {
    return isArray(candidate) && isObjective(candidate[0]);
}
