import { AxiosError } from 'axios';
import { ErrorResponse } from '../types/api';
import { ResponseError } from '../types/errors';
import { parseAsArrayOfCommerceLayerErrors, parseAsNumber, parseAsString, safelyParse } from '../utils/parsers';

function checkForForbidden(errors: ErrorResponse[]): ErrorResponse[] {
    const has401 = errors.filter((err) => err.status === 401).length > 0;

    if (has401) {
        localStorage.setItem('kingofcardboard-401', 'true');
    }

    return errors.filter((err) => err.status !== 401);
}

export function errorHandler(error: unknown, defaultError: string): ResponseError {
    // Next catch all axios and remaining errors
    const status = safelyParse(error, 'response.status', parseAsNumber, 500);
    const message = safelyParse(error, 'response.statusText', parseAsString, 'Internal Server Error');
    const description = safelyParse(error, 'response.data.message', parseAsString, defaultError);

    if (process.env.NODE_ENV === 'development') {
        console.error(`Error: ${status} - ${message} - ${description}`);
    }

    return {
        status,
        message,
        description,
    };
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
