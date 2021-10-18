import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { get } from 'lodash';

import selector from './selector';
import { fieldPatternMsgs, updateAddress } from '../../../utils/checkout';
import { PersonalDetails } from '../../../types/checkout';
import { setAllowShippingAddress, setCurrentStep, setCustomerDetails } from '../../../store/slices/checkout';
import { parseCustomerDetails } from '../../../utils/parsers';
import { fetchOrder } from '../../../store/slices/cart';

const Customer: React.FC = () => {
    const { currentStep, customerDetails, order, accessToken } = useSelector(selector);
    const {
        firstName,
        lastName,
        company,
        email,
        phone,
        addressLineOne,
        addressLineTwo,
        city,
        postcode,
        county,
        allowShippingAddress,
        shippingAddressLineOne,
        shippingAddressLineTwo,
        shippingCity,
        shippingPostcode,
        shippingCounty,
    } = customerDetails;
    const dispatch = useDispatch();
    const [allowShippingAddressInternal, setAllowShippingAddressInternal] = useState(allowShippingAddress);
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const isCurrentStep = currentStep === 0;
    const hasErrors = Object.keys(errors).length > 0;

    const onSubmit = async (data: PersonalDetails) => {
        // Set loading in current form.
        setLoading(true);

        // Fetch allowShipping and also dispatch current state on submission.
        const allowShipping = get(data, 'allowShippingAddress', false);
        dispatch(setAllowShippingAddress(allowShipping));

        // There are quite a few customer details to parse so ship it off to a helper then store.
        const customerDetails = parseCustomerDetails(data, allowShipping);
        dispatch(setCustomerDetails(customerDetails));

        if (order && accessToken) {
            // Update billing address details in commerceLayer
            const hasBillingAddressUpdated = await updateAddress(accessToken, order.id, customerDetails, false);

            if (hasBillingAddressUpdated) {
                // Update shipping address details in commerceLayer
                await updateAddress(accessToken, order.id, customerDetails, true);
            }

            dispatch(fetchOrder(true));
        }

        // Remove load barriers.
        setLoading(false);

        // Redirect to next stage.
        dispatch(setCurrentStep(1));
    };

    // Collect errors.
    const firstNameErr = get(errors, 'firstName.message', null);
    const lastNameErr = get(errors, 'lastName.message', null);
    const companyErr = get(errors, 'company.message', null);
    const emailErr = get(errors, 'email.message', null);
    const mobileErr = get(errors, 'mobile.message', null);
    const billingLineOneErr = get(errors, 'billingAddressLineOne.message', null);
    const billingLineTwoErr = get(errors, 'billingAddressLineTwo.message', null);
    const billingCityErr = get(errors, 'billingCity.message', null);
    const billingPostcodeErr = get(errors, 'billingPostcode.message', null);
    const billingCountyErr = get(errors, 'billingCounty.message', null);
    const shippingLineOneErr = get(errors, 'shippingAddressLineOne.message', null);
    const shippingLineTwoErr = get(errors, 'shippingAddressLineTwo.message', null);
    const shippingCityErr = get(errors, 'shippingCity.message', null);
    const shippingPostcodeErr = get(errors, 'shippingPostcode.message', null);
    const shippingCountyErr = get(errors, 'shippingCounty.message', null);

    // Update internal allow shipping state to add / hide address.
    const onAllowShippingAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAllowShippingAddressInternal(e.target.checked);
    };

    const handleEdit = () => {
        if (!isCurrentStep) {
            dispatch(setCurrentStep(0));
        }
    };

    return (
        <div
            className={`collapse collapse-plus card bordered mb-6 rounded-md collapse-${
                isCurrentStep ? 'open' : 'closed'
            }`}
        >
            <div className="collapse-title text-xl font-medium" onClick={handleEdit}>
                {!hasErrors && !isCurrentStep ? 'Customer - Edit' : 'Customer'}
            </div>
            <div className="collapse-content bg-base-100 p-0">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex">
                        <div className="flex-grow">
                            <div className="card p-4">
                                <h3 className="card-title">Personal Details</h3>
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
                                                value: firstName,
                                            })}
                                            className={`input input-sm input-bordered${
                                                firstNameErr ? ' input-error' : ''
                                            }`}
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
                                                value: lastName,
                                            })}
                                            className={`input input-sm input-bordered${
                                                lastNameErr ? ' input-error' : ''
                                            }`}
                                        />
                                        {lastNameErr && (
                                            <label className="label">
                                                <span className="label-text-alt">{lastNameErr}</span>
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
                                            {...register('company', {
                                                required: false,
                                                value: company,
                                            })}
                                            className={`input input-sm input-bordered${
                                                companyErr ? ' input-error' : ''
                                            }`}
                                        />
                                        {companyErr && (
                                            <label className="label">
                                                <span className="label-text-alt">{companyErr}</span>
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
                                                value: email,
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
                                                value: phone,
                                            })}
                                            className={`input input-sm input-bordered${
                                                mobileErr ? ' input-error' : ''
                                            }`}
                                        />
                                        {mobileErr && (
                                            <label className="label">
                                                <span className="label-text-alt">{mobileErr}</span>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 card">
                                <h3 className="card-title">Billing Details</h3>
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
                                            className={`input input-sm input-bordered${
                                                billingLineOneErr ? ' input-error' : ''
                                            }`}
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
                                            className={`input input-sm input-bordered${
                                                billingLineTwoErr ? ' input-error' : ''
                                            }`}
                                        />
                                        {billingLineTwoErr && (
                                            <label className="label">
                                                <span className="label-text-alt">{billingLineTwoErr}</span>
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
                                            className={`input input-sm input-bordered${
                                                billingCityErr ? ' input-error' : ''
                                            }`}
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
                                            className={`input input-sm input-bordered${
                                                billingPostcodeErr ? ' input-error' : ''
                                            }`}
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
                                            className={`input input-sm input-bordered${
                                                billingCountyErr ? ' input-error' : ''
                                            }`}
                                        />
                                        {billingCountyErr && (
                                            <label className="label">
                                                <span className="label-text-alt">{billingCountyErr}</span>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 card">
                                <div className="form-control">
                                    <label className="cursor-pointer label">
                                        <span className="label-text">Ship to a different address?</span>
                                        <input
                                            type="checkbox"
                                            placeholder="Ship to a different address?"
                                            {...register('allowShippingAddress', {})}
                                            className="checkbox"
                                            onChange={onAllowShippingAddress}
                                            defaultChecked={allowShippingAddress}
                                        />
                                    </label>
                                </div>
                            </div>
                            {allowShippingAddressInternal && (
                                <div className="p-4 card">
                                    <h3 className="card-title">Shipping Details</h3>
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
                                                    value: shippingAddressLineOne,
                                                })}
                                                className={`input input-sm input-bordered${
                                                    shippingLineOneErr ? ' input-error' : ''
                                                }`}
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
                                                    value: shippingAddressLineTwo,
                                                })}
                                                className={`input input-sm input-bordered${
                                                    shippingLineTwoErr ? ' input-error' : ''
                                                }`}
                                            />
                                            {shippingLineTwoErr && (
                                                <label className="label">
                                                    <span className="label-text-alt">{shippingLineTwoErr}</span>
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
                                                    value: shippingCity,
                                                })}
                                                className={`input input-sm input-bordered${
                                                    shippingCityErr ? ' input-error' : ''
                                                }`}
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
                                                    value: shippingPostcode,
                                                })}
                                                className={`input input-sm input-bordered${
                                                    shippingPostcodeErr ? ' input-error' : ''
                                                }`}
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
                                                    value: shippingCounty,
                                                })}
                                                className={`input input-sm input-bordered${
                                                    shippingCountyErr ? ' input-error' : ''
                                                }`}
                                            />
                                            {shippingCountyErr && (
                                                <label className="label">
                                                    <span className="label-text-alt">{shippingCountyErr}</span>
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end p-4">
                        <button
                            type="submit"
                            className={`btn${hasErrors ? ' btn-base-200 btn-disabled' : ' btn-secondary'}`}
                        >
                            Delivery
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Customer;
