import React from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { EMAIL_PATTERN, NAME_PATTERN, PHONE_PATTERN } from '../../../../regex';
import { FormErrors } from '../../../../types/checkout';
import { fieldPatternMsgs } from '../../../../utils/checkout';
import { parseAsString, safelyParse } from '../../../../utils/parsers';
import selector from './selector';

interface PersonalDetailsProps {
    register: UseFormRegister<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    errors: FormErrors;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ register, errors }) => {
    const { customerDetails } = useSelector(selector);
    const { firstName, lastName, email, phone } = customerDetails;

    // Errors
    const firstNameErr = safelyParse(errors, 'firstName.message', parseAsString, null);
    const lastNameErr = safelyParse(errors, 'lastName.message', parseAsString, null);
    const emailErr = safelyParse(errors, 'email.message', parseAsString, null);
    const mobileErr = safelyParse(errors, 'mobile.message', parseAsString, null);

    return (
        <div className="flex flex-col">
            <h3 className="text-2xl font-semibold mb-4">Personal Details</h3>
            <div className="grid grid-cols-1 gap-2">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">First Name</span>
                    </label>
                    <input
                        type="text"
                        placeholder="First Name"
                        {...register('firstName', {
                            required: { value: true, message: 'Required' },
                            pattern: {
                                value: NAME_PATTERN,
                                message: fieldPatternMsgs('firstName'),
                            },
                        })}
                        className={`input input-md input-bordered${firstNameErr ? ' input-error' : ''}`}
                    />
                    {firstNameErr && (
                        <label className="label">
                            <span className="label-text-alt text-error">{firstNameErr}</span>
                        </label>
                    )}
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Last Name</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Last Name"
                        {...register('lastName', {
                            required: { value: true, message: 'Required' },
                            pattern: {
                                value: NAME_PATTERN,
                                message: fieldPatternMsgs('lastName'),
                            },
                        })}
                        className={`input input-md input-bordered${lastNameErr ? ' input-error' : ''}`}
                    />
                    {lastNameErr && (
                        <label className="label">
                            <span className="label-text-alt text-error">{lastNameErr}</span>
                        </label>
                    )}
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input
                        type="email"
                        placeholder="Email"
                        {...register('email', {
                            required: { value: true, message: 'Required' },
                            pattern: {
                                value: EMAIL_PATTERN,
                                message: fieldPatternMsgs('email'),
                            },
                        })}
                        className={`input input-md input-bordered${emailErr ? ' input-error' : ''}`}
                    />
                    {emailErr && (
                        <label className="label">
                            <span className="label-text-alt text-error">{emailErr}</span>
                        </label>
                    )}
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Mobile No.</span>
                    </label>
                    <input
                        type="tel"
                        placeholder="Mobile No."
                        {...register('phone', {
                            required: { value: true, message: 'Required' },
                            pattern: {
                                value: PHONE_PATTERN,
                                message: fieldPatternMsgs('mobile'),
                            },
                        })}
                        className={`input input-md input-bordered${mobileErr ? ' input-error' : ''}`}
                    />
                    {mobileErr && (
                        <label className="label">
                            <span className="label-text-alt text-error">{mobileErr}</span>
                        </label>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PersonalDetails;
