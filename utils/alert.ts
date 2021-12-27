import { ErrorLevel } from '../enums/system';

export function alertClass(type: ErrorLevel): string {
    switch (type) {
        case ErrorLevel.Error:
            return ' alert-error';
        case ErrorLevel.Warning:
            return ' alert-warning';
        case ErrorLevel.Success:
            return ' alert-success';
        default:
            return '';
    }
}
