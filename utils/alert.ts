import { AlertLevel } from '../enums/system';

export function alertClass(type: AlertLevel): string {
    switch (type) {
        case AlertLevel.Error:
            return ' alert-error';
        case AlertLevel.Warning:
            return ' alert-warning';
        case AlertLevel.Success:
            return ' alert-success';
        default:
            return '';
    }
}
