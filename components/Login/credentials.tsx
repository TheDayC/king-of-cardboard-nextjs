import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { get } from 'lodash';
import axios from 'axios';

interface Submit {
    username?: string;
    password?: string;
}

interface CredentialsProps {
    signinUrl: string;
    callbackUrl: string;
    csrfToken: string;
}

export const Credentials: React.FC<CredentialsProps> = ({ signinUrl, callbackUrl, csrfToken }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);
    const hasErrors = Object.keys(errors).length > 0;

    const onSubmit = async (data: Submit) => {
        const { username, password } = data;

        const response = await axios.post('/api/auth/callback/credentials', {
            username,
            password,
            csrfToken,
        });
    };

    const usernameErr = get(errors, 'username.message', null);
    const passwordErr = get(errors, 'password.message', null);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col w-full justify-center items-center">
                <div className="flex flex-col w-1/4">
                    <input
                        type="text"
                        placeholder="Username"
                        {...register('username', {
                            required: { value: true, message: 'Username required' },
                        })}
                        className={`input input-sm mb-4 input-bordered${usernameErr ? ' input-error' : ''}`}
                    />
                    {usernameErr && (
                        <label className="label">
                            <span className="label-text-alt">{usernameErr}</span>
                        </label>
                    )}
                    <input
                        type="password"
                        placeholder="Password"
                        {...register('password', {
                            required: { value: true, message: 'Password required' },
                        })}
                        className={`input input-sm mb-4 input-bordered${passwordErr ? ' input-error' : ''}`}
                    />
                    {passwordErr && (
                        <label className="label">
                            <span className="label-text-alt">{passwordErr}</span>
                        </label>
                    )}
                    <button
                        type="submit"
                        className={`btn${hasErrors ? ' btn-base-200 btn-disabled' : ' btn-secondary'}${
                            loading ? ' loading btn-square' : ''
                        }`}
                    >
                        {loading ? '' : 'Sign In'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Credentials;
