import React, { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { MdOutlineMailOutline } from 'react-icons/md';
import { useDispatch } from 'react-redux';

import { parseAsString, safelyParse } from '../../utils/parsers';
import { requestPasswordReset } from '../../utils/account';
import { addError, addSuccess } from '../../store/slices/alerts';
import { isBoolean } from '../../utils/typeguards';

export const ResetPassword: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);
    const hasErrors = Object.keys(errors).length > 0;
    const dispatch = useDispatch();

    const emailErr = safelyParse(errors, 'emailAddress.message', parseAsString, null);

    const onSubmit = async (data: FieldValues) => {
        setLoading(true);
        const email = safelyParse(data, 'emailAddress', parseAsString, null);

        if (!email) {
            dispatch(addError('Please enter a valid email address.'));
            setLoading(false);
            return;
        }

        const res = await requestPasswordReset(email);

        if (isBoolean(res)) {
            dispatch(addSuccess('A reset password link has been sent to your email!'));
        } else {
            dispatch(addError(res.description));
        }

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
