import React from 'react';
import { UseFormRegister } from 'react-hook-form';

import { POSTCODE_PATTERN } from '../../../../regex';
import { FormErrors } from '../../../../types/checkout';
import { fieldPatternMsgs } from '../../../../utils/checkout';
import { parseAsString, safelyParse } from '../../../../utils/parsers';

interface ShippingAddressProps {
    register: UseFormRegister<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    errors: FormErrors;
}

const ShippingAddress: React.FC<ShippingAddressProps> = ({ register, errors }) => {
    const shippingLineOneErr = safelyParse(errors, 'shippingAddressLineOne.message', parseAsString, null);
    const shippingCityErr = safelyParse(errors, 'shippingCity.message', parseAsString, null);
    const shippingPostcodeErr = safelyParse(errors, 'shippingPostcode.message', parseAsString, null);
    const shippingCountyErr = safelyParse(errors, 'shippingCounty.message', parseAsString, null);

    return (
        <div className="grid grid-cols-1 gap-2">
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Address Line One*</span>
                </label>
                <input
                    type="text"
                    placeholder="Address Line One"
                    {...register('shippingAddressLineOne', {
                        required: { value: true, message: 'Address line on is required' },
                    })}
                    className={`input input-sm input-bordered${shippingLineOneErr ? ' input-error' : ''}`}
                />
                {shippingLineOneErr && (
                    <label className="label">
                        <span className="label-text-alt text-error">{shippingLineOneErr}</span>
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
                    {...register('shippingAddressLineTwo')}
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
                    {...register('shippingCompany')}
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
                    {...register('shippingCity', {
                        required: { value: true, message: 'City is required' },
                    })}
                    className={`input input-sm input-bordered${shippingCityErr ? ' input-error' : ''}`}
                />
                {shippingCityErr && (
                    <label className="label">
                        <span className="label-text-alt text-error">{shippingCityErr}</span>
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
                    {...register('shippingPostcode', {
                        required: { value: true, message: 'Postcode is required' },
                        pattern: {
                            value: POSTCODE_PATTERN,
                            message: fieldPatternMsgs('shippingPostcode'),
                        },
                    })}
                    className={`input input-sm input-bordered${shippingPostcodeErr ? ' input-error' : ''}`}
                />
                {shippingPostcodeErr && (
                    <label className="label">
                        <span className="label-text-alt text-error">{shippingPostcodeErr}</span>
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
                    {...register('shippingCounty', {
                        required: { value: true, message: 'County is required' },
                    })}
                    className={`input input-sm input-bordered${shippingCountyErr ? ' input-error' : ''}`}
                />
                {shippingCountyErr && (
                    <label className="label">
                        <span className="label-text-alt text-error">{shippingCountyErr}</span>
                    </label>
                )}
            </div>
        </div>
    );
};

export default ShippingAddress;
