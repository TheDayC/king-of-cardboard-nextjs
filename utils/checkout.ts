export function fieldPatternMsgs(field: string): string {
    switch (field) {
        case 'firstName':
        case 'lastName':
            return 'Name must only contain letters.';
        case 'email':
            return 'Email address must be valid.';
        case 'mobile':
            return 'Must not contain letters.';
        case 'billingPostcode':
        case 'shippingPostcode':
        case 'postcode':
            return 'Must be a valid postcode.';
        default:
            return '';
    }
}

export function formatOrderNumber(orderNumber: number): string {
    if (orderNumber < 100) {
        return `#00${orderNumber}`;
    }

    if (orderNumber < 1000) {
        return `#0${orderNumber}`;
    }

    return `#${orderNumber}`;
}
