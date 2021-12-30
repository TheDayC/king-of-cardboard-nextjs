import React from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';
import { useSelector } from 'react-redux';

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
    const {
        line_1: addressLineOne,
        line_2: addressLineTwo,
        city,
        zip_code: postcode,
        state_code: county,
        company,
    } = billingAddress;

    const billingLineOneErr = safelyParse(errors, 'billingAddressLineOne.message', parseAsString, null);
    const billingLineTwoErr = safelyParse(errors, 'billingAddressLineTwo.message', parseAsString, null);
    const billingCityErr = safelyParse(errors, 'billingCity.message', parseAsString, null);
    const billingPostcodeErr = safelyParse(errors, 'billingPostcode.message', parseAsString, null);
    const billingCountyErr = safelyParse(errors, 'billingCounty.message', parseAsString, null);
    const billingCompanyErr = safelyParse(errors, 'billingCompany.message', parseAsString, null);

    return (
        <div className="p-4 card">
            <div className="grid grid-cols-1 gap-2">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Address Line One</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Address Line One"
                        {...register('billingAddressLineOne', {
                            required: { value: true, message: 'Required' },
                            value: addressLineOne,
                        })}
                        className={`input input-sm input-bordered${billingLineOneErr ? ' input-error' : ''}`}
                    />
                    {billingLineOneErr && (
                        <label className="label">
                            <span className="label-text-alt">{billingLineOneErr}</span>
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
                        {...register('billingAddressLineTwo', { value: addressLineTwo })}
                        className={`input input-sm input-bordered${billingLineTwoErr ? ' input-error' : ''}`}
                    />
                    {billingLineTwoErr && (
                        <label className="label">
                            <span className="label-text-alt">{billingLineTwoErr}</span>
                        </label>
                    )}
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Company</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Company"
                        {...register('billingCompany', {
                            required: false,
                            value: company,
                        })}
                        className={`input input-sm input-bordered${billingCompanyErr ? ' input-error' : ''}`}
                    />
                    {billingCompanyErr && (
                        <label className="label">
                            <span className="label-text-alt">{billingCompanyErr}</span>
                        </label>
                    )}
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">City</span>
                    </label>
                    <input
                        type="text"
                        placeholder="City"
                        {...register('billingCity', {
                            required: { value: true, message: 'Required' },
                            value: city,
                        })}
                        className={`input input-sm input-bordered${billingCityErr ? ' input-error' : ''}`}
                    />
                    {billingCityErr && (
                        <label className="label">
                            <span className="label-text-alt">{billingCityErr}</span>
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
                                value: /^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/gim,
                                message: fieldPatternMsgs('billingPostcode'),
                            },
                            value: postcode,
                        })}
                        className={`input input-sm input-bordered${billingPostcodeErr ? ' input-error' : ''}`}
                    />
                    {billingPostcodeErr && (
                        <label className="label">
                            <span className="label-text-alt">{billingPostcodeErr}</span>
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
                            required: { value: true, message: 'Required' },
                            value: county,
                        })}
                        className={`input input-sm input-bordered${billingCountyErr ? ' input-error' : ''}`}
                    />
                    {billingCountyErr && (
                        <label className="label">
                            <span className="label-text-alt">{billingCountyErr}</span>
                        </label>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BillingAddress;
