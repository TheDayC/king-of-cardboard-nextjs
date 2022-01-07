import { AlertLevel } from '../enums/system';

export function alertClass(type: AlertLevel): string {
    switch (type) {
        case AlertLevel.Error:
            return ' bg-red-600';
        case AlertLevel.Warning:
            return ' bg-yellow-600';
        case AlertLevel.Success:
            return ' bg-green-600';
        default:
            return '';
    }
}
