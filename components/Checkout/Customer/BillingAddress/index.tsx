import React from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { POSTCODE_PATTERN } from '../../../../regex';
import { FormErrors } from '../../../../types/checkout';
import { fieldPatternMsgs } from '../../../../utils/checkout';
import { parseAsString, safelyParse } from '../../../../utils/parsers';
import selector from './selector';

interface BillingAddressProps {
    register: UseFormRegister<FieldValues>;
    errors: FormErrors;
}

const BillingAddress: React.FC<BillingAddressProps> = ({ register, errors }) => {
    const { billingAddress } = useSelector(selector);
    const { lineOne, lineTwo, city, postcode, county, company } = billingAddress;

    const billingLineOneErr = safelyParse(errors, 'billingAddressLineOne.message', parseAsString, null);
    const billingCityErr = safelyParse(errors, 'billingCity.message', parseAsString, null);
    const billingPostcodeErr = safelyParse(errors, 'billingPostcode.message', parseAsString, null);
    const billingCountyErr = safelyParse(errors, 'billingCounty.message', parseAsString, null);

    return (
        <div className="grid grid-cols-1 gap-2">
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Address Line One</span>
                </label>
                <input
                    type="text"
                    placeholder="Address Line One"
                    {...register('billingAddressLineOne', {
                        required: { value: true, message: 'Address line one is required' },
                    })}
                    className={`input input-md input-bordered${billingLineOneErr ? ' input-error' : ''}`}
                    defaultValue={lineOne}
                />
                {billingLineOneErr && (
                    <label className="label">
                        <span className="label-text-alt text-error">{billingLineOneErr}</span>
                    </label>
                )}
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Address Line Two</span>
                </label>
                <input
                    type="text"
                    placeholder="Address Line Two"
                    {...register('billingAddressLineTwo')}
                    className="input input-md input-bordered"
                    defaultValue={lineTwo}
                />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Company</span>
                </label>
                <input
                    type="text"
                    placeholder="Company"
                    {...register('billingCompany')}
                    className="input input-md input-bordered"
                    defaultValue={company}
                />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">City</span>
                </label>
                <input
                    type="text"
                    placeholder="City"
                    {...register('billingCity', {
                        required: { value: true, message: 'City is required.' },
                    })}
                    className={`input input-md input-bordered${billingCityErr ? ' input-error' : ''}`}
                    defaultValue={city}
                />
                {billingCityErr && (
                    <label className="label">
                        <span className="label-text-alt text-error">{billingCityErr}</span>
                    </label>
                )}
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Postcode</span>
                </label>
                <input
                    type="text"
                    placeholder="Postcode"
                    {...register('billingPostcode', {
                        required: { value: true, message: 'Required' },
                        pattern: {
                            value: POSTCODE_PATTERN,
                            message: fieldPatternMsgs('billingPostcode'),
                        },
                    })}
                    className={`input input-md input-bordered${billingPostcodeErr ? ' input-error' : ''}`}
                    defaultValue={postcode}
                />
                {billingPostcodeErr && (
                    <label className="label">
                        <span className="label-text-alt text-error">{billingPostcodeErr}</span>
                    </label>
                )}
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">County</span>
                </label>
                <input
                    type="text"
                    placeholder="County"
                    {...register('billingCounty', {
                        required: { value: true, message: 'County is required' },
                    })}
                    className={`input input-md input-bordered${billingCountyErr ? ' input-error' : ''}`}
                    defaultValue={county}
                />
                {billingCountyErr && (
                    <label className="label">
                        <span className="label-text-alt text-error">{billingCountyErr}</span>
                    </label>
                )}
            </div>
        </div>
    );
};

export default BillingAddress;
