import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { get } from 'lodash';
import axios from 'axios';

import Header from '../../components/Header';
import Credentials from '../../components/Login/credentials';

interface Submit {
    username?: string;
    emailAddress?: string;
    confirmEmailAddress?: string;
    password?: string;
    confirmPassword?: string;
}

// Regexp
const USER_PATTERN = /^[a-zA-Z]{4,}$/;
const PASS_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const RegisterPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();
    const [loading, setLoading] = useState(false);
    const hasErrors = Object.keys(errors).length > 0;
    const emailAddress = watch('emailAddress', ''); // Watch email field for changes.
    const password = watch('password', ''); // Watch password field for changes.

    const onSubmit = async (data: Submit) => {
        const { username, emailAddress, confirmEmailAddress, password, confirmPassword } = data;
        const emailsMatch = emailAddress === confirmEmailAddress;
        const passwordsMatch = password === confirmPassword;

        if (!emailsMatch || !passwordsMatch) {
            return;
        }

        try {
            const response = await axios.post('/api/register', {
                username,
                emailAddress,
                password,
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('🚀 ~ file: index.tsx ~ line 50 ~ onSubmit ~ error', error);
            } else {
                console.log('🚀 ~ file: index.tsx ~ line 50 ~ onSubmit ~ error', error);
            }
        }
    };

    const usernameErr = get(errors, 'username.message', null);
    const emailErr = get(errors, 'emailAddress.message', null);
    const confirmEmailErr = get(errors, 'confirmEmailAddress.message', null);
    const passwordErr = get(errors, 'emailAddress.message', null);
    const confirmPasswordErr = get(errors, 'confirmEmailAddress.message', null);

    return (
        <React.Fragment>
            <Header />
            <div className="flex p-4 relative">
                <div className="container mx-auto">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col w-full justify-center items-center">
                            <div className="flex flex-col w-1/3 card text-center shadow-2xl">
                                <div className="card-body">
                                    <h1 className="card-title text-3xl">Register</h1>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Username</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            {...register('username', {
                                                required: { value: true, message: 'Username required' },
                                                pattern: USER_PATTERN,
                                            })}
                                            className={`input input-sm mb-4 input-bordered${
                                                usernameErr ? ' input-error' : ''
                                            }`}
                                        />
                                        {usernameErr && (
                                            <label className="label">
                                                <span className="label-text-alt">{usernameErr}</span>
                                            </label>
                                        )}
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Email Address</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Email Address"
                                            {...register('emailAddress', {
                                                required: { value: true, message: 'Email address required' },
                                            })}
                                            className={`input input-sm mb-4 input-bordered${
                                                emailErr ? ' input-error' : ''
                                            }`}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Confirm Email Address"
                                            {...register('confirmEmailAddress', {
                                                required: true,
                                                validate: {
                                                    sameAsEmail: (value: string) => value === emailAddress,
                                                },
                                            })}
                                            className={`input input-sm mb-4 input-bordered${
                                                emailErr ? ' input-error' : ''
                                            }`}
                                        />
                                        {emailErr ||
                                            (confirmEmailErr && (
                                                <label className="label">
                                                    {emailErr && <span className="label-text-alt">{emailErr}</span>}
                                                    {confirmEmailErr && (
                                                        <span className="label-text-alt">
                                                            Email addresses must match.
                                                        </span>
                                                    )}
                                                </label>
                                            ))}
                                    </div>
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text">Password</span>
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            {...register('password', {
                                                required: { value: true, message: 'Password required' },
                                                pattern: PASS_PATTERN,
                                            })}
                                            className={`input input-sm mb-4 input-bordered${
                                                passwordErr ? ' input-error' : ''
                                            }`}
                                        />
                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            {...register('confirmPassword', {
                                                required: true,
                                                validate: {
                                                    sameAsPassword: (value: string) => value === password,
                                                },
                                            })}
                                            className={`input input-sm mb-4 input-bordered${
                                                confirmPasswordErr ? ' input-error' : ''
                                            }`}
                                        />
                                        {passwordErr ||
                                            (confirmPasswordErr && (
                                                <label className="label">
                                                    {passwordErr && (
                                                        <span className="label-text-alt">{passwordErr}</span>
                                                    )}
                                                    {confirmPasswordErr && (
                                                        <span className="label-text-alt">Passwords must match.</span>
                                                    )}
                                                </label>
                                            ))}
                                    </div>
                                    <div className="justify-center card-actions">
                                        <button
                                            type="submit"
                                            className={`btn${
                                                hasErrors ? ' btn-base-200 btn-disabled' : ' btn-primary'
                                            }${loading ? ' loading btn-square' : ''}`}
                                        >
                                            {loading ? '' : 'Register'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </React.Fragment>
    );
};

export default RegisterPage;
