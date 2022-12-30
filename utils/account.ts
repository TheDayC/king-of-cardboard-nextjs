import axios from 'axios';
import { DateTime } from 'luxon';

import { parseAsArrayOfCommerceResponse, safelyParse, parseAsString, parseAsNumber } from './parsers';
import { authClient } from './auth';
import { errorHandler } from '../middleware/errors';
import { SocialMedia } from '../types/profile';
import { ResponseError } from '../types/errors';
import { Fulfillment, Payment, Status } from '../enums/orders';

export function getStatusColor(status: Status): string {
    switch (status) {
        case Status.Approved:
            return 'green';
        case Status.Placed:
        case Status.Pending:
            return 'yellow';
        case Status.Cancelled:
            return 'red';
        default:
            return 'gray';
    }
}

export function getPaymentStatusColor(status: Payment): string {
    switch (status) {
        case Payment.Paid:
            return 'green';
        case Payment.Authorised:
            return 'yellow';
        case Payment.Refunded:
            return 'red';
        default:
            return 'gray';
    }
}

export function getFulfillmentStatusColor(status: Fulfillment): string {
    switch (status) {
        case Fulfillment.Fulfilled:
            return 'green';
        case Fulfillment.InProgress:
            return 'yellow';
        default:
            return 'gray';
    }
}

export function getStatusTitle(status: Status): string {
    switch (status) {
        case Status.Approved:
            return 'Approved';
        case Status.Placed:
            return 'Placed';
        case Status.Pending:
            return 'Pending';
        case Status.Cancelled:
            return 'Cancelled';
        default:
            return 'Unknown';
    }
}

export function getPaymentStatusTitle(status: Payment): string {
    switch (status) {
        case Payment.Paid:
            return 'Paid';
        case Payment.Authorised:
            return 'Authorised';
        case Payment.Refunded:
            return 'Refunded';
        default:
            return 'Unknown';
    }
}

export function getFulfillmentStatusTitle(status: Fulfillment): string {
    switch (status) {
        case Fulfillment.Fulfilled:
            return 'Fulfilled';
        case Fulfillment.InProgress:
            return 'InProgress';
        case Fulfillment.Unfulfilled:
            return 'Unfulfilled';
        default:
            return 'Unknown';
    }
}

/* export function cardLogo(card: string | null): JSX.Element {
    switch (card) {
        case 'visa':
            return <FaCcVisa />;
        case 'mastercard':
            return <FaCcMastercard />;
        case 'paypal':
            return <FaCcPaypal />;
        default:
            return <AiFillCreditCard />;
    }
} */

export async function requestPasswordReset(email: string): Promise<boolean | ResponseError> {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/account/password/reset`, {
            email,
        });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 201;
    } catch (error: unknown) {
        return errorHandler(error, 'We could not reset your password.');
    }
}

export function hasResetExpired(expires: string): boolean {
    const now = DateTime.now().setZone('Europe/London');
    const expiry = DateTime.fromISO(expires, { zone: 'Europe/London' });

    return now >= expiry;
}

export async function updatePassword(accessToken: string, emailAddress: string, password: string): Promise<boolean> {
    try {
        const cl = authClient(accessToken);
        const customer = await cl.get(`/api/customers/?filter[q][email_eq]=${emailAddress}`);
        const customerRes = safelyParse(customer, 'data.data', parseAsArrayOfCommerceResponse, null);

        if (!customerRes) {
            return false;
        }

        const customerId = customerRes[0].id;

        const res = await cl.patch(`/api/customers/${customerId}`, {
            data: {
                type: 'customers',
                id: customerId,
                attributes: {
                    password,
                },
            },
        });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        errorHandler(error, 'We could not update your password.');
    }

    return false;
}

export async function resetPassword(token: string, password: string, email: string): Promise<boolean | ResponseError> {
    try {
        const res = await axios.patch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/account/password/reset`, {
            token,
            password,
            email,
        });
        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 201;
    } catch (error: unknown) {
        return errorHandler(error, 'We could not reset your password.');
    }
}

export async function updateUsername(emailAddress: string, username: string): Promise<boolean> {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/account/updateUsername`, {
            emailAddress,
            username,
        });

        const status = safelyParse(res, 'response.status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        errorHandler(error, 'Failed to update username.');
    }

    return false;
}

export async function getSocialMedia(emailAddress: string): Promise<SocialMedia> {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/account/getSocialMedia`, {
            emailAddress,
        });

        return {
            instagram: safelyParse(res, 'data.socialMedia.instagram', parseAsString, ''),
            twitter: safelyParse(res, 'data.socialMedia.twitter', parseAsString, ''),
            twitch: safelyParse(res, 'data.socialMedia.twitch', parseAsString, ''),
            youtube: safelyParse(res, 'data.socialMedia.youtube', parseAsString, ''),
            ebay: safelyParse(res, 'data.socialMedia.ebay', parseAsString, ''),
        };
    } catch (error: unknown) {
        errorHandler(error, 'Failed to update social media.');
    }

    return {
        instagram: '',
        twitter: '',
        twitch: '',
        youtube: '',
        ebay: '',
    };
}

export async function updateSocialMedia(
    emailAddress: string,
    instagram: string,
    twitter: string,
    twitch: string,
    youtube: string,
    ebay: string
): Promise<boolean> {
    try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/account/updateSocialMedia`, {
            emailAddress,
            instagram,
            twitter,
            twitch,
            youtube,
            ebay,
        });

        const status = safelyParse(res, 'status', parseAsNumber, 500);

        return status === 200;
    } catch (error: unknown) {
        errorHandler(error, 'Failed to update social media.');
    }

    return false;
}
