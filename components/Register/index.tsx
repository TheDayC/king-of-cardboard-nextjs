import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { get } from 'lodash';
import axios from 'axios';
import { AiOutlineUser } from 'react-icons/ai';
import { MdOutlineMailOutline } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';

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

export const Register: React.FC = () => {
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
        const { username, emailAddress, password } = data;

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
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control p-4 pb-0 mt-4">
                <label className="input-group input-group-md">
                    <span className="bg-base-200">
                        <AiOutlineUser />
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
            <div className="form-control p-4 pb-0">
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
                {emailErr ||
                    (confirmEmailErr && (
                        <label className="label">
                            {emailErr && <span className="label-text-alt">{emailErr}</span>}
                            {confirmEmailErr && <span className="label-text-alt">Email addresses must match.</span>}
                        </label>
                    ))}
            </div>
            <div className="form-control p-4">
                <label className="input-group input-group-md">
                    <span className="bg-base-200">
                        <RiLockPasswordLine />
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
                {passwordErr ||
                    (confirmPasswordErr && (
                        <label className="label">
                            {passwordErr && <span className="label-text-alt">{passwordErr}</span>}
                            {confirmPasswordErr && <span className="label-text-alt">Passwords must match.</span>}
                        </label>
                    ))}
            </div>
            <div className="form-control p-4 pb-0">
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
