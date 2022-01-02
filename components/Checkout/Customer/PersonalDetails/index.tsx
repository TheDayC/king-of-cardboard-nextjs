import React, { useEffect } from 'react';
import { UseFormRegister, FieldValues, UseFormSetValue } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { FormErrors } from '../../../../types/checkout';
import { fieldPatternMsgs } from '../../../../utils/checkout';
import { parseAsString, safelyParse } from '../../../../utils/parsers';
import selector from './selector';

interface PersonalDetailsProps {
    register: UseFormRegister<FieldValues>;
    errors: FormErrors;
    setValue: UseFormSetValue<FieldValues>;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({ register, errors, setValue }) => {
    const { customerDetails } = useSelector(selector);
    const { first_name: firstName, last_name: lastName, email, phone } = customerDetails;

    const firstNameErr = safelyParse(errors, 'firstName.message', parseAsString, null);
    const lastNameErr = safelyParse(errors, 'lastName.message', parseAsString, null);
    const emailErr = safelyParse(errors, 'email.message', parseAsString, null);
    const mobileErr = safelyParse(errors, 'mobile.message', parseAsString, null);

    useEffect(() => {
        if (email) {
            setValue('email', email);
        }
    }, [email, setValue]);

    useEffect(() => {
        if (firstName) {
            setValue('firstName', firstName);
        }
    }, [firstName, setValue]);

    useEffect(() => {
        if (lastName) {
            setValue('lastName', lastName);
        }
    }, [lastName, setValue]);

    useEffect(() => {
        if (phone) {
            setValue('phone', phone);
        }
    }, [phone, setValue]);

    return (
        <div className="card p-2 md:p-4">
            <h3 className="card-title text-2xl">Personal Details</h3>
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
                                value: /^[a-z ,.'-]+$/i,
                                message: fieldPatternMsgs('firstName'),
                            },
                        })}
                        className={`input input-sm input-bordered${firstNameErr ? ' input-error' : ''}`}
                    />
                    {firstNameErr && (
                        <label className="label">
                            <span className="label-text-alt">{firstNameErr}</span>
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
                                value: /^[a-z ,.'-]+$/i,
                                message: fieldPatternMsgs('lastName'),
                            },
                        })}
                        className={`input input-sm input-bordered${lastNameErr ? ' input-error' : ''}`}
                    />
                    {lastNameErr && (
                        <label className="label">
                            <span className="label-text-alt">{lastNameErr}</span>
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
                                value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: fieldPatternMsgs('email'),
                            },
                        })}
                        className={`input input-sm input-bordered${emailErr ? ' input-error' : ''}`}
                    />
                    {emailErr && (
                        <label className="label">
                            <span className="label-text-alt">{emailErr}</span>
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
                                value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g,
                                message: fieldPatternMsgs('mobile'),
                            },
                        })}
                        className={`input input-sm input-bordered${mobileErr ? ' input-error' : ''}`}
                    />
                    {mobileErr && (
                        <label className="label">
                            <span className="label-text-alt">{mobileErr}</span>
                        </label>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PersonalDetails;