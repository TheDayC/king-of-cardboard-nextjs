import { Document } from '@contentful/rich-text-types';

import { Achievement, Objective } from '../types/achievements';
import { CommerceLayerError } from '../types/api';
import { ContentfulBreak } from '../types/breaks';
import { Hero, SliderImage } from '../types/pages';
import { ITypeGuard } from '../types/parsers';
import { AccountAddress } from '../types/account';
import { ListOrders, Order } from '../types/orders';

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

export function isUnknown(candidate: unknown): candidate is unknown {
    return true;
}

export function isFile(candidate: unknown): candidate is File {
    return isNotNullOrUndefined<object>(candidate) && 'name' in candidate && 'type' in candidate;
}

export function isObject(candidate: unknown): candidate is object {
    return typeof candidate === 'object';
}

export function isNotNullOrUndefined<T>(candidate: unknown): candidate is T {
    return candidate !== undefined && candidate !== null;
}

export function isEnumMember<E extends { [s: string]: unknown }>(enumToTest: E): ITypeGuard<E[keyof E]> {
    return (candidate: unknown): candidate is E[keyof E] => {
        const members = Object.values(enumToTest);

        return members.includes(candidate);
    };
}

export function isArrayOfStrings(candidate: unknown): candidate is string[] {
    return isArray(candidate) && typeof candidate[0] === 'string';
}

export function isArrayOfNumbers(candidate: unknown): candidate is number[] {
    return isArray(candidate) && typeof candidate[0] === 'number';
}

export function isObjective(candidate: unknown): candidate is Objective {
    return isNotNullOrUndefined<object>(candidate) && 'reward' in candidate;
}

export function isArrayOfObjectives(candidate: unknown): candidate is Objective[] {
    return isArray(candidate) && isObjective(candidate[0]);
}

export function isAchievement(candidate: unknown): candidate is Achievement {
    return isNotNullOrUndefined<object>(candidate) && 'current' in candidate;
}

export function isArrayOfAchievements(candidate: unknown): candidate is Achievement[] {
    return isArray(candidate) && isAchievement(candidate[0]);
}

export function isCommerceLayerError(candidate: unknown): candidate is CommerceLayerError {
    return isNotNullOrUndefined<object>(candidate) && 'code' in candidate;
}

export function isArrayofCommerceLayerErrors(candidate: unknown): candidate is CommerceLayerError[] {
    return isArray(candidate) && isCommerceLayerError(candidate[0]);
}

export function isContentfulBreak(candidate: unknown): candidate is ContentfulBreak {
    return isNotNullOrUndefined<object>(candidate) && 'slug' in candidate;
}

export function isArrayOfContentfulBreaks(candidate: unknown): candidate is ContentfulBreak[] {
    return isArray(candidate) && isContentfulBreak(candidate[0]);
}

export function isDocument(candidate: unknown): candidate is Document {
    return isNotNullOrUndefined<object>(candidate) && 'content' in candidate;
}

export function isArrayOfDocuments(candidate: unknown): candidate is Document[] {
    return isArray(candidate) && isDocument(candidate[0]);
}

export function isHero(candidate: unknown): candidate is Hero {
    return isNotNullOrUndefined<object>(candidate) && 'content' in candidate;
}

export function isArrayOfHeroes(candidate: unknown): candidate is Hero[] {
    return isArray(candidate) && isHero(candidate[0]);
}

export function isSliderImage(candidate: unknown): candidate is SliderImage {
    return (
        isNotNullOrUndefined<object>(candidate) && 'url' in candidate && 'width' in candidate && 'height' in candidate
    );
}

export function isArrayOfSliderImages(candidate: unknown): candidate is SliderImage[] {
    return isArray(candidate) && isSliderImage(candidate[0]);
}

export function isAccountAddress(candidate: unknown): candidate is AccountAddress {
    return isNotNullOrUndefined<object>(candidate) && 'lineOne' in candidate;
}

export function isArrayOfAccountAddresses(candidate: unknown): candidate is AccountAddress[] {
    return isArray(candidate) && isAccountAddress(candidate[0]);
}

export function isOrder(candidate: unknown): candidate is Order {
    return isNotNullOrUndefined<object>(candidate) && 'orderNumber' in candidate;
}

export function isListOrders(candidate: unknown): candidate is ListOrders {
    return isNotNullOrUndefined<object>(candidate) && 'orders' in candidate;
}
