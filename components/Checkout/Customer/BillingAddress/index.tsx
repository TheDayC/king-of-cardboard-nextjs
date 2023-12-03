import React from 'react';
import { UseFormRegister } from 'react-hook-form';

import { POSTCODE_PATTERN } from '../../../../regex';
import { FormErrors } from '../../../../types/checkout';
import { fieldPatternMsgs } from '../../../../utils/checkout';
import { parseAsString, safelyParse } from '../../../../utils/parsers';

interface BillingAddressProps {
    register: UseFormRegister<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    errors: FormErrors;
}

const BillingAddress: React.FC<BillingAddressProps> = ({ register, errors }) => {
    const billingLineOneErr = safelyParse(errors, 'billingAddressLineOne.message', parseAsString, null);
    const billingCityErr = safelyParse(errors, 'billingCity.message', parseAsString, null);
    const billingPostcodeErr = safelyParse(errors, 'billingPostcode.message', parseAsString, null);
    const billingCountyErr = safelyParse(errors, 'billingCounty.message', parseAsString, null);

    return (
        <div className="grid grid-cols-1 gap-2">
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Address Line One*</span>
                </label>
                <input
                    type="text"
                    placeholder="Address Line One"
                    {...register('billingAddressLineOne', {
                        required: { value: true, message: 'Address line one is required' },
                    })}
                    className={`input input-sm input-bordered${billingLineOneErr ? ' input-error' : ''}`}
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
                    className="input input-sm input-bordered"
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
                    className="input input-sm input-bordered"
                />
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">City*</span>
                </label>
                <input
                    type="text"
                    placeholder="City"
                    {...register('billingCity', {
                        required: { value: true, message: 'City is required.' },
                    })}
                    className={`input input-sm input-bordered${billingCityErr ? ' input-error' : ''}`}
                />
                {billingCityErr && (
                    <label className="label">
                        <span className="label-text-alt text-error">{billingCityErr}</span>
                    </label>
                )}
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Postcode*</span>
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
                    className={`input input-sm input-bordered${billingPostcodeErr ? ' input-error' : ''}`}
                />
                {billingPostcodeErr && (
                    <label className="label">
                        <span className="label-text-alt text-error">{billingPostcodeErr}</span>
                    </label>
                )}
            </div>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">County*</span>
                </label>
                <input
                    type="text"
                    placeholder="County"
                    {...register('billingCounty', {
                        required: { value: true, message: 'County is required' },
                    })}
                    className={`input input-sm input-bordered${billingCountyErr ? ' input-error' : ''}`}
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
