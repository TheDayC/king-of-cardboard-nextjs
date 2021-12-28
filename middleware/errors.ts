import { ErrorResponse } from '../types/api';
import { parseAsArrayOfCommerceLayerErrors, parseAsNumber, parseAsString, safelyParse } from '../utils/parsers';

export function errorHandler(error: unknown, defaultError: string): ErrorResponse | ErrorResponse[] {
    // Intercept commerceLayer errors first as they'll be nested in an axiosError.
    const clErrors = safelyParse(error, 'response.data.errors', parseAsArrayOfCommerceLayerErrors, null);
    if (clErrors) {
        return clErrors.map((err) => ({
            status: parseInt(err.status, 10),
            message: err.title,
            description: err.detail,
        }));
    }

    // Next catch all axios and remaining errors
    const status = safelyParse(error, 'response.status', parseAsNumber, 500);
    const message = safelyParse(error, 'response.statusText', parseAsString, 'Internal Server Error');
    const description = safelyParse(error, 'response.message', parseAsString, defaultError);

    return { status, message, description };
}
