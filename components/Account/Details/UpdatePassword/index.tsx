import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiLockPasswordLine, RiLockPasswordFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';

import { parseAsString, safelyParse } from '../../../../utils/parsers';
import selector from './selector';
import { addError, addSuccess } from '../../../../store/slices/alerts';
import { updatePassword } from '../../../../utils/account';
import { useCustomSession } from '../../../../hooks/auth';

const PASS_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

interface SubmitData {
    password: string;
    confirmPassword: string;
}

export const UpdatePassword: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const password = watch('password', ''); // Watch password field for changes.
    const [loading, setLoading] = useState(false);
    const { data: session } = useCustomSession();
    const { accessToken: token } = useSelector(selector);
    const dispatch = useDispatch();

    const hasErrors = Object.keys(errors).length > 0;
    const passwordErr = safelyParse(errors, 'password.message', parseAsString, null);
    const confirmPasswordErr = safelyParse(errors, 'confirmPassword.message', parseAsString, null);
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);

    const onSubmit = async (data: SubmitData) => {
        const { password: newPassword, confirmPassword } = data;

        if (newPassword !== confirmPassword || !emailAddress || !token) return;

        setLoading(true);

        const res = await updatePassword(token, emailAddress, password);

        if (res) {
            dispatch(addSuccess('Password updated!'));
        } else {
            dispatch(addError('Failed to update password.'));
        }

        setLoading(false);
    };

    return (
        <React.Fragment>
            <div className="text-xs text-error">
                <p>Passwords must:</p>
                <ul className="list-disc list-inside pl-6 mb-4">
                    <li>Contain at least 8 characters</li>
                    <li>Contain at least 1 number</li>
                    <li>Contain at least 1 special character</li>
                </ul>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                            className={`input input-md input-bordered w-full${passwordErr ? ' input-error' : ''}`}
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
                            {confirmPasswordErr && <span className="label-text-alt">{confirmPasswordErr}</span>}
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
                        {loading ? '' : 'Update Password'}
                    </button>
                </div>
            </form>
        </React.Fragment>
    );
};

export default UpdatePassword;
