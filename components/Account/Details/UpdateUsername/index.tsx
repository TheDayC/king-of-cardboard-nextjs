import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineUser } from 'react-icons/ai';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';

import { parseAsString, safelyParse } from '../../../../utils/parsers';
import { addError, addSuccess } from '../../../../store/slices/alerts';
import { updateUsername } from '../../../../utils/account';

const USER_PATTERN = /^[a-zA-Z]{4,}$/;

interface SubmitData {
    username: string;
}

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
    const usernameErr = safelyParse(errors, 'username.message', parseAsString, null);
    const emailAddress = safelyParse(session, 'user.email', parseAsString, null);

    const onSubmit = async (data: SubmitData) => {
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
        <React.Fragment>
            <div className="text-xs text-error">
                <p>Usernames must:</p>
                <ul className="list-disc list-inside pl-6 mb-4">
                    <li>Contain a minimum of 4 characters.</li>
                    <li>Contain a maximum of 20 characters.</li>
                    <li>Not begin with an underscore or period.</li>
                    <li>Not end with an underscore or period.</li>
                    <li>Not contain any special characters.</li>
                </ul>
            </div>
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
                            className={`input input-md input-bordered w-full${usernameErr ? ' input-error' : ''}`}
                        />
                    </label>
                    {usernameErr && (
                        <label className="label">
                            <span className="label-text-alt">{usernameErr}</span>
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
        </React.Fragment>
    );
};

export default UpdateUsername;
