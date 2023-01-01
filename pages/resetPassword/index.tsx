import React, { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { RiLockPasswordLine, RiLockPasswordFill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { BiRefresh } from 'react-icons/bi';
import { unstable_getServerSession } from 'next-auth';

import { parseAsString, safelyParse } from '../../utils/parsers';
import { addError, addSuccess } from '../../store/slices/alerts';
import { resetPassword } from '../../utils/account';
import PageWrapper from '../../components/PageWrapper';
import { PASS_PATTERN } from '../../regex';
import { authOptions } from '../api/auth/[...nextauth]';
import { isBoolean } from '../../utils/typeguards';

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
    const session = await unstable_getServerSession(req, res, authOptions);
    const token = safelyParse(query, 'token', parseAsString, null);
    const email = safelyParse(query, 'email', parseAsString, null);

    // If the user is already signed in then we can trust them so we can send them to the details page.
    if (session) {
        return {
            redirect: {
                permanent: false,
                destination: '/account/details',
            },
        };
    }

    if (!token || !email) {
        return {
            redirect: {
                permanent: false,
                destination: '/login',
            },
        };
    }

    // If we're signed in then decide whether we should show the page or 404.
    return {
        props: { token, email },
    };
};

interface ResetPasswordPageProps {
    token: string;
    email: string;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ token, email }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch('password', ''); // Watch password field for changes.
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const hasErrors = Object.keys(errors).length > 0;
    const passwordTypeErr = safelyParse(errors, 'password.type', parseAsString, null);
    const confirmPasswordTypeErr = safelyParse(errors, 'confirmPassword.type', parseAsString, null);

    const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        const { password: newPassword, confirmPassword } = data;

        if (newPassword !== confirmPassword || !email || !token) return;

        setLoading(true);

        const res = await resetPassword(token, password, email);

        if (isBoolean(res)) {
            dispatch(addSuccess('Password reset!'));

            setLoading(false);
            router.push('/login');
        } else {
            dispatch(addError(res.description));
        }

        setLoading(false);
    };

    return (
        <PageWrapper title="Reset Password - King of Cardboard" description="Reset your account password.">
            <div className="flex flex-col w-full justify-start items-center">
                <h1 className="text-xl mb-4">
                    Reset password for <b>{email}</b>
                </h1>
                <div className="text-md text-error">
                    <p>Passwords must contain at least:</p>
                    <ul className="list-disc list-inside pl-6 mb-2">
                        <li>8 characters</li>
                        <li>1 capital letter</li>
                        <li>1 number</li>
                        <li>1 special character</li>
                    </ul>
                </div>

                <div className="flex flex-col w-full lg:w-1/3 justify-start items-center p-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                        <div className="form-control mt-2">
                            <label className="input-group input-group-md">
                                <span className="bg-base-200">
                                    <RiLockPasswordLine className="w-5 h-5" />
                                </span>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    {...register('password', {
                                        required: true,
                                        pattern: PASS_PATTERN,
                                        validate: {
                                            notEmpty: (value: string) => value.length > 0,
                                        },
                                    })}
                                    className={`input input-md input-bordered w-full${
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
                                        Passwords must contain at least 8 characters, 1 captial, 1 number &amp; 1
                                        special character.
                                    </span>
                                </label>
                            )}
                        </div>
                        <div className="form-control mt-2">
                            <label className="input-group input-group-md">
                                <span className="bg-base-200">
                                    <RiLockPasswordFill className="w-5 h-5" />
                                </span>
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    {...register('confirmPassword', {
                                        required: { value: true, message: 'Confirm Password required' },
                                        pattern: {
                                            value: PASS_PATTERN,
                                            message: 'Password confirmation must follow rules.',
                                        },
                                        validate: {
                                            sameAsPassword: (value: string) => value === password,
                                        },
                                    })}
                                    className={`input input-md input-bordered w-full${
                                        confirmPasswordTypeErr ? ' input-error' : ''
                                    }`}
                                />
                            </label>
                            {confirmPasswordTypeErr === 'required' && (
                                <label className="label text-left">
                                    <span className="label-text-alt text-error">Confirm password is required.</span>
                                </label>
                            )}
                            {confirmPasswordTypeErr === 'pattern' && (
                                <label className="label text-left">
                                    <span className="label-text-alt text-error">
                                        Passwords must contain at least 8 characters, 1 captial, 1 number &amp; 1
                                        special character.
                                    </span>
                                </label>
                            )}
                        </div>
                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className={`btn btn-block w-full${
                                    hasErrors ? ' btn-base-200 btn-disabled' : ' btn-primary'
                                }${loading ? ' loading btn-square' : ''}`}
                            >
                                {!loading && (
                                    <React.Fragment>
                                        Update Password
                                        <BiRefresh className="inline-block w-6 h-6 ml-2" />
                                    </React.Fragment>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </PageWrapper>
    );
};

export default ResetPasswordPage;
