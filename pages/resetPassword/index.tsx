import React, { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import Error from 'next/error';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { RiLockPasswordLine, RiLockPasswordFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { GetServerSideProps } from 'next';

import Header from '../../components/Header';
import { ServerSideRedirectProps } from '../../types/pages';
import { parseAsString, safelyParse } from '../../utils/parsers';
import { addAlert } from '../../store/slices/alerts';
import { AlertLevel } from '../../enums/system';
import selector from './selector';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const resetToken = safelyParse(context, 'query.token', parseAsString, null);
    const emailAddress = safelyParse(context, 'query.email', parseAsString, null);
    const id = safelyParse(context, 'query.id', parseAsString, null);
    const errorCode = resetToken && id ? false : 404;

    // If the user is already signed in then we can trust them so we can send them to the details page.
    if (session) {
        return {
            redirect: {
                permanent: false,
                destination: '/account/details',
            },
        };
    }

    // If we're signed in then decide whether we should show the page or 404.
    return {
        props: { errorCode, resetToken, emailAddress, id },
    };
};

const PASS_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

interface SubmitData {
    password: string;
    confirmPassword: string;
}

interface ResetPasswordPageProps {
    errorCode: number | boolean;
    resetToken: string | null;
    emailAddress: string | null;
    id: string | null;
}

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ errorCode, resetToken, emailAddress, id }) => {
    const { accessToken } = useSelector(selector);
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const password = watch('password', ''); // Watch password field for changes.
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const dispatch = useDispatch();

    const hasErrors = Object.keys(errors).length > 0;
    const passwordErr = safelyParse(errors, 'password.message', parseAsString, null);
    const confirmPasswordErr = safelyParse(errors, 'confirmPassword.message', parseAsString, null);

    const onSubmit = async (data: SubmitData) => {
        const { password: newPassword, confirmPassword } = data;

        if (newPassword !== confirmPassword || !emailAddress) return;

        setLoading(true);

        try {
            const response = await axios.post('/api/account/resetPassword', {
                password: newPassword,
                confirmPassword,
                token: accessToken,
                resetToken,
                id,
            });

            if (response) {
                setSuccess('Password Updated!');
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);

            if (axios.isAxiosError(error)) {
                console.log('🚀 ~ file: index.tsx ~ line 50 ~ onSubmit ~ error', error);
            } else {
                console.log('🚀 ~ file: index.tsx ~ line 50 ~ onSubmit ~ error', error);
            }
        }
    };

    useEffect(() => {
        if (success) {
            dispatch(addAlert({ message: success, level: AlertLevel.Success }));
        }
    }, [success]);

    // Show error page if a code is provided.
    if (errorCode && typeof errorCode === 'number') {
        return <Error statusCode={errorCode} />;
    }

    return (
        <React.Fragment>
            <Header />
            <div className="flex p-0 md:p-4 relative">
                <div className="container mx-auto">
                    <div className="flex flex-col w-full justify-start items-center">
                        <h1 className="text-xl mb-4">
                            Reset password for <b>{emailAddress}</b>
                        </h1>
                        <div className="text-md text-error">
                            <p>Passwords must:</p>
                            <ul className="list-disc list-inside pl-6 mb-2">
                                <li>Contain at least 8 characters</li>
                                <li>Contain at least 1 number</li>
                                <li>Contain at least 1 special character</li>
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
                                                required: { value: true, message: 'Password required' },
                                                pattern: {
                                                    value: PASS_PATTERN,
                                                    message: 'Password confirmation must follow rules.',
                                                },
                                                validate: {
                                                    notEmpty: (value: string) => value.length > 0,
                                                },
                                            })}
                                            className={`input input-md input-bordered w-full${
                                                passwordErr ? ' input-error' : ''
                                            }`}
                                        />
                                    </label>
                                    {passwordErr && (
                                        <label className="label">
                                            {passwordErr && <span className="label-text-alt">{passwordErr}</span>}
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
                                                confirmPasswordErr ? ' input-error' : ''
                                            }`}
                                        />
                                    </label>
                                    {confirmPasswordErr && (
                                        <label className="label">
                                            {confirmPasswordErr && (
                                                <span className="label-text-alt">{confirmPasswordErr}</span>
                                            )}
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
                                        {loading ? '' : 'Update Password'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ResetPasswordPage;
