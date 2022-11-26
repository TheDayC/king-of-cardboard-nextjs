import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineMailOutline } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { BiErrorCircle } from 'react-icons/bi';
import { useDispatch } from 'react-redux';

import { parseAsString, safelyParse } from '../../utils/parsers';
import { createUserToken } from '../../utils/auth';
import { setUserId, setUserToken, setUserTokenExpiry } from '../../store/slices/global';

interface Submit {
    emailAddress?: string;
    password?: string;
}

interface CredentialsProps {
    shouldRedirect: boolean;
}

export const Credentials: React.FC<CredentialsProps> = ({ shouldRedirect }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const hasErrors = Object.keys(errors).length > 0;
    const emailErr = safelyParse(errors, 'emailAddress.message', parseAsString, null);
    const passwordErr = safelyParse(errors, 'password.message', parseAsString, null);
    const dispatch = useDispatch();
    const btnErrClass = hasErrors ? ' btn-base-200 btn-disabled' : ' btn-primary';
    const btnLoadingClass = loading ? ' loading btn-square' : '';

    const onSubmit = async (data: Submit) => {
        const { emailAddress, password } = data;

        setLoading(true);

        const hasSignedIn = await signIn('credentials', { emailAddress, password, redirect: false });
        const formErr = safelyParse(hasSignedIn, 'error', parseAsString, null);
        setError(formErr ? 'Log in details incorrect.' : null);

        if (!formErr) {
            if (emailAddress && password) {
                const { token, id, expiry } = await createUserToken(emailAddress, password);

                dispatch(setUserToken(token));
                dispatch(setUserTokenExpiry(expiry));
                dispatch(setUserId(id));
            }

            if (shouldRedirect) {
                router.push('/account');
            }
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {error && (
                <div className="flex flex-row justify-center items-center rounded-md mb-6 p-2 text-neutral-content bg-red-600">
                    <BiErrorCircle className="inline-block w-6 h-6 mx-2 stroke-current" />
                    <label>{error}</label>
                </div>
            )}
            <div className="form-control">
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
                        <span className="label-text-alt">{emailErr}</span>
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
                        })}
                        className={`input input-md input-bordered w-full${passwordErr ? ' input-error' : ''}`}
                    />
                </label>
            </div>
            <div className="form-control mt-6">
                <button type="submit" className={`btn btn-block rounded-md${btnErrClass}${btnLoadingClass}`}>
                    {loading ? '' : 'Log In'}
                </button>
            </div>
        </form>
    );
};

export default Credentials;
