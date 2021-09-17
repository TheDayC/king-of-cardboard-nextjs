import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { get } from 'lodash';

import selector from './selector';
import { fieldPatternMsgs } from '../../../utils/checkout';

const CustomerDetails: React.FC = () => {
    const { customerDetails } = useSelector(selector);
    const [allowShippingAddress, setAllowShippingAddress] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const onSubmit = (data) => console.log('Data: ', data);
    const {
        firstName: firstNameErr,
        lastName: lastNameErr,
        email: emailErr,
        mobile: mobileErr,
        billingAddressLineOne: billingLineOneErr,
        billingAddressLineTwo: billingLineTwoErr,
        billingCity: billingCityErr,
        billingPostcode: billingPostcodeErr,
        billingCounty: billingCountyErr,
        allowShippingAddress: allowShippingAddressErr,
        shippingAddressLineOne: shippingLineOneErr,
        shippingAddressLineTwo: shippingLineTwoErr,
        shippingCity: shippingCityErr,
        shippingPostcode: shippingPostcodeErr,
        shippingCounty: shippingCountyErr,
    } = errors;
    console.log('Errors: ', errors);

    const onAllowShippingAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAllowShippingAddress(e.target.checked);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex">
                <div className="flex-grow">
                    <div className="p-4 lg:p-6 card bordered mb-6">
                        <h3 className="card-title">Personal Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">First Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    {...register('firstName', {
                                        required: { value: true, message: 'Required' },
                                        pattern: { value: /^[a-z ,.'-]+$/i, message: fieldPatternMsgs('firstName') },
                                    })}
                                    className={`input input-bordered${firstNameErr ? ' input-error' : ''}`}
                                />
                                {firstNameErr && (
                                    <label className="label">
                                        <span className="label-text-alt">{firstNameErr.message}</span>
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
                                        pattern: { value: /^[a-z ,.'-]+$/i, message: fieldPatternMsgs('lastName') },
                                    })}
                                    className={`input input-bordered${lastNameErr ? ' input-error' : ''}`}
                                />
                                {lastNameErr && (
                                    <label className="label">
                                        <span className="label-text-alt">{lastNameErr.message}</span>
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
                                    className={`input input-bordered${emailErr ? ' input-error' : ''}`}
                                />
                                {emailErr && (
                                    <label className="label">
                                        <span className="label-text-alt">{emailErr.message}</span>
                                    </label>
                                )}
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Mobile No.</span>
                                    <span className="label-text-alt">+44 only</span>
                                </label>
                                <input
                                    type="tel"
                                    placeholder="Mobile No."
                                    {...register('mobile', {
                                        required: { value: true, message: 'Required' },
                                        pattern: {
                                            value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g,
                                            message: fieldPatternMsgs('mobile'),
                                        },
                                    })}
                                    className={`input input-bordered${mobileErr ? ' input-error' : ''}`}
                                />
                                {mobileErr && (
                                    <label className="label">
                                        <span className="label-text-alt">{mobileErr.message}</span>
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 lg:p-6 card bordered mb-6">
                        <h3 className="card-title">Billing Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4 lg:gap-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Address Line One</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Address Line One"
                                    {...register('billingAddressLineOne', {
                                        required: { value: true, message: 'Required' },
                                    })}
                                    className={`input input-bordered${billingLineOneErr ? ' input-error' : ''}`}
                                />
                                {billingLineOneErr && (
                                    <label className="label">
                                        <span className="label-text-alt">{billingLineOneErr.message}</span>
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
                                    {...register('billingAddressLineTwo', {})}
                                    className={`input input-bordered${billingLineTwoErr ? ' input-error' : ''}`}
                                />
                                {billingLineTwoErr && (
                                    <label className="label">
                                        <span className="label-text-alt">{billingLineTwoErr.message}</span>
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
                                    {...register('billingCity', { required: { value: true, message: 'Required' } })}
                                    className={`input input-bordered${billingCityErr ? ' input-error' : ''}`}
                                />
                                {billingCityErr && (
                                    <label className="label">
                                        <span className="label-text-alt">{billingCityErr.message}</span>
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
                                    })}
                                    className={`input input-bordered${billingPostcodeErr ? ' input-error' : ''}`}
                                />
                                {billingPostcodeErr && (
                                    <label className="label">
                                        <span className="label-text-alt">{billingPostcodeErr.message}</span>
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
                                    {...register('billingCounty', { required: { value: true, message: 'Required' } })}
                                    className={`input input-bordered${billingCountyErr ? ' input-error' : ''}`}
                                />
                                {billingCountyErr && (
                                    <label className="label">
                                        <span className="label-text-alt">{billingCountyErr.message}</span>
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="p-4 lg:p-6 card bordered">
                        <div className="form-control">
                            <label className="cursor-pointer label">
                                <span className="label-text">Ship to a different address?</span>
                                <input
                                    type="checkbox"
                                    placeholder="Ship to a different address?"
                                    {...register('allowShippingAddress', {})}
                                    className="checkbox"
                                    onChange={onAllowShippingAddress}
                                />
                            </label>
                        </div>
                        <h3 className="card-title mt-6">Shipping Details</h3>
                        {allowShippingAddress && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4 lg:gap-6">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Address Line One</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Address Line One"
                                        {...register('shippingAddressLineOne', {
                                            required: { value: true, message: 'Required' },
                                        })}
                                        className={`input input-bordered${shippingLineOneErr ? ' input-error' : ''}`}
                                    />
                                    {shippingLineOneErr && (
                                        <label className="label">
                                            <span className="label-text-alt">{shippingLineOneErr.message}</span>
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
                                        {...register('shippingAddressLineTwo', {})}
                                        className={`input input-bordered${shippingLineTwoErr ? ' input-error' : ''}`}
                                    />
                                    {shippingLineTwoErr && (
                                        <label className="label">
                                            <span className="label-text-alt">{shippingLineTwoErr.message}</span>
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
                                        })}
                                        className={`input input-bordered${shippingCityErr ? ' input-error' : ''}`}
                                    />
                                    {shippingCityErr && (
                                        <label className="label">
                                            <span className="label-text-alt">{shippingCityErr.message}</span>
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
                                        })}
                                        className={`input input-bordered${shippingPostcodeErr ? ' input-error' : ''}`}
                                    />
                                    {shippingPostcodeErr && (
                                        <label className="label">
                                            <span className="label-text-alt">{shippingPostcodeErr.message}</span>
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
                                        })}
                                        className={`input input-bordered${shippingCountyErr ? ' input-error' : ''}`}
                                    />
                                    {shippingCountyErr && (
                                        <label className="label">
                                            <span className="label-text-alt">{shippingCountyErr.message}</span>
                                        </label>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <input type="submit" />
        </form>
    );
};

export default CustomerDetails;
