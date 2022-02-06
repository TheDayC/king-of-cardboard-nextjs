import React, { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlineUser } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';

import { parseAsString, safelyParse } from '../../../../utils/parsers';
import { addError, addSuccess } from '../../../../store/slices/alerts';
import { updateUsername } from '../../../../utils/account';
import { USER_PATTERN } from '../../../../regex';

export const UpdateUsername: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const dispatch = useDispatch();

    const hasErrors = Object.keys(errors).length > 0;
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);
    const usernameTypeErr = safelyParse(errors, 'username.type', parseAsString, null);

    const onSubmit: SubmitHandler<FieldValues> = async (data: FieldValues) => {
        const { username } = data;

        if (!username || !emailAddress) return;

        setLoading(true);

        const hasUpdatedUsername = await updateUsername(emailAddress, username);

        if (hasUpdatedUsername) {
            dispatch(addSuccess('Username updated!'));
        } else {
            dispatch(addError('Failed to update username.'));
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
                <label className="input-group input-group-md">
                    <span className="bg-base-200">
                        <AiOutlineUser className="w-5 h-5" />
                    </span>
                    <input
                        type="text"
                        placeholder="Username"
                        {...register('username', {
                            required: { value: true, message: 'Username required' },
                            pattern: USER_PATTERN,
                        })}
                        className={`input input-md input-bordered w-full${usernameTypeErr ? ' input-error' : ''}`}
                    />
                </label>
                {usernameTypeErr === 'required' && (
                    <label className="label">
                        <span className="label-text-alt text-error">Username required.</span>
                    </label>
                )}
                {usernameTypeErr === 'pattern' && (
                    <label className="label">
                        <span className="label-text-alt text-error">
                            Usernames must be a min of 4 characters and only contain letters and numbers.
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
                    {loading ? '' : 'Update Username'}
                </button>
            </div>
        </form>
    );
};

export default UpdateUsername;
