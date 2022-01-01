import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineMailOutline } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { signIn } from 'next-auth/react';

import { parseAsString, safelyParse } from '../../utils/parsers';

interface Submit {
    emailAddress?: string;
    password?: string;
}

export const Credentials: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);
    const hasErrors = Object.keys(errors).length > 0;
    const emailErr = safelyParse(errors, 'emailAddress.message', parseAsString, null);
    const passwordErr = safelyParse(errors, 'password.message', parseAsString, null);

    const onSubmit = async (data: Submit) => {
        const { emailAddress, password } = data;

        setLoading(true);

        await signIn('credentials', { emailAddress, password });

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                <button
                    type="submit"
                    className={`btn btn-block rounded-md${hasErrors ? ' btn-base-200 btn-disabled' : ' btn-primary'}${
                        loading ? ' loading btn-square' : ''
                    }`}
                >
                    {loading ? '' : 'Log In'}
                </button>
            </div>
        </form>
    );
};

export default Credentials;
