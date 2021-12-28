import axios, { AxiosError } from 'axios';

import { CartItem, CustomerDetails } from '../store/types/state';
import { OrderHistoryAddress, OrderHistoryPaymentMethod } from '../types/account';
import { Achievement, Objective } from '../types/achievements';
import {
    CommerceLayerError,
    CommerceLayerLineItemRelationship,
    CommerceLayerMeta,
    CommerceLayerObject,
    CommerceLayerResponse,
    ErrorResponse,
} from '../types/api';
import { BreakTypeItem, BreakTypeItems, ContentfulBreak } from '../types/breaks';
import { Order } from '../types/cart';
import { SkuInventory, SkuOption } from '../types/commerce';
import { ContentfulPage } from '../types/pages';
import { ITypeGuard } from '../types/parsers';
import { ContentfulProduct, ImageCollection, ImageItem } from '../types/products';
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

export function isUnknown(candidate: unknown): candidate is unknown {
    return true;
}

export function isObject(candidate: unknown): candidate is object {
    return typeof candidate === 'object';
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

export function isError(candidate: unknown): candidate is ErrorResponse {
    return isNotNullOrUndefined<object>(candidate) && isObject(candidate) && 'status' in candidate;
}

export function isArrayOfErrors(candidate: unknown): candidate is ErrorResponse[] {
    return isArray(candidate) && isError(candidate[0]);
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

export function isImageCollection(candidate: unknown): candidate is ImageCollection {
    return isNotNullOrUndefined<object>(candidate) && 'items' in candidate;
}

export function isImageItem(candidate: unknown): candidate is ImageItem {
    return isNotNullOrUndefined<object>(candidate) && 'url' in candidate;
}

export function isSkuInventory(candidate: unknown): candidate is SkuInventory {
    return isNotNullOrUndefined<object>(candidate) && 'available' in candidate;
}

export function isSkuOption(candidate: unknown): candidate is SkuOption {
    return isNotNullOrUndefined<object>(candidate) && 'sku_code_regex' in candidate;
}

export function isArrayofSkuOptions(candidate: unknown): candidate is SkuOption[] {
    return isArray(candidate) && isSkuOption(candidate[0]);
}

export function isOrder(candidate: unknown): candidate is Order {
    return isNotNullOrUndefined<object>(candidate) && 'payment_status' in candidate;
}

export function isItem(candidate: unknown): candidate is CartItem {
    return isNotNullOrUndefined<object>(candidate) && 'quantity' in candidate;
}

export function isArrayofItems(candidate: unknown): candidate is CartItem[] {
    return isArray(candidate) && isItem(candidate[0]);
}

export function isCustomerDetails(candidate: unknown): candidate is CustomerDetails {
    return isNotNullOrUndefined<object>(candidate) && 'firstName' in candidate;
}

export function isContentfulBreak(candidate: unknown): candidate is ContentfulBreak {
    return isNotNullOrUndefined<object>(candidate) && 'slug' in candidate;
}

export function isArrayOfContentfulBreaks(candidate: unknown): candidate is ContentfulBreak[] {
    return isArray(candidate) && isContentfulBreak(candidate[0]);
}

export function isBreakTypeItem(candidate: unknown): candidate is BreakTypeItem {
    return isNotNullOrUndefined<object>(candidate) && 'title' in candidate;
}

export function isArrayOfBreakTypeItems(candidate: unknown): candidate is BreakTypeItem[] {
    return isArray(candidate) && isBreakTypeItem(candidate[0]);
}

export function isContentfulPage(candidate: unknown): candidate is ContentfulPage {
    return isNotNullOrUndefined<object>(candidate) && 'content' in candidate;
}

export function isArrayOfContentfulPages(candidate: unknown): candidate is ContentfulPage[] {
    return isArray(candidate) && isContentfulPage(candidate[0]);
}

export function isContentfulProduct(candidate: unknown): candidate is ContentfulProduct {
    return isNotNullOrUndefined<object>(candidate) && 'productLink' in candidate;
}

export function isArrayOfContentfulProducts(candidate: unknown): candidate is ContentfulProduct[] {
    return isArray(candidate) && isContentfulPage(candidate[0]);
}
