import { Document } from '@contentful/rich-text-types';

import { CustomerAddress, CustomerDetails } from '../store/types/state';
import { Achievement, Objective } from '../types/achievements';
import { CommerceLayerError, CommerceLayerLineItemRelationship, CommerceLayerResponse } from '../types/api';
import { BreakSlot, BreakSlotsCollection, BreakTypeItem, ContentfulBreak } from '../types/breaks';
import { CartItem } from '../types/cart';
import { SkuInventory, SkuOption } from '../types/commerce';
import { ContentfulPage, Hero, SliderImage } from '../types/pages';
import { ITypeGuard } from '../types/parsers';
import { ContentfulProduct } from '../types/products';
import { ImageCollection, ImageItem, Repeater } from '../types/contentful';
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
    return (candidate: any): candidate is E[keyof E] => {
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

export function isArrayOfNumbers(candidate: unknown): candidate is number[] {
    return isArray(candidate) && typeof candidate[0] === 'number';
}

export function isLineItemRelationship(candidate: unknown): candidate is CommerceLayerLineItemRelationship {
    return isNotNullOrUndefined<object>(candidate) && 'id' in candidate;
}

export function isArrayOfLineItemRelationships(candidate: unknown): candidate is CommerceLayerLineItemRelationship[] {
    return isArray(candidate) && isLineItemRelationship(candidate[0]);
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

export function isBreakSlotsCollection(candidate: unknown): candidate is BreakSlotsCollection {
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

export function isItem(candidate: unknown): candidate is CartItem {
    return isNotNullOrUndefined<object>(candidate) && 'quantity' in candidate;
}

export function isArrayofItems(candidate: unknown): candidate is CartItem[] {
    return isArray(candidate) && isItem(candidate[0]);
}

export function isCustomerDetails(candidate: unknown): candidate is CustomerDetails {
    return isNotNullOrUndefined<object>(candidate) && 'first_name' in candidate;
}

export function isCustomerAddress(candidate: unknown): candidate is CustomerAddress {
    return isNotNullOrUndefined<object>(candidate) && 'line_1' in candidate;
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
    return isArray(candidate) && isContentfulProduct(candidate[0]);
}

export function isBreakSlot(candidate: unknown): candidate is BreakSlot {
    return isNotNullOrUndefined<object>(candidate) && 'productLink' in candidate;
}

export function isArrayOfBreakSlots(candidate: unknown): candidate is BreakSlot[] {
    return isArray(candidate) && isBreakSlot(candidate[0]);
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

export function isRepeater(candidate: unknown): candidate is Repeater {
    return isNotNullOrUndefined<object>(candidate) && 'key' in candidate && 'value' in candidate;
}

export function isArrayOfRepeater(candidate: unknown): candidate is Repeater[] {
    return isArray(candidate) && isRepeater(candidate[0]);
}
