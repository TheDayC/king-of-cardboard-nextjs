import { AlertLevel } from '../enums/system';

export function alertClass(type: AlertLevel): string {
    switch (type) {
        case AlertLevel.Error:
            return ' bg-red-400';
        case AlertLevel.Warning:
            return ' bg-yellow-400';
        case AlertLevel.Success:
            return ' bg-green-400';
        default:
            return '';
    }
}
