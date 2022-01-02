import { makeStore } from '../store';
import { setAccessToken, setExpires } from '../store/slices/global';
import { ErrorResponse } from '../types/api';
import { parseAsArrayOfCommerceLayerErrors, parseAsNumber, parseAsString, safelyParse } from '../utils/parsers';

function checkForForbidden(errors: ErrorResponse[]): ErrorResponse[] {
    const store = makeStore();
    const has401 = errors.filter((err) => err.status === 401).length > 0;

    if (has401) {
        store.dispatch(setAccessToken(null));
        store.dispatch(setExpires(null));
    }

    return errors.filter((err) => err.status !== 401);
}

export function errorHandler(error: unknown, defaultError: string): void {
    // Intercept commerceLayer errors first as they'll be nested in an axiosError.
    const clErrors = safelyParse(error, 'response.data.errors', parseAsArrayOfCommerceLayerErrors, null);

    if (clErrors) {
        const errors = clErrors.map((err) => ({
            status: parseInt(err.status, 10),
            message: err.title,
            description: err.detail,
        }));
        const errorsNo401 = checkForForbidden(errors);

        errorsNo401.forEach((err) => console.error(`Error: ${err.status} - ${err.message} - ${err.description}`));
    }

    // Next catch all axios and remaining errors
    const status = safelyParse(error, 'response.data.status', parseAsNumber, 500);
    const message = safelyParse(error, 'response.data.message', parseAsString, 'Internal Server Error');
    const description = safelyParse(error, 'response.data.description', parseAsString, defaultError);

    console.error(`Error: ${status} - ${message} - ${description}`);
}

export function apiErrorHandler(error: unknown, defaultError: string): ErrorResponse[] {
    // Intercept commerceLayer errors first as they'll be nested in an axiosError.
    const clErrors = safelyParse(error, 'response.data.errors', parseAsArrayOfCommerceLayerErrors, null);

    if (clErrors) {
        const errors = clErrors.map((err) => ({
            status: parseInt(err.status, 10),
            message: err.title,
            description: err.detail,
        }));

        return checkForForbidden(errors);
    }

    // Next catch all axios and remaining errors
    const status = safelyParse(error, 'response.data.status', parseAsNumber, 500);
    const message = safelyParse(error, 'response.data.message', parseAsString, 'Internal Server Error');
    const description = safelyParse(error, 'response.data.description', parseAsString, defaultError);

    return [{ status, message, description }];
}
