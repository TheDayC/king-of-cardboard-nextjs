import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineMailOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import { parseAsString, safelyParse } from '../../utils/parsers';
import selector from './selector';
import { requestPasswordReset } from '../../utils/account';
import { addError, addSuccess } from '../../store/slices/alerts';

interface Submit {
    emailAddress?: string;
}

export const ResetPassword: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);
    const hasErrors = Object.keys(errors).length > 0;
    const { accessToken } = useSelector(selector);
    const dispatch = useDispatch();

    const emailErr = safelyParse(errors, 'emailAddress.message', parseAsString, null);

    const onSubmit = async (data: Submit) => {
        setLoading(true);
        const email = safelyParse(data, 'emailAddress', parseAsString, null);

        if (!accessToken || !email) {
            return;
        }

        const res = await requestPasswordReset(accessToken, email);

        if (res) {
            dispatch(addSuccess('A reset password link has been sent to your email!'));
        } else {
            dispatch(addError('Failed to reset your password.'));
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
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
                    <label className="label">{emailErr && <span className="label-text-alt">{emailErr}</span>}</label>
                )}
            </div>
            <div className="form-control mt-6">
                <button
                    type="submit"
                    className={`btn btn-block w-full${hasErrors ? ' btn-base-200 btn-disabled' : ' btn-primary'}${
                        loading ? ' loading btn-square' : ''
                    }`}
                >
                    {loading ? '' : 'Reset Password'}
                </button>
            </div>
        </form>
    );
};

export default ResetPassword;
