import { Address } from './checkout';

export interface AccountAddress extends Address {
    _id: string;
    title: string;
}

export interface Options {
    isOnHoliday: boolean;
}
