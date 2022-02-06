export const USER_PATTERN = /^[a-zA-Z0-9]{4,}$/;
export const PASS_PATTERN =
    /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$£¥€%^&*()--+={}\[\]|\\:;"'<>,.?/_]).{8,}$/;
export const EMAIL_PATTERN =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const POSTCODE_PATTERN = /^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/gim;
export const NAME_PATTERN = /^[a-z ,.'-]+$/i;
export const PHONE_PATTERN = /^[0-9 +]+$/;
