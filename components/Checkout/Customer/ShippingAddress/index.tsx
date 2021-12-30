import React from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { FormErrors } from '../../../../types/checkout';
import { fieldPatternMsgs } from '../../../../utils/checkout';
import { parseAsString, safelyParse } from '../../../../utils/parsers';
import selector from './selector';

interface ShippingAddressProps {
    register: UseFormRegister<FieldValues>;
    errors: FormErrors;
}

const ShippingAddress: React.FC<ShippingAddressProps> = ({ register, errors }) => {
    const { shippingAddress } = useSelector(selector);
    const {
        line_1: addressLineOne,
        line_2: addressLineTwo,
        city,
        zip_code: postcode,
        state_code: county,
        company,
    } = shippingAddress;

    const shippingLineOneErr = safelyParse(errors, 'shippingAddressLineOne.message', parseAsString, null);
    const shippingLineTwoErr = safelyParse(errors, 'shippingAddressLineTwo.message', parseAsString, null);
    const shippingCityErr = safelyParse(errors, 'shippingCity.message', parseAsString, null);
    const shippingPostcodeErr = safelyParse(errors, 'shippingPostcode.message', parseAsString, null);
    const shippingCountyErr = safelyParse(errors, 'shippingCounty.message', parseAsString, null);
    const shippingCompanyErr = safelyParse(errors, 'shippingCompany.message', parseAsString, null);

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
                        {...register('shippingAddressLineOne', {
                            required: { value: true, message: 'Required' },
                            value: addressLineOne,
                        })}
                        className={`input input-sm input-bordered${shippingLineOneErr ? ' input-error' : ''}`}
                    />
                    {shippingLineOneErr && (
                        <label className="label">
                            <span className="label-text-alt">{shippingLineOneErr}</span>
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
                        {...register('shippingAddressLineTwo', {
                            value: addressLineTwo,
                        })}
                        className={`input input-sm input-bordered${shippingLineTwoErr ? ' input-error' : ''}`}
                    />
                    {shippingLineTwoErr && (
                        <label className="label">
                            <span className="label-text-alt">{shippingLineTwoErr}</span>
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
                        {...register('shippingCompany', {
                            required: false,
                            value: company,
                        })}
                        className={`input input-sm input-bordered${shippingCompanyErr ? ' input-error' : ''}`}
                    />
                    {shippingCompanyErr && (
                        <label className="label">
                            <span className="label-text-alt">{shippingCompanyErr}</span>
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
                        {...register('shippingCity', {
                            required: { value: true, message: 'Required' },
                            value: city,
                        })}
                        className={`input input-sm input-bordered${shippingCityErr ? ' input-error' : ''}`}
                    />
                    {shippingCityErr && (
                        <label className="label">
                            <span className="label-text-alt">{shippingCityErr}</span>
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
                        {...register('shippingPostcode', {
                            required: { value: true, message: 'Required' },
                            pattern: {
                                value: /^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/gim,
                                message: fieldPatternMsgs('shippingPostcode'),
                            },
                            value: postcode,
                        })}
                        className={`input input-sm input-bordered${shippingPostcodeErr ? ' input-error' : ''}`}
                    />
                    {shippingPostcodeErr && (
                        <label className="label">
                            <span className="label-text-alt">{shippingPostcodeErr}</span>
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
                        {...register('shippingCounty', {
                            required: { value: true, message: 'Required' },
                            value: county,
                        })}
                        className={`input input-sm input-bordered${shippingCountyErr ? ' input-error' : ''}`}
                    />
                    {shippingCountyErr && (
                        <label className="label">
                            <span className="label-text-alt">{shippingCountyErr}</span>
                        </label>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShippingAddress;
