import axios, { AxiosResponse } from 'axios';

import { AxiosData } from '../types/fetch';
import { Counties } from '../enums/checkout';
import { CommerceLayerClient } from '@commercelayer/sdk';
import { CustomerDetails } from '../store/types/state';
import { get } from 'lodash';

function regexEmail(email: string): boolean {
    // eslint-disable-next-line no-useless-escape
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
    );
}

function regexName(name: string): boolean {
    return /^[a-z ,.'-]+$/i.test(name);
}

function regexPostCode(postcode: string): boolean {
    return /^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/gim.test(postcode);
}

function regexPhone(phone: string): boolean {
    return /^(\+\d{1,3}[- ]?)?\d{10}$/gm.test(phone);
}

export function shouldEmailError(email: string | null): boolean {
    let shouldError = true;

    if (email !== null) {
        const isValid = regexEmail(email);

        if (isValid) {
            shouldError = false;
        } else {
            shouldError = true;
        }
    } else {
        shouldError = false;
    }

    return shouldError;
}

export function shouldNameError(name: string | null): boolean {
    let shouldError = true;

    if (name !== null) {
        const isValid = regexName(name);

        if (isValid) {
            shouldError = false;
        } else {
            shouldError = true;
        }
    } else {
        shouldError = false;
    }

    return shouldError;
}

export function shouldAddressLineError(line: string | null): boolean {
    if (line !== null) {
        return line.length <= 0;
    } else {
        return false;
    }
}

export function shouldPostcodeError(code: string | null): boolean {
    let shouldError = true;

    if (code !== null) {
        const isValid = regexPostCode(code);

        if (isValid) {
            shouldError = false;
        } else {
            shouldError = true;
        }
    } else {
        shouldError = false;
    }

    return shouldError;
}

export function shouldPhoneError(phone: string): boolean {
    return regexPhone(phone);
}

export function getCounties(): Counties[] {
    return [
        Counties.Aberdeenshire,
        Counties.Angus,
        Counties.Antrim,
        Counties.Argyll,
        Counties.Armagh,
        Counties.Ayrshire,
        Counties.Banffshire,
        Counties.Bedfordshire,
        Counties.Berkshire,
        Counties.Berwickshire,
        Counties.Bristol,
        Counties.Buckinghamshire,
        Counties.Bute,
        Counties.Caithness,
        Counties.Cambridgeshire,
        Counties.Cheshire,
        Counties.CityofLondon,
        Counties.Clackmannanshire,
        Counties.Clwyd,
        Counties.Cornwall,
        Counties.Cumbria,
        Counties.Derbyshire,
        Counties.Devon,
        Counties.Dorset,
        Counties.Down,
        Counties.Dumfriesshire,
        Counties.Dunbartonshire,
        Counties.Durham,
        Counties.Dyfed,
        Counties.EastLothian,
        Counties.EastRidingofYorkshire,
        Counties.EastSussex,
        Counties.Essex,
        Counties.Fermanagh,
        Counties.Fife,
        Counties.Gloucestershire,
        Counties.GreaterLondon,
        Counties.GreaterManchester,
        Counties.Gwent,
        Counties.Gwynedd,
        Counties.Hampshire,
        Counties.Herefordshire,
        Counties.Hertfordshire,
        Counties.Invernessshire,
        Counties.IsleofWight,
        Counties.Kent,
        Counties.Kincardineshire,
        Counties.Kinrossshire,
        Counties.Kirkcudbrightshire,
        Counties.Lanarkshire,
        Counties.Lancashire,
        Counties.Leicestershire,
        Counties.Lincolnshire,
        Counties.Londonderry,
        Counties.Merseyside,
        Counties.MidGlamorgan,
        Counties.Midlothian,
        Counties.Moray,
        Counties.Nairnshire,
        Counties.Norfolk,
        Counties.NorthYorkshire,
        Counties.Northamptonshire,
        Counties.Northumberland,
        Counties.Nottinghamshire,
        Counties.Orkney,
        Counties.Oxfordshire,
        Counties.Peeblesshire,
        Counties.Perthshire,
        Counties.Powys,
        Counties.Renfrewshire,
        Counties.RossandCromarty,
        Counties.Roxburghshire,
        Counties.Rutland,
        Counties.Selkirkshire,
        Counties.Shetland,
        Counties.Shropshire,
        Counties.Somerset,
        Counties.SouthGlamorgan,
        Counties.SouthYorkshire,
        Counties.Staffordshire,
        Counties.Stirlingshire,
        Counties.Suffolk,
        Counties.Surrey,
        Counties.Sutherland,
        Counties.TyneandWear,
        Counties.Tyrone,
        Counties.Warwickshire,
        Counties.WestGlamorgan,
        Counties.WestLothian,
        Counties.WestMidlands,
        Counties.WestSussex,
        Counties.WestYorkshire,
        Counties.Wigtownshire,
        Counties.Wiltshire,
        Counties.Worcestershire,
    ];
}

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
            return 'Must be a valid postcode.';
        default:
            return '';
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchStripeGateway(accessToken: string): Promise<AxiosResponse<AxiosData> | void> {
    try {
        const url = `${process.env.NEXT_PUBLIC_ECOM_DOMAIN}/api/stripe_gateways/`;

        return await axios.get(url, {
            headers: {
                Accept: 'application/vnd.api+json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } catch (e) {
        console.error(e);
    }
}

export function parseCustomerDetails(data: unknown, allowShipping: boolean): CustomerDetails {
    const firstName: string | null = get(data, 'firstName', null);
    const lastName: string | null = get(data, 'lastName', null);
    const company: string | null = get(data, 'company', null);
    const email: string | null = get(data, 'email', null);
    const phone: string | null = get(data, 'phone', null);
    const addressLineOne: string | null = get(data, 'billingAddressLineOne', null);
    const addressLineTwo: string | null = get(data, 'billingAddressLineTwo', null);
    const city: string | null = get(data, 'billingCity', null);
    const postcode: string | null = get(data, 'billingPostcode', null);
    const county: Counties | null = get(data, 'billingCounty', null);

    const shippingAddressLineOne: string | null = allowShipping ? get(data, 'shippingAddressLineOne', null) : null;
    const shippingAddressLineTwo: string | null = allowShipping ? get(data, 'shippingAddressLineTwo', null) : null;
    const shippingCity: string | null = allowShipping ? get(data, 'shippingCity', null) : null;
    const shippingPostcode: string | null = allowShipping ? get(data, 'shippingPostcode', null) : null;
    const shippingCounty: Counties | null = allowShipping ? get(data, 'shippingCounty', null) : null;

    return {
        firstName,
        lastName,
        company,
        email,
        phone,
        allowShippingAddress: allowShipping,
        addressLineOne,
        addressLineTwo,
        city,
        postcode,
        county,
        shippingAddressLineOne,
        shippingAddressLineTwo,
        shippingCity,
        shippingPostcode,
        shippingCounty,
    };
}
