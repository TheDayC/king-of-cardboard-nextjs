import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { get } from 'lodash';
import axios from 'axios';
import { MdOutlineMailOutline } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { signIn } from 'next-auth/react';

interface Submit {
    emailAddress?: string;
    password?: string;
}

interface CredentialsProps {
    signinUrl: string;
    callbackUrl: string;
}

export const Credentials: React.FC<CredentialsProps> = ({ signinUrl, callbackUrl }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);
    const hasErrors = Object.keys(errors).length > 0;

    const onSubmit = async (data: Submit) => {
        const { emailAddress, password } = data;

        signIn('credentials', { emailAddress, password });
    };

    const emailErr = get(errors, 'emailAddress.message', null);
    const passwordErr = get(errors, 'password.message', null);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control p-4 pb-0 pt-8">
                <label className="input-group input-group-md">
                    <span className="bg-base-200">
                        <MdOutlineMailOutline />
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
            <div className="form-control p-4 pb-0">
                <label className="input-group input-group-md">
                    <span className="bg-base-200">
                        <RiLockPasswordLine />
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
            <div className="form-control p-4 pb-2">
                <button
                    type="submit"
                    className={`btn mt-4 btn-block rounded-md${
                        hasErrors ? ' btn-base-200 btn-disabled' : ' btn-primary'
                    }${loading ? ' loading btn-square' : ''}`}
                >
                    {loading ? '' : 'Log In'}
                </button>
            </div>
        </form>
    );
};

export default Credentials;
