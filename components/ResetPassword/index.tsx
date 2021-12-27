import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdOutlineMailOutline } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import { parseAsString, safelyParse } from '../../utils/parsers';
import selector from './selector';
import { requestResetPassword } from '../../utils/account';
import { AlertLevel } from '../../enums/system';

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
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
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

        const hasSent = await requestResetPassword(accessToken, email);

        if (hasSent) {
            setError(null);
            setSuccess('Reset password link sent!');
        } else {
            setError('We were unable to reset your password.');
            setSuccess(null);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (error) {
            dispatch({ message: error, level: AlertLevel.Error });
        }
    }, [error]);

    useEffect(() => {
        if (success) {
            dispatch({ message: success, level: AlertLevel.Success });
        }
    }, [success]);

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
