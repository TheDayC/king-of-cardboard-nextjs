/**
 * Base parser interface.
 * @typedef {IParser<T>}
 */
export interface IParser<T> {
    <F>(value: unknown, fallbackValue: F, property?: string, logError?: boolean): T | F;
}

/**
 * Interface with unknown generic to guard against mystery data types. Helpful for API responses.
 * @typedef {ITypeGuard<T>}
 */
export interface ITypeGuard<T> {
    (value: unknown): value is T;
}
