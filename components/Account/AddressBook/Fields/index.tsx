import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';

import { parseAsString, safelyParse } from '../../../../utils/parsers';
import { fieldPatternMsgs } from '../../../../utils/checkout';
import { addError, addSuccess } from '../../../../store/slices/alerts';
import { POSTCODE_PATTERN } from '../../../../regex';
import { BsPlusCircleFill } from 'react-icons/bs';
import { addAddress, editAddress } from '../../../../utils/account/address';

interface FieldProps {
    id?: string;
    addressId?: string;
    title?: string;
    lineOne?: string;
    lineTwo?: string;
    city?: string;
    company?: string;
    county?: string;
    postcode?: string;
}

export const Fields: React.FC<FieldProps> = ({
    id,
    addressId,
    title,
    lineOne,
    lineTwo,
    city,
    company,
    county,
    postcode,
}) => {
    const { data: session } = useSession();
    const dispatch = useDispatch();
    const userId = safelyParse(session, 'user.id', parseAsString, null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            title: title ? title : '',
            lineOne: lineOne ? lineOne : '',
            lineTwo: lineTwo ? lineTwo : '',
            city: city ? city : '',
            company: company ? company : '',
            county: county ? county : '',
            postcode: postcode ? postcode : '',
        },
    });
    const hasErrors = Object.keys(errors).length > 0;

    const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        if (hasErrors || !userId) {
            return;
        }

        const { title, lineOne, lineTwo, city, company, county, postcode } = data;

        setIsLoading(true);

        if (addressId) {
            const hasEdited = await editAddress({
                id,
                title,
                lineOne,
                lineTwo,
                city,
                postcode,
                company,
                county,
                country: 'GB',
                userId,
            });

            if (hasEdited) {
                dispatch(addSuccess('Address updated!'));
                router.push('/account/address-book');
            } else {
                dispatch(addError('Failed to update address.'));
            }
        } else {
            const hasAdded = await addAddress({
                title,
                lineOne,
                lineTwo,
                city,
                postcode,
                company,
                county,
                country: 'GB',
                userId,
            });

            if (hasAdded) {
                dispatch(addSuccess('Address successfullly added!'));
                reset();
                router.push('/account/address-book');
            } else {
                dispatch(addError('Unable to add address.'));
            }
        }

        setIsLoading(false);
    };

    const titleErr = safelyParse(errors, 'title.message', parseAsString, null);
    const lineOneErr = safelyParse(errors, 'addressLineOne.message', parseAsString, null);
    const cityErr = safelyParse(errors, 'city.message', parseAsString, null);
    const postcodeErr = safelyParse(errors, 'postcode.message', parseAsString, null);
    const countyErr = safelyParse(errors, 'county.message', parseAsString, null);
    const btnText = addressId ? 'Save Address' : 'Add Address';

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col relative w-full space-y-10">
                <div className="block">
                    <h3 className="card-title">Title</h3>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Address Title</span>
                                <span className="label-text-alt hidden lg:inline">
                                    This is what we&apos;ll call your address.
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Add address title..."
                                {...register('title', {
                                    required: { value: true, message: 'Required' },
                                })}
                                className={`input input-md input-bordered${titleErr ? ' input-error' : ''}`}
                            />
                            {titleErr && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{titleErr}</span>
                                </label>
                            )}
                        </div>
                    </div>
                </div>
                <div className="block">
                    <h3 className="card-title">Address Details</h3>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Address Line One</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Add the first line of your address..."
                                {...register('lineOne', {
                                    required: { value: true, message: 'Address line one required' },
                                })}
                                className={`input input-md input-bordered${lineOneErr ? ' input-error' : ''}`}
                            />
                            {lineOneErr && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{lineOneErr}</span>
                                </label>
                            )}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Address Line Two</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Add the second line of your address..."
                                {...register('lineTwo', { required: false })}
                                className="input input-md input-bordered"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">City</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Add your city..."
                                {...register('city', {
                                    required: { value: true, message: 'City is required' },
                                })}
                                className={`input input-md input-bordered${cityErr ? ' input-error' : ''}`}
                            />
                            {cityErr && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{cityErr}</span>
                                </label>
                            )}
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Postcode</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Add your postcode..."
                                {...register('postcode', {
                                    required: { value: true, message: 'Postcode is required' },
                                    pattern: {
                                        value: POSTCODE_PATTERN,
                                        message: fieldPatternMsgs('postcode'),
                                    },
                                })}
                                className={`input input-md input-bordered${postcodeErr ? ' input-error' : ''}`}
                            />
                            {postcodeErr && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{postcodeErr}</span>
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
                                    required: { value: true, message: 'County is required' },
                                })}
                                className={`input input-md input-bordered${countyErr ? ' input-error' : ''}`}
                            />
                            {countyErr && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{countyErr}</span>
                                </label>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex w-full justify-end">
                    <button
                        type="submit"
                        className={`btn lg:${hasErrors ? ' btn-base-200 btn-disabled' : ' btn-primary'}${
                            isLoading ? ' loading btn-square' : ''
                        }`}
                    >
                        {isLoading ? '' : btnText}
                        <BsPlusCircleFill className="w-6 h-6 ml-2" />
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Fields;
