import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { AiOutlineUser } from 'react-icons/ai';
import { MdOutlineMailOutline } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';

import { Tabs } from '../../enums/auth';
import { parseAsString, safelyParse } from '../../utils/parsers';
import selector from './selector';
import { addError } from '../../store/slices/alerts';
import { registerUser } from '../../utils/auth';

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

interface RegisterProps {
    setCurrentTab(tab: Tabs): void;
    setRegSuccess(regSuccess: boolean): void;
}

export const Register: React.FC<RegisterProps> = ({ setCurrentTab, setRegSuccess }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);
    const [responseError, setResponseError] = useState<string | null>(null);
    const hasErrors = Object.keys(errors).length > 0;
    const router = useRouter();
    const { accessToken } = useSelector(selector);
    const dispatch = useDispatch();

    const usernameErr = safelyParse(errors, 'username.message', parseAsString, null);
    const emailErr = safelyParse(errors, 'emailAddress.message', parseAsString, null);
    const confirmEmailErr = safelyParse(errors, 'confirmEmailAddress.message', parseAsString, null);
    const passwordErr = safelyParse(errors, 'password.message', parseAsString, null);
    const confirmPasswordErr = safelyParse(errors, 'confirmPassword.message', parseAsString, null);
    const error = safelyParse(router, 'query.error', parseAsString, null);

    const onSubmit = async (data: Submit) => {
        setLoading(true);
        const { username, emailAddress, password } = data;

        if (!accessToken || !username || !emailAddress || !password) return;

        const res = await registerUser(accessToken, username, emailAddress, password);

        if (res) {
            setCurrentTab(Tabs.Login);
            setRegSuccess(true);
        } else {
            setResponseError('Details are invalid or user already exists.');
            setRegSuccess(false);
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
                <label className="input-group input-group-md">
                    <span className="bg-base-200">
                        <AiOutlineUser className="w-5 h-5" />
                    </span>
                    <input
                        type="text"
                        placeholder="Username"
                        {...register('username', {
                            required: { value: true, message: 'Username required' },
                            pattern: USER_PATTERN,
                        })}
                        className={`input input-md input-bordered w-full${usernameErr ? ' input-error' : ''}`}
                    />
                </label>
                {usernameErr && (
                    <label className="label">
                        <span className="label-text-alt">{usernameErr}</span>
                    </label>
                )}
            </div>
            <div className="form-control mt-2">
                <label className="input-group input-group-md">
                    <span className="bg-base-200">
                        <MdOutlineMailOutline className="w-5 h-5" />
                    </span>
                    <input
                        type="text"
                        placeholder="Email Address"
                        {...register('emailAddress', {
                            required: { value: true, message: 'Email address required' },
                        })}
                        className={`input input-md input-bordered w-full${emailErr ? ' input-error' : ''}`}
                    />
                </label>
                {emailErr && (
                    <label className="label">
                        {emailErr && <span className="label-text-alt">{emailErr}</span>}
                        {confirmEmailErr && <span className="label-text-alt">Email addresses must match.</span>}
                    </label>
                )}
            </div>
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
                            pattern: PASS_PATTERN,
                        })}
                        className={`input input-md input-bordered w-full${passwordErr ? ' input-error' : ''}`}
                    />
                </label>
                {passwordErr && (
                    <label className="label">
                        {passwordErr && <span className="label-text-alt">{passwordErr}</span>}
                        {confirmPasswordErr && <span className="label-text-alt">Passwords must match.</span>}
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
                </button>
            </div>
        </form>
    );
};

export default Register;
