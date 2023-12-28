import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { BsClipboardPlus, BsEnvelope, BsKey, BsPersonCircle } from 'react-icons/bs';

import { parseAsString, safelyParse } from '../../utils/parsers';
import { addError, addSuccess } from '../../store/slices/alerts';
import { EMAIL_PATTERN, PASS_PATTERN, USER_PATTERN } from '../../regex';

interface Submit {
    displayName?: string;
    emailAddress?: string;
    confirmEmailAddress?: string;
    password?: string;
    confirmPassword?: string;
}

export const Register: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);
    const [responseError, setResponseError] = useState<string | null>(null);
    const hasErrors = Object.keys(errors).length > 0;
    const router = useRouter();
    const dispatch = useDispatch();

    const displayNameTypeErr = safelyParse(errors, 'displayName.type', parseAsString, null);
    const emailTypeErr = safelyParse(errors, 'emailAddress.type', parseAsString, null);
    const passwordTypeErr = safelyParse(errors, 'password.type', parseAsString, null);
    const agreedErr = safelyParse(errors, 'agreed.message', parseAsString, null);
    const error = safelyParse(router, 'query.error', parseAsString, null);

    const onSubmit = async (data: Submit) => {
        setLoading(true);
        const { displayName, emailAddress, password } = data;

        if (!displayName || !emailAddress || !password) return;

        const hasSignedIn = await signIn('credentials', { displayName, emailAddress, password, redirect: false });

        if (hasSignedIn) {
            dispatch(addSuccess('Registration Successful!'));
            //await signIn('credentials', { displayName, emailAddress, password, redirect: false });
        } else {
            setResponseError('Details are invalid or user already exists.');
        }

        setLoading(false);
    };

    useEffect(() => {
        setResponseError(error ? 'Invalid Credentials.' : null);
    }, [error]);

    useEffect(() => {
        if (responseError) {
            dispatch(addError(responseError));
        }
    }, [responseError, dispatch]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
                <label className="input-group input-group-md join">
                    <span className="bg-base-200 p-2 px-4 flex flex-row items-center join-item">
                        <BsPersonCircle className="text-2xl" />
                    </span>
                    <input
                        type="text"
                        placeholder="Display name"
                        {...register('displayName', {
                            required: { value: true, message: 'Display name required' },
                            pattern: USER_PATTERN,
                        })}
                        className={`input input-md input-bordered w-full join-item${
                            displayNameTypeErr ? ' input-error' : ''
                        }`}
                    />
                </label>
                {displayNameTypeErr === 'required' && (
                    <label className="label">
                        <span className="label-text-alt text-error">Username required.</span>
                    </label>
                )}
                {displayNameTypeErr === 'pattern' && (
                    <label className="label">
                        <span className="label-text-alt text-error">
                            Usernames must be a min of 4 characters and only contain letters and numbers.
                        </span>
                    </label>
                )}
            </div>
            <div className="form-control mt-2">
                <label className="input-group input-group-md join">
                    <span className="bg-base-200 p-2 px-4 flex flex-row items-center join-item">
                        <BsEnvelope className="text-2xl" />
                    </span>
                    <input
                        type="text"
                        placeholder="Email Address"
                        {...register('emailAddress', {
                            required: true,
                            pattern: EMAIL_PATTERN,
                        })}
                        className={`input input-md input-bordered w-full join-item${
                            emailTypeErr ? ' input-error' : ''
                        }`}
                    />
                </label>
                {emailTypeErr === 'required' && (
                    <label className="label">
                        <span className="label-text-alt text-error">Email address required.</span>
                    </label>
                )}
                {emailTypeErr === 'pattern' && (
                    <label className="label">
                        <span className="label-text-alt text-error">
                            Must be a valid email address inline with the RFC 5322 official standard.
                        </span>
                    </label>
                )}
            </div>
            <div className="form-control mt-2">
                <label className="input-group input-group-md join">
                    <span className="bg-base-200 p-2 px-4 flex flex-row items-center join-item">
                        <BsKey className="text-2xl" />
                    </span>
                    <input
                        type="password"
                        placeholder="Password"
                        {...register('password', {
                            required: true,
                            pattern: PASS_PATTERN,
                        })}
                        className={`input input-md input-bordered w-full join-item${
                            passwordTypeErr ? ' input-error' : ''
                        }`}
                    />
                </label>
                {passwordTypeErr === 'required' && (
                    <label className="label text-left">
                        <span className="label-text-alt text-error">Password is required.</span>
                    </label>
                )}
                {passwordTypeErr === 'pattern' && (
                    <label className="label text-left">
                        <span className="label-text-alt text-error">
                            Passwords must contain at least 8 characters, 1 captial, 1 number &amp; 1 special character.
                        </span>
                    </label>
                )}
            </div>
            <div className="divider lightDivider"></div>
            <div className="form-control">
                <label className="cursor-pointer label p-0">
                    <span className="label-text text-sm text-left">
                        Confirm that you understand and agree to our{' '}
                        <Link href="/legal/terms-and-conditions" passHref>
                            <span className="text-sm text-secondary hover:underline">Terms & conditions</span>
                        </Link>{' '}
                        and our{' '}
                        <Link href="/legal/privacy-policy" passHref>
                            <span className="text-sm text-secondary hover:underline">Privacy Policy.</span>
                        </Link>
                    </span>

                    <input
                        type="checkbox"
                        className="checkbox rounded-sm w-6 h-6 ml-2"
                        {...register('agreed', {
                            required: {
                                value: true,
                                message:
                                    'You must agree to our Terms and Conditions and Privacy Policy before signing up.',
                            },
                        })}
                    />
                </label>
                {agreedErr && (
                    <label className="label text-left">
                        {agreedErr && <span className="label-text-alt text-error">{agreedErr}</span>}
                    </label>
                )}
            </div>
            <div className="form-control mt-6">
                <button
                    type="submit"
                    className={`btn btn-block w-full${hasErrors ? ' btn-base-200 btn-disabled' : ' btn-primary'}${
                        loading ? ' loading btn-square' : ''
                    }`}
                >
                    {loading ? '' : 'Register'}
                    <BsClipboardPlus className="text-2xl" />
                </button>
            </div>
        </form>
    );
};

export default Register;
