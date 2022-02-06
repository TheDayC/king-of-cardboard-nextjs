import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RiLockPasswordLine, RiLockPasswordFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';

import { parseAsString, safelyParse } from '../../../../utils/parsers';
import selector from './selector';
import { addError, addSuccess } from '../../../../store/slices/alerts';
import { updatePassword } from '../../../../utils/account';
import { PASS_PATTERN } from '../../../../regex';

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
    const session = useSession();
    const { accessToken: token } = useSelector(selector);
    const dispatch = useDispatch();

    const hasErrors = Object.keys(errors).length > 0;
    const passwordTypeErr = safelyParse(errors, 'password.type', parseAsString, null);
    const confirmPasswordTypeErr = safelyParse(errors, 'confirmPassword.type', parseAsString, null);
    const emailAddress = safelyParse(session, 'data.user.email', parseAsString, null);

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
                                required: true,
                                pattern: PASS_PATTERN,
                                validate: {
                                    notEmpty: (value: string) => value.length > 0,
                                },
                            })}
                            className={`input input-md input-bordered w-full${passwordTypeErr ? ' input-error' : ''}`}
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
                                Passwords must contain at least 8 characters, 1 captial, 1 number &amp; 1 special
                                character.
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
                                required: true,
                                pattern: PASS_PATTERN,
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
                                Passwords must contain at least 8 characters, 1 captial, 1 number &amp; 1 special
                                character.
                            </span>
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
