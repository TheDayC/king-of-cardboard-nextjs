import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import selector from './selector';
import { parseAsString, safelyParse } from '../../../../utils/parsers';
import { fieldPatternMsgs } from '../../../../utils/checkout';
import { addAddress, editAddress } from '../../../../utils/account';
import { addError, addSuccess } from '../../../../store/slices/alerts';
import { fetchAddresses } from '../../../../store/slices/account';

interface FormData {
    name: string;
    addressLineOne: string;
    addressLineTwo: string;
    city: string;
    company: string;
    county: string;
    firstName: string;
    lastName: string;
    phone: string;
    postcode: string;
}

interface FieldProps {
    id?: string;
    addressId?: string;
    name?: string;
    addressLineOne?: string;
    addressLineTwo?: string;
    city?: string;
    company?: string;
    county?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    postcode?: string;
}

export const Fields: React.FC<FieldProps> = ({
    id,
    addressId,
    name,
    addressLineOne,
    addressLineTwo,
    city,
    company,
    county,
    firstName,
    lastName,
    phone,
    postcode,
}) => {
    const { accessToken } = useSelector(selector);
    const session = useSession();
    const dispatch = useDispatch();
    const emailAddress = safelyParse(session, 'data.user.email', parseAsString, null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm();
    const hasErrors = Object.keys(errors).length > 0;

    const onSubmit = async (data: FormData) => {
        if (hasErrors || !emailAddress || !accessToken) {
            return;
        }

        const { name, addressLineOne, addressLineTwo, city, company, county, firstName, lastName, phone, postcode } =
            data;

        setIsLoading(true);

        if (addressId) {
            const res = await editAddress(
                accessToken,
                id || '',
                addressId,
                name,
                addressLineOne,
                addressLineTwo,
                city,
                company,
                county,
                firstName,
                lastName,
                phone,
                postcode
            );

            if (res) {
                dispatch(addSuccess('Address updated!'));
                dispatch(fetchAddresses({ accessToken, emailAddress }));
                router.push('/account/addressBook');
            } else {
                dispatch(addError('Failed to update address.'));
            }
        } else {
            const res = await addAddress(
                accessToken,
                emailAddress,
                name,
                addressLineOne,
                addressLineTwo,
                city,
                company,
                county,
                firstName,
                lastName,
                phone,
                postcode
            );

            if (res) {
                dispatch(addSuccess('Address successfullly added!'));
                reset();
                dispatch(fetchAddresses({ accessToken, emailAddress }));
                router.push('/account/addressBook');
            } else {
                dispatch(addError('Unable to add address.'));
            }
        }

        setIsLoading(false);
    };

    const nameErr = safelyParse(errors, 'name.message', parseAsString, null);
    const firstNameErr = safelyParse(errors, 'firstName.message', parseAsString, null);
    const lastNameErr = safelyParse(errors, 'lastName.message', parseAsString, null);
    const companyErr = safelyParse(errors, 'company.message', parseAsString, null);
    const mobileErr = safelyParse(errors, 'mobile.message', parseAsString, null);
    const lineOneErr = safelyParse(errors, 'addressLineOne.message', parseAsString, null);
    const lineTwoErr = safelyParse(errors, 'addressLineTwo.message', parseAsString, null);
    const cityErr = safelyParse(errors, 'city.message', parseAsString, null);
    const postcodeErr = safelyParse(errors, 'postcode.message', parseAsString, null);
    const countyErr = safelyParse(errors, 'county.message', parseAsString, null);
    const btnText = addressId ? 'Save Address' : 'Add Address';

    useEffect(() => {
        if (name) {
            setValue('name', name);
        }
    }, [name, setValue]);

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
        if (addressLineOne) {
            setValue('addressLineOne', addressLineOne);
        }
    }, [addressLineOne, setValue]);

    useEffect(() => {
        if (addressLineTwo) {
            setValue('addressLineTwo', addressLineTwo);
        }
    }, [addressLineTwo, setValue]);

    useEffect(() => {
        if (city) {
            setValue('city', city);
        }
    }, [city, setValue]);

    useEffect(() => {
        if (postcode) {
            setValue('postcode', postcode);
        }
    }, [postcode, setValue]);

    useEffect(() => {
        if (county) {
            setValue('county', county);
        }
    }, [county, setValue]);

    useEffect(() => {
        if (company) {
            setValue('company', company);
        }
    }, [company, setValue]);

    useEffect(() => {
        if (phone) {
            setValue('phone', phone);
        }
    }, [phone, setValue]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full">
            <div className="flex flex-col md:flex-row relative w-full">
                <div className="card p-0 rounded-md w-full mb-4 md:w-1/2 md:p-4 md:mb-0">
                    <h3 className="card-title">Personal Details</h3>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Address Name</span>
                                <span className="label-text-alt">This is what we&apos;ll call your address.</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Address Name"
                                {...register('name', {
                                    required: { value: true, message: 'Required' },
                                })}
                                className={`input input-sm input-bordered${nameErr ? ' input-error' : ''}`}
                            />
                            {nameErr && (
                                <label className="label">
                                    <span className="label-text-alt">{nameErr}</span>
                                </label>
                            )}
                        </div>
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
                                <span className="label-text">Company</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Company"
                                {...register('company', {
                                    required: false,
                                })}
                                className={`input input-sm input-bordered${companyErr ? ' input-error' : ''}`}
                            />
                            {companyErr && (
                                <label className="label">
                                    <span className="label-text-alt">{companyErr}</span>
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
                <div className="card p-2 md:p-4 rounded-md w-full md:w-1/2">
                    <h3 className="card-title">Address Details</h3>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Address Line One</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Address Line One"
                                {...register('addressLineOne', {
                                    required: { value: true, message: 'Required' },
                                })}
                                className={`input input-sm input-bordered${lineOneErr ? ' input-error' : ''}`}
                            />
                            {lineOneErr && (
                                <label className="label">
                                    <span className="label-text-alt">{lineOneErr}</span>
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
                                {...register('addressLineTwo', { required: false })}
                                className={`input input-sm input-bordered${lineTwoErr ? ' input-error' : ''}`}
                            />
                            {lineTwoErr && (
                                <label className="label">
                                    <span className="label-text-alt">{lineTwoErr}</span>
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
                                {...register('city', {
                                    required: { value: true, message: 'Required' },
                                })}
                                className={`input input-sm input-bordered${cityErr ? ' input-error' : ''}`}
                            />
                            {cityErr && (
                                <label className="label">
                                    <span className="label-text-alt">{cityErr}</span>
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
                                {...register('postcode', {
                                    required: { value: true, message: 'Required' },
                                    pattern: {
                                        value: /^([A-Z][A-HJ-Y]?\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/gim,
                                        message: fieldPatternMsgs('postcode'),
                                    },
                                })}
                                className={`input input-sm input-bordered${postcodeErr ? ' input-error' : ''}`}
                            />
                            {postcodeErr && (
                                <label className="label">
                                    <span className="label-text-alt">{postcodeErr}</span>
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
                                {...register('county', {
                                    required: { value: true, message: 'Required' },
                                })}
                                className={`input input-sm input-bordered${countyErr ? ' input-error' : ''}`}
                            />
                            {countyErr && (
                                <label className="label">
                                    <span className="label-text-alt">{countyErr}</span>
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full justify-end p-4">
                <button
                    type="submit"
                    className={`btn${hasErrors ? ' btn-base-200 btn-disabled' : ' btn-primary'}${
                        isLoading ? ' loading btn-square' : ''
                    }`}
                >
                    {isLoading ? '' : btnText}
                </button>
            </div>
        </form>
    );
};

export default Fields;
